/**
 * WoSConnector - Clarivate Web of Science Master Journal List Connector
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 */

import { IJournalConnector, StandardizedJournalMetadata } from './types';
import { WosCoreCollectionType } from '../../types';

export class WoSConnector implements IJournalConnector {
  readonly connectorName = 'Clarivate Web of Science';

  async verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null> {
    try {
      const res = await fetch(`/api/wos/verify?issn=${encodeURIComponent(issn)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status === 'VERIFIED') {
        return {
          title: data.title,
          issn: data.issn || issn,
          publisher: data.publisher,
          subjectAreas: [],
          isVerified: true,
          source: 'Web of Science Master Journal List',
          wosData: {
            collection: (data.collection as WosCoreCollectionType) || 'SCIE',
            category: data.category,
            impactFactor: data.impactFactor,
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
      const res = await fetch(`/api/wos/verify?query=${encodeURIComponent(title)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.status === 'VERIFIED') {
        return {
          title: data.title,
          issn: data.issn || 'N/A',
          publisher: data.publisher,
          subjectAreas: [],
          isVerified: true,
          source: 'Web of Science Master Journal List',
          wosData: {
            collection: (data.collection as WosCoreCollectionType) || 'SSCI',
          },
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async searchByKeywords(keywords: string[]): Promise<StandardizedJournalMetadata[]> {
    const single = await this.verifyByTitle(keywords.join(' '));
    return single ? [single] : [];
  }
}

export const wosConnector = new WoSConnector();
