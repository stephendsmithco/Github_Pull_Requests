const logger = require('./logger').logger
const rpNative = require('request-promise-native')

function getUsernameRepoFromUrl (url) {
  try {
    const urlSplit = url.split('/')
    if (urlSplit.length !== 5) {
      throw new Error('Incorrect number of / found')
    }

    return {
      username: urlSplit[3],
      repo: urlSplit[4]
    }
  } catch (err) {
    logger.log('error', `Unable to get information from url ${url}, Error: ${err}`)
    throw new Error('Unable to parse url')
  }
}

async function getGHResponseFromUrl (url, userAgent) {
  try {
    const response = await rpNative.get(url,
      {
        headers: {
          'User-Agent': userAgent
        }
      })
    logger.log('info', `Got response ${response} from url ${url}`)
    return JSON.parse(response)
  } catch (err) {
    logger.log('error', `Unable to get response from url ${url}, Error: ${err}`)
    throw new Error('Error getting information from github')
  }
}

module.exports = {
  getUsernameRepoFromUrl,
  getGHResponseFromUrl
}
