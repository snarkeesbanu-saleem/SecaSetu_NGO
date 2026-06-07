/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NGO {
  id: string;
  name: string;
  website: string;
  sector: string;
  headquarters: string;
  keyInitiatives: string[];
  description: string;
  establishedYear?: number | string;
  impactSummary?: string;
  notes?: string;
  isCustom?: boolean;
}

export type NGOSector = 
  | 'Education'
  | 'Animal Welfare'
  | 'Women Empowerment'
  | 'Healthcare'
  | 'Environmental Conservation'
  | 'Other';

export interface ResearchRequest {
  prompt: string;
  sector?: string;
}

export interface ResearchResponse {
  ngo?: Partial<NGO>;
  answer?: string;
  suggestedNgos?: Partial<NGO>[];
}

export interface HomeworkSubmission {
  driveFolderUrl: string;
  linkedInPostUrl: string;
  driveConfirmed: boolean;
  linkedInConfirmed: boolean;
  screenshotConfirmed: boolean;
  submissionDate?: string;
}
