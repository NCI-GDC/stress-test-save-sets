const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
  protocol: 'https',
});

module.exports = mixpanel;
