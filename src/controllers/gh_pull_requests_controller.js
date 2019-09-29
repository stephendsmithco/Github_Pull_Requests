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
  const numPullRequests = response.length()
  const results = response.reduce((pullRequestInfos, pullRequest) => {
    pullRequestInfos.push({
      html_url: pullRequest.html_url,
      title: pullRequest.title
    })
    return pullRequestInfos
  }, [])
  console.log('Response: ', response)
  res.send({
    count: numPullRequests,
    results: results
  })
}

module.exports = {
  getGHPullRequests
}
