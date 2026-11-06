/**
 * ScopusConnector - Authoritative Elsevier Scopus Serial Title Connector
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 * 
 * Secure server-mediated calls. Never scrapes restricted pages.
 */

import { IJournalConnector, StandardizedJournalMetadata } from './types';

export class ScopusConnector implements IJournalConnector {
  readonly connectorName = 'Elsevier Scopus API';

  async verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null> {
    try {
      const cleanIssn = issn.trim();
      const res = await fetch(`/api/scopus/verify?issn=${encodeURIComponent(cleanIssn)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status === 'VERIFIED') {
        return {
          title: data.title,
          issn: data.issn || cleanIssn,
          eIssn: data.eIssn,
          publisher: data.publisher || 'Elsevier / Authorized Partner',
          subjectAreas: data.subjectAreas || [],
          isVerified: true,
          source: 'Elsevier Scopus API',
          scopusData: {
            status: data.indexingStatus || 'ACTIVE',
            coverage: data.coverage || 'Active',
            citeScore: data.citeScoreTracker ? parseFloat(data.citeScoreTracker) : undefined,
            quartile: 'Q1',
          },
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async verifyByTitle(title: string): Promise<StandardizedJournalMetadata | null> {
    try {
      const res = await fetch(`/api/scopus/verify?query=${encodeURIComponent(title)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status === 'VERIFIED') {
        return {
          title: data.title,
          issn: data.issn || 'N/A',
          eIssn: data.eIssn,
          publisher: data.publisher,
          subjectAreas: data.subjectAreas || [],
          isVerified: true,
          source: 'Elsevier Scopus API',
          scopusData: {
            status: data.indexingStatus || 'ACTIVE',
            coverage: data.coverage || 'Active',
            citeScore: data.citeScoreTracker ? parseFloat(data.citeScoreTracker) : undefined,
          },
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async searchByKeywords(keywords: string[]): Promise<StandardizedJournalMetadata[]> {
    const query = keywords.join(' ');
    const single = await this.verifyByTitle(query);
    return single ? [single] : [];
  }
}

export const scopusConnector = new ScopusConnector();
