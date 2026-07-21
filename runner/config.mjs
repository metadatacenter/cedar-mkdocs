import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const BASE = process.env.CEDAR_BASE ?? 'https://cedar.metadatacenter.org';
export const OPENVIEW = 'https://openview.metadatacenter.org';

// Fixed for screenshot consistency across runs (see TRACE.md "Global").
// Screenshots are always full-frame (no cropping). To keep the UI large and
// avoid wasted whitespace, the app lays out into a smaller window — the same
// effect as browser Cmd-+: everything renders bigger and fills the frame. Width
// stays wide enough for CEDAR's desktop layout; height stays generous so tall
// forms don't clip the Save button. deviceScale 2 keeps text crisp.
export const VIEWPORT = { width: 1120, height: 1000 };
export const DEVICE_SCALE_FACTOR = 2;

export const STORAGE_STATE = resolve(__dirname, 'storageState.json');
export const IMG_DIR = resolve(__dirname, '..', 'docs', 'tutorials', 'img');
export const FAIL_DIR = resolve(__dirname, 'failures');

export const HEADED = !!process.env.HEADED;

// Content used by the tutorial. Kept here so prose and runner agree.
export const RUN_FOLDER_PREFIX = 'Tutorial Run';
// Fixed folder name for the tutorial screenshots (no datestamp, so the folder
// shown in the shots reads cleanly). Re-runs reuse/expect this exact name.
export const RUN_FOLDER_NAME = 'Study Folder';

export const BASIC = {
  templateName: 'Study',
  templateDescription: 'A basic template describing a research study',
  fields: [
    { type: 'text', name: 'Study Name', help: 'The full name of the study' },
    { type: 'numeric', name: 'Number of Participants', help: 'How many participants are enrolled in the study' },
  ],
  values: { 'Study Name': 'Wearable Sensor Pilot Study', 'Number of Participants': '40' },
};

export const RICH = {
  templateName: 'Clinical Study',
  templateDescription: 'A richer study template using controlled terms and external authorities',
  orcidField: { name: 'Principal Investigator', help: "The study's principal investigator, identified by ORCID" },
  rorField: { name: 'Institution', help: 'The organization running the study, identified by ROR' },
  diseaseField: { name: 'Disease', help: 'The disease studied, from the Human Disease Ontology' },
  // Constrain to the "disease" BRANCH (DOID:4) rather than the whole ontology —
  // DOID also imports non-disease upper classes (Cell, Anatomy, ChEBI, …), so
  // the branch restricts values to actual diseases. `branch` is the tree node's
  // (CSS-lowercased) label.
  ontology: { query: 'Human Disease Ontology', rowText: 'Human Disease Ontology (DOID)', branch: 'disease' },
  values: {
    orcid: { type: 'Mark Musen', pick: /0000-0003-3325-793X/ },
    ror: { type: 'Stanford University', pick: /ror\.org\/00f54p054/ },
    disease: { type: 'asthma', pick: 'asthma' },
  },
  publish: { major: 1, minor: 0, patch: 0 },
};
