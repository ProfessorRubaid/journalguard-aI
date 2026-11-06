/**
 * Standardized Connector Interface for Authoritative Scholarly Data Sources
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 */

import { IntelligenceJournal, AbdcRating, WosCoreCollectionType } from '../../types';

export interface StandardizedJournalMetadata {
  title: string;
  issn: string;
  eIssn?: string;
  publisher: string;
  country?: string;
  website?: string;
  subjectAreas: string[];
  isVerified: boolean;
  source: string;
  scopusData?: {
    status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
    coverage: string;
    citeScore?: number;
    quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    sourceId?: string;
  };
  wosData?: {
    collection: WosCoreCollectionType;
    category?: string;
    impactFactor?: string;
  };
  abdcData?: {
    rating: AbdcRating;
    forCode?: string;
    panel?: string;
  };
  openAccessData?: {
    isOpenAccess: boolean;
    apcAmount?: string;
  };
}

export interface IJournalConnector {
  readonly connectorName: string;
  verifyByIssn(issn: string): Promise<StandardizedJournalMetadata | null>;
  verifyByTitle(title: string): Promise<StandardizedJournalMetadata | null>;
  searchByKeywords(keywords: string[]): Promise<StandardizedJournalMetadata[]>;
}
