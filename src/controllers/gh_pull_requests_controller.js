const helper = require('../helpers/gh_request_helper')
const { getUsernameRepoFromUrl, getGHResponseFromUrl } = helper

const GITHUB_BASE_URL = 'https://api.github.com'

async function getGHPullRequests (req, res) {
  // Parse information from the gh_repository_url to get username and repo name
  let username
  let repo
  try {
    const githubInfo = getUsernameRepoFromUrl(req.query.gh_repository_url)
    username = githubInfo.username
    repo = githubInfo.repo
  } catch (err) {
    console.log(err)
    // If there is an error at this stage, it is a bad request
    res.status(400).send(err)
    return
  }

  // Get general information about the repo
  let response
  try {
    response = await getGHResponseFromUrl(`${GITHUB_BASE_URL}/repos/${username}/${repo}/pulls`, username)
  } catch (err) {
    res.status(500).send(err)
    return
  }

  const numPullRequests = response.length

  // In order to grab commits and comments about the pull requests, we will need to call separate endpoints, this array will hold the promises so they can be done async
  const detailsPromisesArray = []

  // Parse information about pull requests and set up calls to get comments and commits count
  const results = response.reduce((pullRequestInfos, pullRequest) => {
    pullRequestInfos.push({
      html_url: pullRequest.html_url,
      title: pullRequest.title
    })
    detailsPromisesArray.push(getGHResponseFromUrl(pullRequest.comments_url, username))
    detailsPromisesArray.push(getGHResponseFromUrl(pullRequest.commits_url, username))
    return pullRequestInfos
  }, [])

  let detailsResponses
  try {
    detailsResponses = await Promise.all(detailsPromisesArray)
  } catch (err) {
    res.status(500).send(err)
    return
  }

  // Each pr will have two corresponding promises (one for commits, one for comments)
  for (let i = 0; i < numPullRequests; i++) {
    results[i].comment_count = detailsResponses[i * 2].length
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
