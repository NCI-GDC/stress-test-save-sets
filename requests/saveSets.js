const axios = require('axios');

const payload = {
  query: `
    mutation Mutation($filters_1: FiltersArgument) {
        sets {
            create {
            explore {
                ssm(input: { filters: $filters_1}) {
                set_id
                size
                }
            }
            }
        }
    }
    `,
  variables: {
    filters_0: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'ssms.mutation_type',
            value: ['Simple Somatic Mutation'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'ssms.consequence.transcript.annotation.impact',
            value: ['MODERATE'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'ssms.consequence.transcript.consequence_type',
            value: ['missense_variant'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'ssms.occurrence.case.diagnoses.classification_of_tumor',
            value: ['not reported'],
          },
        },
      ],
    },
    // around 145,363 entries
    filters_1: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'ssms.consequence.transcript.annotation.impact',
            value: ['HIGH'],
          },
        },
        {
          op: 'in',
          content: {
            field: 'ssms.consequence.transcript.consequence_type',
            value: ['start_lost', 'stop_gained'],
          },
        },
      ],
    },
    // around 1,752,983 entries in set
    filters_2: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'ssms.consequence.transcript.annotation.impact',
            value: ['MODERATE'],
          },
        },
      ],
    },
    // around 3 million entries in set
    filters_3: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'ssms.mutation_type',
            value: ['Simple Somatic Mutation'],
          },
        },
      ],
    },
    filters_4: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'ssm_id',
            value: ['84aef48f-31e6-52e4-8e05-7d5b9ab15087'],
          },
        },
      ],
    },
  },
};

const payloadAllCasesInSet = {
  query: `
    mutation Mutation($input_0: CreateSetInput) {
        sets {
            create {
                repository {
                    case(input: $input_0) {
                        set_id
                        size
                    }
                }
            }
        }
    }
    `,
  variables: {
    input_0: {
      filters: {
        op: 'and',
        content: [
          {
            op: 'not',
            content: {
              field: 'cases.case_id',
              value: ['MISSING'],
            },
          },
        ],
      },
    },
  },
};

module.exports = () => axios.post('/graphql', payloadAllCasesInSet);
// module.exports = () => axios.post('/graphql', payload);
