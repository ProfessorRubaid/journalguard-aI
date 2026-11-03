/**
 * JOURNALGUARD AI - Core Type Definitions
 * Concept & Academic Direction: Dr. Rubaid Ashfaq
 */

export type VerificationStatus = 
  | 'VERIFIED'
  | 'FOUND'
  | 'NOT_FOUND'
  | 'NOT_VERIFIED'
  | 'UNAVAILABLE'
  | 'HIGH_RISK';

export type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface ResearcherProfile {
  fullName: string;
  designation: string;
  institution: string;
  department: string;
  researchAreas: string[];
  keywords: string[];
  orcid: string;
  googleScholarUrl: string;
  researchGateUrl: string;
  scopusAuthorId: string;
  wosResearcherId: string;
  email: string;
  country: string;
  avatarUrl?: string;
  publicationGoals?: string;
}

export interface DataSourceResult {
  source: 'crossref' | 'openalex' | 'doaj' | 'scopus' | 'wos' | 'issn_portal';
  displayName: string;
  status: VerificationStatus;
  statusLabel: string;
  details?: string;
  data?: Record<string, any>;
  lastChecked: string;
  latencyMs?: number;
}

export interface PredatoryIndicator {
  id: string;
  title: string;
  category: 'metrics' | 'peer_review' | 'fees' | 'editorial' | 'transparency' | 'solicitation';
  flagged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string;
  explanation: string;
}

export interface PredatoryRiskAnalysis {
  riskScore: number; // 0 - 100
  riskTier: RiskTier;
  flaggedCount: number;
  indicators: PredatoryIndicator[];
  summary: string;
}

export interface CloneMismatchItem {
  field: string;
  label: string;
  submittedValue: string;
  verifiedValue: string;
  matched: boolean;
  riskNote?: string;
}

export interface DomainComparisonResult {
  hasMismatch: boolean;
  matchType: 
    | 'EXACT_MATCH'
    | 'CANONICAL_SUBDOMAIN'
    | 'AUTHORIZED_PUBLISHER_PLATFORM'
    | 'SUSPICIOUS_LOOKALIKE'
    | 'CONFIRMED_HIJACKED_DOMAIN'
    | 'UNAUTHORIZED_DOMAIN_MISMATCH'
    | 'NO_AUTHORITATIVE_DATA';
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  submittedUrl: string;
  submittedHost: string;
  submittedRootDomain: string;
  expectedDomains: string[];
  primaryExpectedHost?: string;
  expectedPublisher?: string;
  similarityScore: number; // 0 to 1
  mismatchExplanation: string;
  warningTitle?: string;
  recommendation: string;
  technicalDetails: {
    isTldMismatch: boolean;
    hasOjsArtifacts: boolean;
    isLookalikeStem: boolean;
    suspiciousKeywordsFound: string[];
    authoritativeSourcesChecked: string[];
  };
}

export interface DomainMismatchAlert {
  id: string;
  title: string;
  message: string;
  submittedHostname: string;
  canonicalDomain: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  timestamp: string;
}

export interface CloneGuardAssessment {
  isPossibleClone: boolean;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE';
  hasDomainInconsistency: boolean;
  hasIssnMismatch: boolean;
  domainDetails?: {
    submittedHost: string;
    canonicalHost: string;
    isMatch: boolean;
    details: string;
  };
  domainComparison?: DomainComparisonResult;
  issnDetails?: {
    submittedIssn: string;
    canonicalTitle: string;
    canonicalPublisher: string;
    canonicalIssn: string;
    isMatch: boolean;
    isHijacked: boolean;
    details: string;
  };
  mismatches: CloneMismatchItem[];
  legitimateRecord?: {
    officialTitle: string;
    officialPublisher: string;
    officialWebsite: string;
    officialIssn: string;
    officialCountry: string;
    doiPrefix: string;
    evidenceSource: string;
  };
  warningMessage?: string;
}

export interface VerificationInputOptions {
  query: string;
  claimedIssn?: string;
  claimedUrl?: string;
  claimedTitle?: string;
  claimedPublisher?: string;
}

export interface AuthenticityScoreBreakdown {
  identityConsistency: number; // Max 20
  indexingEvidence: number;    // Max 20
  issnEvidence: number;        // Max 15
  publisherVerification: number; // Max 15
  websiteConsistency: number;  // Max 10
  editorialTransparency: number; // Max 10
  publicationTransparency: number; // Max 10
  total: number;               // Max 100
}

export interface ResearchFitScore {
  total: number; // 0 - 100
  tier: 'Excellent Match' | 'Strong Fit' | 'Moderate Fit' | 'Low Relevance';
  subjectFit: number;     // max 35
  scopeMatch: number;     // max 25
  indexingMatch: number;  // max 15
  publicationType: number;// max 10
  keywordScore: number;   // max 15
  matchingKeywords: string[];
  explanation: string;
}

export interface JournalRecord {
  id: string;
  title: string;
  issn: string;
  eIssn?: string;
  publisher: string;
  website: string;
  country: string;
  openAccess: boolean;
  apcVerified?: string;
  subjectAreas: string[];
  scopeDescription?: string;
  doiPrefix?: string;
  isSyntheticDemo?: boolean;
  demoType?: 'verified' | 'suspicious' | 'cloned' | 'non_indexed';
}

export interface VerificationResult {
  id: string;
  searchQuery: string;
  timestamp: string;
  journal: JournalRecord;
  authenticityScore: AuthenticityScoreBreakdown;
  riskAnalysis: PredatoryRiskAnalysis;
  cloneGuard: CloneGuardAssessment;
  researchFit: ResearchFitScore;
  sources: {
    issn: DataSourceResult;
    crossref: DataSourceResult;
    openalex: DataSourceResult;
    doaj: DataSourceResult;
    scopus: DataSourceResult;
    wos: DataSourceResult;
  };
  recommendation: {
    status: 'READY FOR FURTHER CONSIDERATION' | 'NEEDS VERIFICATION' | 'HIGH RISK — DO NOT SUBMIT UNTIL VERIFIED';
    summary: string;
    nextSteps: string[];
  };
  limitations: string;
}

export interface SavedJournalEntry {
  id: string;
  journalName: string;
  publisher: string;
  issn: string;
  scopusStatus: VerificationStatus;
  wosStatus: VerificationStatus;
  doajStatus: VerificationStatus;
  authenticityScore: number;
  riskScore: number;
  riskTier: RiskTier;
  lastChecked: string;
  status: 'Saved' | 'Checked' | 'Recommended' | 'Rejected' | 'Watchlist';
  notes?: string;
  tags?: string[];
  isWatched?: boolean;
}

export interface RecommendedJournalItem {
  name: string;
  publisher: string;
  issn: string;
  eIssn?: string;
  researchFit: number;
  scopusStatus: string;
  wosStatus: string;
  openAccess: boolean;
  apc: string;
  quartile: string;
  authenticity: number;
  riskTier: RiskTier;
  officialWebsite: string;
  subjectMatch: string[];
}
