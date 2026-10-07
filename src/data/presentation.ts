import sectionsData from '../../content/presentation/sections.json';
import commercialCaseData from '../../content/cases/commercial-tender-package-intake.json';
import { PresentationSection, BusinessCase } from '../types';

export const presentationSections: PresentationSection[] = sectionsData as PresentationSection[];

export const businessCases: BusinessCase[] = [
  commercialCaseData as BusinessCase
];

export const getSectionById = (id: string): PresentationSection | undefined => {
  return presentationSections.find(s => s.id === id);
};

export const getCaseById = (id: string): BusinessCase | undefined => {
  return businessCases.find(c => c.id === id);
};
