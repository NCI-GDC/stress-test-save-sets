require('dotenv').config();
const axios = require('axios');
const _ = require('lodash');
const qs = require('qs');

const cookie = `NCI-Warning=true; gsScrollPos-2387=0; gsScrollPos-2383=0; s_cc=true; s_sq=%5B%5BB%5D%5D; _ga=GA1.4.370806691.1492725699; mp_506dc450e3b376c4ce61374af96215c6_mixpanel=%7B%22distinct_id%22%3A%20%2215cc6d2f3dc25d-0f8fd43c24cc2c-14396d5d-1aeaa0-15cc6d2f3dd457%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22uiVersion%22%3A%20%22%22%2C%22uiCommitHash%22%3A%20%22721e56d168cb068fdbc4d9b18af5b47d3ec3f60d%22%2C%22apiVersion%22%3A%20%221.9.0%22%2C%22apiCommitHash%22%3A%20%222c96e21f28c4e56aaa07d245a5b08542507b5cc3%22%2C%22dataRelease%22%3A%20%22Data%20Release%207.0%20-%20June%2027%2C%202017%22%2C%22__timers%22%3A%20%7B%7D%7D; s_ppv=100%7C0; s_fid=52BFF01242004E36-39F6F35ED47015B9`;

const endpoint = uri =>
  `${process.env.KIBANA_API}/api/console/proxy?${qs.stringify({ uri })}`;
const payload = {
  _source: false,
  size: 20,
  query: {
    function_score: {
      query: {
        match_all: {},
      },
      script_score: {
        script: "doc['ids'].size()",
      },
    },
  },
};

const getExistingSets = async () => {
  const sets = {
    case: `/case_set/case_set/_search`,
    ssm: `/ssm_set/ssm_set/_search`,
    gene: `/gene_set/gene_set/_search`,
  };

  const [caseSets, ssmSets, geneSets] = await Promise.all(
    _.map(
      sets,
      async (uri, setType) =>
        (await axios({
          method: 'post',
          url: endpoint(sets[setType]),
          data: payload,
          headers: {
            'kbn-version': '5.1.2',
          },
        })).data.hits.total,
    ),
  );
  return {
    case: caseSets,
    ssm: ssmSets,
    gene: geneSets,
  };
};

module.exports = getExistingSets;
