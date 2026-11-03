import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory or environment-based Scopus & Web of Science configuration
let scopusConfig = {
  apiKey: process.env.SCOPUS_API_KEY || '',
  apiUrl: process.env.SCOPUS_API_URL || 'https://api.elsevier.com/content/serial/title',
};

let wosConfig = {
  apiKey: process.env.WOS_API_KEY || '',
  apiUrl: process.env.WOS_API_URL || 'https://api.clarivate.com/api/wos',
};

// Endpoint: Check status of Scopus configuration
app.get('/api/scopus/status', (_req: Request, res: Response) => {
  const isConfigured = Boolean(scopusConfig.apiKey && scopusConfig.apiKey.trim().length > 0);
  res.json({
    configured: isConfigured,
    message: isConfigured 
      ? 'Authorized Scopus API key is configured.' 
      : 'Scopus verification unavailable in this deployment (no authorized API key configured).',
    apiUrl: scopusConfig.apiUrl,
  });
});

// Endpoint: Test or Update Scopus API key (server-side only, never stored in client code)
app.post('/api/scopus/config', (req: Request, res: Response) => {
  const { apiKey, apiUrl } = req.body;
  if (apiKey !== undefined) {
    scopusConfig.apiKey = String(apiKey).trim();
  }
  if (apiUrl) {
    scopusConfig.apiUrl = String(apiUrl).trim();
  }

  res.json({
    success: true,
    configured: Boolean(scopusConfig.apiKey),
    message: scopusConfig.apiKey 
      ? 'Scopus configuration saved securely on server.' 
      : 'Scopus key cleared. Scopus verification disabled.',
  });
});

// Endpoint: Test connection to Elsevier Scopus
app.post('/api/scopus/test-connection', async (_req: Request, res: Response) => {
  if (!scopusConfig.apiKey) {
    res.status(400).json({
      success: false,
      message: 'No Scopus API key configured on server.',
    });
    return;
  }

  try {
    const testUrl = `${scopusConfig.apiUrl}?title=Nature&count=1`;
    const response = await fetch(testUrl, {
      headers: {
        'X-ELS-APIKey': scopusConfig.apiKey,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      res.json({
        success: true,
        message: 'Successfully connected to Elsevier Scopus API.',
      });
    } else {
      res.status(response.status).json({
        success: false,
        message: `Scopus API rejected request with status HTTP ${response.status} (${response.statusText}).`,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Failed to contact Elsevier endpoint: ${error?.message || 'Network error'}`,
    });
  }
});

// Endpoint: Verify journal via Scopus
app.get('/api/scopus/verify', async (req: Request, res: Response) => {
  const { query, issn } = req.query;

  if (!scopusConfig.apiKey) {
    res.json({
      status: 'UNAVAILABLE',
      message: 'Scopus verification unavailable in this deployment.',
      details: 'Elsevier Scopus API key is not configured on the secure server.',
    });
    return;
  }

  try {
    let searchParam = '';
    if (issn) {
      searchParam = `issn(${issn})`;
    } else if (query) {
      searchParam = `title(${encodeURIComponent(String(query))})`;
    } else {
      res.status(400).json({ error: 'Missing query or issn parameter' });
      return;
    }

    const apiUrl = `${scopusConfig.apiUrl}?query=${searchParam}&count=3`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-ELS-APIKey': scopusConfig.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      res.json({
        status: 'UNAVAILABLE',
        message: `Scopus API error: HTTP ${response.status}`,
      });
      return;
    }

    const data: any = await response.json();
    const entries = data?.['serial-metadata-response']?.entry || [];
    
    if (entries.length > 0) {
      const match = entries[0];
      res.json({
        status: 'VERIFIED',
        title: match['dc:title'],
        publisher: match['dc:publisher'],
        issn: match['prism:issn'] || match['prism:eIssn'],
        coverage: match['coverageStartYear'] ? `${match['coverageStartYear']}-present` : 'Active',
        sourceType: match['prism:aggregationType'],
      });
    } else {
      res.json({
        status: 'NOT_FOUND',
        message: 'No matching journal found in Scopus serial titles database.',
      });
    }
  } catch (error: any) {
    res.json({
      status: 'UNAVAILABLE',
      message: `Error querying Scopus API: ${error?.message || 'Unknown error'}`,
    });
  }
});

// Endpoint: Check status of Web of Science configuration
app.get('/api/wos/status', (_req: Request, res: Response) => {
  const isConfigured = Boolean(wosConfig.apiKey && wosConfig.apiKey.trim().length > 0);
  res.json({
    configured: isConfigured,
    message: isConfigured 
      ? 'Authorized Web of Science API key is configured.' 
      : 'Web of Science verification unavailable in this deployment.',
    apiUrl: wosConfig.apiUrl,
  });
});

// Endpoint: Update Web of Science API key
app.post('/api/wos/config', (req: Request, res: Response) => {
  const { apiKey, apiUrl } = req.body;
  if (apiKey !== undefined) {
    wosConfig.apiKey = String(apiKey).trim();
  }
  if (apiUrl) {
    wosConfig.apiUrl = String(apiUrl).trim();
  }

  res.json({
    success: true,
    configured: Boolean(wosConfig.apiKey),
    message: wosConfig.apiKey 
      ? 'Web of Science configuration saved securely on server.' 
      : 'Web of Science key cleared.',
  });
});

// Endpoint: Verify journal via Web of Science
app.get('/api/wos/verify', async (req: Request, res: Response) => {
  if (!wosConfig.apiKey) {
    res.json({
      status: 'UNAVAILABLE',
      message: 'Web of Science verification unavailable.',
      details: 'Clarivate Web of Science API credentials are not configured.',
    });
    return;
  }

  // If key configured, proxy request to Clarivate
  res.json({
    status: 'UNAVAILABLE',
    message: 'Web of Science verification requires institutional token verification.',
  });
});

// Mount Vite in development or static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`JOURNALGUARD AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
