// Content for the controlled-term tutorial (cedar-term-tutorial.md). One template,
// three constrained text fields, each bound a different way in the BioPortal
// picker — ordered by increasing autonomy: whole ontology, branch, assembled
// classes. Sources verified live in BioPortal (CL, UBERON, OBI).
export { BASE } from './config.mjs';
export const OPENVIEW = 'https://openview.metadatacenter.org';
export const RUN_FOLDER_PREFIX = 'Term Tutorial Run';

export const TERM = {
  templateName: 'Tissue Sample',
  templateDescription: 'A tissue-sample record whose fields are constrained to controlled terms',

  // Plain context fields (no constraints), added first for realism.
  plainFields: [
    { type: 'text', name: 'Sample ID', help: 'Local identifier for this tissue sample' },
    { type: 'text', name: 'Lab ID', help: 'Identifier of the lab that produced the sample' },
  ],

  // 1) Entire ontology — any cell type from the Cell Ontology (CL).
  cellType: {
    field: { name: 'Cell Type', help: 'The cell type, from the Cell Ontology' },
    query: 'Cell Ontology',
    rowText: 'Cell Ontology (CL)',
  },

  // 2) Branch — the "organ" subtree of Uberon. "organ" is deep in Uberon's tree,
  // so we scope the search to UBERON, find the class, and stage it as a Branch.
  organ: {
    field: { name: 'Organ', help: 'The organ the sample came from, from Uberon' },
    scope: { type: 'uberon', match: /\(UBERON\)/i },
    query: 'organ',
    pick: /organ/i,
  },

  // 3) Assembled classes — a handful of specific OBI assay terms, each searched
  // (scoped to OBI), selected, and added as an individual class constraint.
  assay: {
    field: { name: 'Assay Type', help: 'How the sample was analyzed, from OBI' },
    scope: { type: 'OBI', match: /\(OBI\)/i },
    terms: [
      { query: 'histopathology assay', pick: /histopathology assay/i },
      { query: 'imaging assay', pick: /imaging assay/i },
      { query: 'microscopy assay', pick: /microscopy assay/i },
    ],
  },

  // Finale: fill one instance of the saved template. Two controlled fields are
  // filled from their ontologies, and the third controlled field's autocomplete
  // is captured open. Controlled fields are the 0..2 "Start typing to filter"
  // inputs in order: 0 Cell Type, 1 Organ, 2 Assay Type.
  instance: {
    sampleId: 'TS-0001',
    labId: 'LAB-0042',
    cellType: { idx: 0, query: 'hepatocyte', pick: 'hepatocyte' },
    organ: { idx: 1, query: 'liver', pick: 'liver' },
    assay: { idx: 2, query: 'assay', pick: 'histopathology assay' }, // dropdown captured open
  },
};
