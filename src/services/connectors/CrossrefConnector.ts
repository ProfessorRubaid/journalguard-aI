/**
 * CrossrefConnector & PublisherVerificationConnector
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 */

import { IJournalConnector, StandardizedJournalMetadata } from './types';

export class CrossrefConnector implements IJournalConnector {
  readonly connectorName = 'Crossref REST API';

  async verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null> {
    try {
      const res = await fetch(`https://api.crossref.org/journals/${encodeURIComponent(issn)}`, {
        headers: { 'User-Agent': 'SodhSetuResearchIntelligence/1.0 (mailto:integrity@sodhsetu.org)' }
      });
      if (!res.ok) return null;
      const data = await res.json();
      const message = data?.message;
      if (!message) return null;

      return {
        title: message.title || 'Crossref Journal',
        issn: (message.ISSN && message.ISSN[0]) || issn,
        publisher: message.publisher || 'Verified Crossref Member',
        subjectAreas: message.subjects || [],
        isVerified: true,
        source: 'Crossref Official Metadata',
      };
    } catch {
      return null;
    }
  }

  async verifyByTitle(title: string): Promise<StandardizedJournalMetadata | null> {
    try {
      const res = await fetch(`https://api.crossref.org/journals?query=${encodeURIComponent(title)}&rows=1`, {
        headers: { 'User-Agent': 'SodhSetuResearchIntelligence/1.0 (mailto:integrity@sodhsetu.org)' }
      });
      if (!res.ok) return null;
      const data = await res.json();
      const item = data?.message?.items?.[0];
      if (!item) return null;

      return {
        title: item.title,
        issn: (item.ISSN && item.ISSN[0]) || '',
        publisher: item.publisher,
        subjectAreas: item.subjects || [],
        isVerified: true,
        source: 'Crossref Official Metadata',
      };
    } catch {
      return null;
    }
  }

  async searchByKeywords(keywords: string[]): Promise<StandardizedJournalMetadata[]> {
    const single = await this.verifyByTitle(keywords.join(' '));
    return single ? [single] : [];
  }
}

export class PublisherVerificationConnector implements IJournalConnector {
  readonly connectorName = 'Publisher Canonical Verification';

  async verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null> {
    return null;
  }

  async verifyByTitle(title: string): Promise<StandardizedJournalMetadata | null> {
    return null;
  }

  async searchByKeywords(): Promise<StandardizedJournalMetadata[]> {
    return [];
  }

  verifyDomainMatch(officialDomain: string, submittedUrl: string): { isMatch: boolean; details: string } {
    try {
      const officialHost = new URL(officialDomain).hostname.replace(/^www\./, '').toLowerCase();
      const submittedHost = new URL(submittedUrl).hostname.replace(/^www\./, '').toLowerCase();

      if (officialHost === submittedHost) {
        return { isMatch: true, details: `Exact domain match: ${officialHost}` };
      }
      if (submittedHost.endsWith(`.${officialHost}`)) {
        return { isMatch: true, details: `Authorized subdomain match: ${submittedHost}` };
      }
      return { isMatch: false, details: `Domain mismatch flagged: Expected ${officialHost}, submitted host was ${submittedHost}` };
    } catch {
      return { isMatch: false, details: 'Invalid domain syntax' };
    }
  }
}

export const crossrefConnector = new CrossrefConnector();
export const publisherVerificationConnector = new PublisherVerificationConnector();
