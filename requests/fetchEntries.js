const axios = require('axios');

const payload = {
  id: 'q4',
  query:
    'query ExploreCasesTable($first_0: Int!, $offset_1: Int!, $first_2: Int!) { viewer { ...F0 } } fragment F0 on Root { explore { cases { _hits20nf65: hits(first: $first_0, offset: $offset_1, score: "gene.gene_id") { edges { node { score id case_id primary_site disease_type submitter_id project { project_id program { name id } id } diagnoses { _hits1u4u9r: hits(first: $first_2) { edges { node { primary_diagnosis age_at_diagnosis vital_status days_to_death id } cursor } pageInfo { hasNextPage hasPreviousPage } } } demographic { gender ethnicity race id } summary { data_categories { file_count data_category id } file_count id } } cursor } pageInfo { hasNextPage hasPreviousPage } } } genes { hits(first: $first_0, offset: $offset_1, score: "case.project.project_id") { total edges { node { numCases: score symbol name cytoband biotype gene_id is_cancer_gene_census case { hits(first: 0) { total } } } } } } ssms { hits(first: $first_0, offset: $offset_1, score: "occurrence.case.project.project_id") { total edges { node { score genomic_dna_change mutation_subtype ssm_id consequence { hits(first: 1) { edges { node { transcript { is_canonical annotation { impact } consequence_type gene { gene_id symbol } aa_change } } } } } occurrence { hits(first: 0) { total } } } } } } } }',
  variables: { first_0: 20, offset_1: 0, first_2: 1 },
};

module.exports = () => axios.post('/graphql', payload);
