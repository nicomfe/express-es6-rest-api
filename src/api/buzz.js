import resource from 'resource-router-middleware'
import fetch from 'node-fetch'

let twitterToken = null
export default () => resource({
  index({ params }, res) {
    return twitterLogin().then((tokenData) => {
      twitterToken = tokenData
      getSomeBuzz(tokenData).then(data => {
        return res.status(200).send(data)
      }, (err) => {
        return res.status(500).send(err)
      })
    })
  },
})

const twitterLogin = () => {
  if (!twitterToken) {
    const body = 'grant_type=client_credentials'
    return fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      body,
      headers: {
        Authorization: 'Basic aWNEMTV5UHRKMXAwQkRxcFVBRmo3S0xqYTpDVkR4MVBRSFRxTlJDRDlRODgwUGM1SmxtbmhhNm92TzVTbmVhVnRRdm5td2o5MnNLcA==',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => res.json())
    .then(responseBody => {
      return { value: responseBody.access_token, type: responseBody.token_type }
    })
  }
  return new Promise(function(resolve, reject) {
    if(twitterToken) {
      resolve(twitterToken)
    } else {
      reject('Token error')
    }
  })
}

const getSomeBuzz = (tokenData) => {
  return twitterLogin().then(() => {
    return fetch('https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=236514151', {
      method: 'GET',
      headers: {
        Authorization: `${tokenData.type} ${tokenData.value}`,
      },
    })
    .then(res => res.json())
  })
}
