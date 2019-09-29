'use strict'
const rpNative = require('request-promise-native')

const GITHUB_BASE_URL = 'https://api.github.com'

async function getGHPullRequests (req, res) {
  const githubUrl = req.query.github_url
  const urlSplit = githubUrl.split('/')
  const username = urlSplit[3]
  const repo = urlSplit[4]
  const response = await rpNative.get(`${GITHUB_BASE_URL}/repos/${username}/${repo}/pulls`,
    {
      headers: {
        'User-Agent': 'stephendsmithco'
      }
    })
  console.log('Response: ', response)
  res.send('Hello World')
}

module.exports = {
  getGHPullRequests
}
