const _ = require('lodash');
const stats = require('stats-lite');
const now = require('performance-now');
const { mapLimit } = require('async');
const debug = require('debug');
const formatBenchmarks = require('./formatBenchmarks');
const humanizeDuration = require('humanize-duration');

const analytics = require('./analytics');
const getExistingSets = require('./getExistingSets');

const log = debug('benchmark');
log.log = console.log.bind(console);

const benchmark = async (
  requests,
  { type, context, repeat, concurrency, getSize } = {
    repeat: 10,
    concurrency: 5,
  },
) => {
  const title = context ? `${type} (${context})` : type;
  log(`Starting ${title}`);
  const repeatedRequests = _.flatten(
    requests.map(request => _.fill(Array(repeat), request)),
  );
  let requestsMade = 0;
  const responses = await new Promise((resolve, reject) => {
    mapLimit(
      repeatedRequests,
      concurrency,
      async request => {
        const startTime = now();
        const requestNumber = ++requestsMade;
        log(
          title,
          'requests made:',
          requestNumber,
          'of',
          repeatedRequests.length,
        );
        let response;
        try {
          response = await request();
        } catch (e) {
          log(
            title,
            `Request #${requestNumber} failed with status "${e.response
              .status}" after ${humanizeDuration(
              Math.round(now() - startTime),
            )}`,
          );
          response = e.response;
        }
        return Object.assign(
          {
            status: response.status,
            duration: now() - startTime,
          },
          getSize && { size: getSize(response) },
        );
      },
      (err, results) => {
        if (err) {
          log(err.response);
          reject(err);
        }
        resolve(results);
      },
    );
  });

  const successfulResponses = responses.filter(x => x.status === 200);

  const durations = successfulResponses.map(x => x.duration);

  const benchmarkResults = {
    type,
    context,
    requests: responses.length,
    concurrency,
    successful: successfulResponses.length,
    errors: _.omit(
      _.mapValues(_.groupBy(responses, x => x.status), x => x.length),
      '200',
    ),
    meanSize: stats.mean(successfulResponses.map(x => x.size)),
    mean: stats.mean(durations),
    median: stats.median(durations),
    stdev: stats.stdev(durations),
    histogram: stats.histogram(durations),
    date: new Date().toISOString(),
  };
  log(formatBenchmarks([benchmarkResults]));
  analytics.track('Benchmark Save Sets', benchmarkResults);
  return benchmarkResults;
};

module.exports = benchmark;
