'use strict'
const rpNative = require('request-promise-native')

const GITHUB_BASE_URL = 'https://api.github.com'

async function getGHResponseFromUrl(url) {
  return JSON.parse(await rpNative.get(url,
    {
      headers: {
        'User-Agent': 'stephendsmithco'
      }
    }))
}

async function getGHPullRequests (req, res) {
  const githubUrl = req.query.github_url
  const urlSplit = githubUrl.split('/')
  const username = urlSplit[3]
  const repo = urlSplit[4]
  const response = await getGHResponseFromUrl(`${GITHUB_BASE_URL}/repos/${username}/${repo}/pulls`)
  
  const numPullRequests = response.length
  const detailsPromisesArray = []

  const results = response.reduce((pullRequestInfos, pullRequest) => {
    pullRequestInfos.push({
      html_url: pullRequest.html_url,
      title: pullRequest.title
    })
    detailsPromisesArray.push(getGHResponseFromUrl(pullRequest.review_comments_url))
    detailsPromisesArray.push(getGHResponseFromUrl(pullRequest.commits_url))
    return pullRequestInfos
  }, [])
  const detailsResponses = await Promise.all(detailsPromisesArray)
  for (let i = 0; i < numPullRequests; i++) {
    results[i].comments_count = detailsResponses[i * 2].length
    results[i].commit_count = detailsResponses[(i * 2) + 1].length
  }
  res.send({
    count: numPullRequests,
    results: results
  })
}

module.exports = {
  getGHPullRequests
}
