
var compose = require('request-compose')
var request = compose.client

var pipe = ({auth, address}) => compose(
  _ => request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {key: auth.google, address},
  }),
  ({body: {results: [{geometry: {location}}]}}) => request({
    url: `https://api.darksky.net/forecast/${auth.darksky}/${location.lat},${location.lng}`,
    qs: {exclude: 'minutely,hourly,daily,alerts,flags'},
  }),
  ({body: {currently: {icon}}}) => ({
    'clear-day': 'sunny',
    'clear-night': 'crescent_moon',
    'rain': 'rain_cloud',
    'snow': 'snow_cloud',
    'sleet': 'snowflake',
    'wind': 'wind_blowing_face',
    'fog': 'fog',
    'cloudy': 'cloud',
    'partly-cloudy-day': 'partly_sunny',
    'partly-cloudy-night': 'new_moon',
    'thunderstorm': 'lightning',
    'tornado': 'tornado',
  })[icon],
  (emoji) => request({
    method: 'POST',
    url: 'https://slack.com/api/users.profile.set',
    headers: {authorization: `Bearer ${auth.slack}`},
    form: {profile: JSON.stringify(
      {status_text: '(⌐■_■)', status_emoji: `:${emoji}:`})},
  })
)()

;(async () => {
  /*
    1. Get the latitude,longitude of a location
    2. Get the weather forecast for that location
    3. Map the weather icons to emoji shortcodes
    4. Update the user's status icon in Slack
  */
  var auth = {
    google: '[GOOGLE API KEY]',
    darksky: '[DARKSKY API KEY]',
    slack: '[SLACK ACCESS TOKEN]',
  }
  var address = '[LOCATION ADDRESS]'

  try {
    await pipe({auth, address})
    console.log('ᕙ(⇀‸↼‶)ᕗ')
  }
  catch (err) {
    console.error(err)
  }
})()
