require('dotenv').config();
const axios = require('axios');

axios.defaults.baseURL = process.env.GRAPHQL_API;
axios.defaults.timeout = 5 * 60 * 1000;

const debug = require('debug');

const log = debug('benchmark');
log.log = console.log.bind(console);

const benchmark = require('./benchmark');
const formatBenchmarks = require('./formatBenchmarks');

const queries = [
  require('./requests/fetchAggregations.js'),
  require('./requests/fetchEntries.js'),
];
const saveSets = [require('./requests/saveSets.js')];

const _ = require('lodash');
const jsonpath = require('jsonpath');
const getSize = response => _.sum(jsonpath.query(response.data, '$..size'));

(async () => {
  log(
    formatBenchmarks(
      [
        await benchmark(queries, {
          type: 'Queries',
          repeat: 50,
          concurrency: 1,
        }),

        await benchmark(queries, {
          type: 'Queries',
          repeat: 100,
          concurrency: 20,
        }),

        await benchmark(saveSets, {
          type: 'Save Sets',
          repeat: 50,
          concurrency: 1,
          getSize,
        }),

        await benchmark(saveSets, {
          type: 'Save Sets',
          repeat: 100,
          concurrency: 20,
          getSize,
        }),
      ]
        .concat(
          await Promise.all([
            benchmark(saveSets, {
              type: 'Save Sets',
              context: 'Concurrent with Queries',
              repeat: 50,
              concurrency: 1,
              getSize,
            }),
            benchmark(queries, {
              type: 'Queries',
              context: 'Concurrent with Save Sets',
              repeat: 25,
              concurrency: 1,
            }),
          ]),
        )
        .concat(
          await Promise.all([
            benchmark(saveSets, {
              type: 'Save Sets',
              context: 'Concurrent with Queries',
              repeat: 100,
              concurrency: 20,
              getSize,
            }),
            benchmark(queries, {
              type: 'Queries',
              context: 'Concurrent with Save Sets',
              repeat: 50,
              concurrency: 20,
            }),
          ]),
        )
        .concat([
          await benchmark(queries, {
            type: 'Queries',
            context: 'Post Save Sets',
            repeat: 100,
            concurrency: 20,
          }),

          await benchmark(queries, {
            type: 'Queries',
            context: 'Post Save Sets',
            // repeat: 50,
            repeat: 1,
            concurrency: 1,
          }),
        ]),
    ),
  );
})();
