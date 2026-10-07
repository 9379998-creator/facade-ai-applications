export type ImplementationStatus = 'WORKING' | 'PROTOTYPE' | 'CONCEPT' | 'TBD';

export interface PresentationSection {
  id: string;
  order: number;
  slug: string;
  title: string;
  thesis: string;
  status: ImplementationStatus;
  points: string[];
  visualizationPlaceholder: string;
  speakerNotes: string;
  relatedCases: string[];
}

export interface BusinessCase {
  id: string;
  slug: string;
  title: string;
  department: string;
  status: ImplementationStatus;
  problem: string;
  currentProcess: string;
  trigger: string;
  inputData: string[];
  requiredData: string[];
  missingDataBehavior: string;
  userActions: string[];
  applicationActions: string[];
  aiRole: string;
  deterministicAlgorithmRole: string;
  humanControl: string;
  output: string[];
  errorHandling: string;
  integrations: string[];
  expectedEffect: string;
  measurementMethod: string;
  risks: string[];
  dependencies: string[];
  relatedSections: string[];
  openQuestions: string[];
}
