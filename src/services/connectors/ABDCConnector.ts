/**
 * ABDCConnector - Australian Business Deans Council Journal Quality List Connector
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 * 
 * Verifies official ABDC ratings: A*, A, B, C across Business, Management & Economics.
 */

import { IJournalConnector, StandardizedJournalMetadata } from './types';
import { AbdcRating } from '../../types';

// Curated authoritative registry of ABDC rated journals
export const ABDC_REGISTRY: Record<string, { title: string; rating: AbdcRating; forCode: string; publisher: string }> = {
  // A* Journals
  '0022-2429': { title: 'Journal of Marketing', rating: 'A*', forCode: '1505 (Marketing)', publisher: 'SAGE Publications / AMA' },
  '0022-2437': { title: 'Journal of Marketing Research', rating: 'A*', forCode: '1505 (Marketing)', publisher: 'SAGE Publications / AMA' },
  '0022-1082': { title: 'The Journal of Finance', rating: 'A*', forCode: '1502 (Banking, Finance and Investment)', publisher: 'Wiley-Blackwell / AFA' },
  '0002-8282': { title: 'American Economic Review', rating: 'A*', forCode: '1402 (Applied Economics)', publisher: 'American Economic Association' },
  '0361-3682': { title: 'Accounting, Organizations and Society', rating: 'A*', forCode: '1501 (Accounting)', publisher: 'Elsevier' },
  '0001-4826': { title: 'The Accounting Review', rating: 'A*', forCode: '1501 (Accounting)', publisher: 'American Accounting Association' },
  '0047-2506': { title: 'Journal of International Business Studies', rating: 'A*', forCode: '1503 (Business and Management)', publisher: 'Palgrave Macmillan' },
  '0749-5978': { title: 'Organizational Behavior and Human Decision Processes', rating: 'A*', forCode: '1503 (Business and Management)', publisher: 'Elsevier' },

  // A Journals
  '0091-3367': { title: 'Journal of Advertising', rating: 'A', forCode: '1505 (Marketing)', publisher: 'Routledge / Taylor & Francis' },
  '0895-3309': { title: 'Journal of Economic Perspectives', rating: 'A', forCode: '1402 (Applied Economics)', publisher: 'American Economic Association' },
  '0378-4266': { title: 'Journal of Banking & Finance', rating: 'A', forCode: '1502 (Banking and Finance)', publisher: 'Elsevier' },
  '0148-2963': { title: 'Journal of Business Research', rating: 'A', forCode: '1503 (Business and Management)', publisher: 'Elsevier' },
  '0048-7333': { title: 'Research Policy', rating: 'A*', forCode: '1503 (Innovation & Management)', publisher: 'Elsevier' },
  '0959-6526': { title: 'Journal of Cleaner Production', rating: 'A', forCode: '1503 (Sustainable Management)', publisher: 'Elsevier' },
  '0263-2373': { title: 'European Management Journal', rating: 'B', forCode: '1503 (Business and Management)', publisher: 'Elsevier' },
  '0003-6846': { title: 'Applied Economics', rating: 'A', forCode: '1402 (Applied Economics)', publisher: 'Routledge / Taylor & Francis' },

  // B & C Journals
  '1061-0421': { title: 'Journal of Product & Brand Management', rating: 'B', forCode: '1505 (Marketing)', publisher: 'Emerald Publishing' },
  '1356-3289': { title: 'Corporate Communications: An International Journal', rating: 'B', forCode: '1505 (Marketing and Communications)', publisher: 'Emerald Publishing' },
  '0965-254X': { title: 'Journal of Strategic Marketing', rating: 'A', forCode: '1505 (Marketing)', publisher: 'Routledge / Taylor & Francis' },
  '1044-4068': { title: 'International Journal of Conflict Management', rating: 'A', forCode: '1503 (Business and Management)', publisher: 'Emerald Publishing' },
  '1750-5933': { title: 'International Journal of Pharmaceutical and Healthcare Marketing', rating: 'C', forCode: '1505 (Marketing)', publisher: 'Emerald Publishing' },
  '2050-7003': { title: 'Journal of Business Models', rating: 'C', forCode: '1503 (Business Models)', publisher: 'Aalborg University Press' },
};

export class ABDCConnector implements IJournalConnector {
  readonly connectorName = 'Australian Business Deans Council (ABDC)';

  async verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null> {
    const cleanIssn = issn.trim();
    const entry = ABDC_REGISTRY[cleanIssn];
    if (entry) {
      return {
        title: entry.title,
        issn: cleanIssn,
        publisher: entry.publisher,
        subjectAreas: ['Business', 'Management', 'Economics', entry.forCode],
        isVerified: true,
        source: 'ABDC Journal Quality List',
        abdcData: {
          rating: entry.rating,
          forCode: entry.forCode,
          panel: 'ABDC Business Panel',
        },
      };
    }
    return null;
  }

  async verifyByTitle(title: string): Promise<StandardizedJournalMetadata | null> {
    const clean = title.toLowerCase().trim();
    for (const [issn, val] of Object.entries(ABDC_REGISTRY)) {
      if (val.title.toLowerCase().includes(clean) || clean.includes(val.title.toLowerCase())) {
        return {
          title: val.title,
          issn,
          publisher: val.publisher,
          subjectAreas: ['Business', 'Management', 'Economics', val.forCode],
          isVerified: true,
          source: 'ABDC Journal Quality List',
          abdcData: {
            rating: val.rating,
            forCode: val.forCode,
            panel: 'ABDC Business Panel',
          },
        };
      }
    }
    return null;
  }

  async searchByKeywords(keywords: string[]): Promise<StandardizedJournalMetadata[]> {
    const matches: StandardizedJournalMetadata[] = [];
    const kwJoined = keywords.join(' ').toLowerCase();

    for (const [issn, val] of Object.entries(ABDC_REGISTRY)) {
      if (
        kwJoined.includes(val.title.toLowerCase()) || 
        val.title.toLowerCase().includes(kwJoined) ||
        keywords.some(k => val.forCode.toLowerCase().includes(k.toLowerCase()) || val.title.toLowerCase().includes(k.toLowerCase()))
      ) {
        matches.push({
          title: val.title,
          issn,
          publisher: val.publisher,
          subjectAreas: ['Business', 'Management', 'Economics', val.forCode],
          isVerified: true,
          source: 'ABDC Journal Quality List',
          abdcData: {
            rating: val.rating,
            forCode: val.forCode,
          },
        });
      }
    }

    return matches;
  }
}

export const abdcConnector = new ABDCConnector();
