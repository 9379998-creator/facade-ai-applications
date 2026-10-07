import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const ROOT_DIR = process.cwd();

const ImplementationStatusSchema = z.enum(['WORKING', 'PROTOTYPE', 'CONCEPT', 'TBD']);

const PresentationSectionSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  thesis: z.string().min(1),
  status: ImplementationStatusSchema,
  points: z.array(z.string().min(1)).min(2).max(5),
  visualizationPlaceholder: z.string().min(1),
  speakerNotes: z.string().min(1),
  relatedCases: z.array(z.string())
});

const BusinessCaseSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  status: ImplementationStatusSchema,
  problem: z.string().min(1),
  currentProcess: z.string().min(1),
  trigger: z.string().min(1),
  inputData: z.array(z.string()).min(1),
  requiredData: z.array(z.string()).min(1),
  missingDataBehavior: z.string().min(1),
  userActions: z.array(z.string()).min(1),
  applicationActions: z.array(z.string()).min(1),
  aiRole: z.string().min(1),
  deterministicAlgorithmRole: z.string().min(1),
  humanControl: z.string().min(1),
  output: z.array(z.string()).min(1),
  errorHandling: z.string().min(1),
  integrations: z.array(z.string()),
  expectedEffect: z.string().min(1),
  measurementMethod: z.string().min(1),
  risks: z.array(z.string()).min(1),
  dependencies: z.array(z.string()),
  relatedSections: z.array(z.string()),
  openQuestions: z.array(z.string())
});

console.log('[validate-content] Validating presentation sections and business cases against schemas...');

const sectionsPath = path.join(ROOT_DIR, 'content/presentation/sections.json');
const casesDir = path.join(ROOT_DIR, 'content/cases');

if (!fs.existsSync(sectionsPath)) {
  console.error(`❌ Missing sections file: ${sectionsPath}`);
  process.exit(1);
}

const rawSections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
const sectionsResult = z.array(PresentationSectionSchema).safeParse(rawSections);

if (!sectionsResult.success) {
  console.error('❌ Presentation sections schema validation failed:');
  console.error(sectionsResult.error.format());
  process.exit(1);
}

if (sectionsResult.data.length !== 12) {
  console.error(`❌ Expected exactly 12 presentation sections, found ${sectionsResult.data.length}`);
  process.exit(1);
}

const sectionIds = new Set(sectionsResult.data.map(s => s.id));

// Validate cases
const caseFiles = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
if (caseFiles.length === 0) {
  console.error('❌ No case files found in content/cases');
  process.exit(1);
}

let caseErrors = 0;
for (const file of caseFiles) {
  const filePath = path.join(casesDir, file);
  const rawCase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const caseResult = BusinessCaseSchema.safeParse(rawCase);

  if (!caseResult.success) {
    console.error(`❌ Case validation failed for ${file}:`);
    console.error(caseResult.error.format());
    caseErrors++;
    continue;
  }

  // Check that relatedSections exist
  for (const sId of caseResult.data.relatedSections) {
    if (!sectionIds.has(sId)) {
      console.error(`❌ Case ${caseResult.data.id} references non-existent section: ${sId}`);
      caseErrors++;
    }
  }
}

if (caseErrors > 0) {
  console.error(`\n[validate-content] FAILED with ${caseErrors} error(s).`);
  process.exit(1);
}

console.log(`✅ [validate-content] PASSED: 12 sections and ${caseFiles.length} business cases successfully verified.`);
