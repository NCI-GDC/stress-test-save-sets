const _ = require('lodash');
const { table } = require('table');
const humanizeDuration = require('humanize-duration');

var humanizer = humanizeDuration.humanizer({
  language: 'en_short',
  languages: {
    en_short: {
      y: 'y',
      mo: 'mo',
      w: 'w',
      d: 'd',
      h: 'h',
      m: 'm',
      s: 's',
      ms: 'ms',
      decimal: '.',
    },
  },
});

const formatBenchmarks = benchmarks => {
  const headings = [
    'Benchmark',
    'Requests made',
    'Concurrency',
    'Successful requests',
    'Errors',
    'Mean Size',
    'Mean',
    'Median',
    'StDev',
  ];
  const rows = benchmarks.map(x => {
    return [
      x.context ? `${x.type} (${x.context})` : x.type,
      _.isNaN(x.requests) ? '--' : x.requests.toLocaleString(),
      _.isNaN(x.concurrency) ? '--' : x.concurrency.toLocaleString(),
      _.isNaN(x.successful) ? '--' : x.successful.toLocaleString(),
      _.map(x.errors, (count, status) => `${status} x${count}`).join('\n') ||
        '--',
      _.isNaN(x.meanSize) ? '--' : x.meanSize.toLocaleString(),
      _.isNaN(x.mean) ? '--' : humanizer(Math.round(x.mean)),
      _.isNaN(x.median) ? '--' : humanizer(Math.round(x.median)),
      _.isNaN(x.stdev) ? '--' : humanizer(Math.round(x.stdev)),
    ];
  });
  const formattedBenchmark = table([headings, ...rows]);
  return formattedBenchmark;
};

module.exports = formatBenchmarks;
