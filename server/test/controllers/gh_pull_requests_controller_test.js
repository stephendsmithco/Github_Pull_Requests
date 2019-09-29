const expect = require('chai').expect
const sinon = require('sinon')
const ghRequestHelper = require('../../src/helpers/gh_request_helper')

describe('gh_pull_requests_controller', () => {
  const ghPullRequestController = require('../../src/controllers/gh_pull_requests_controller')

  describe('getGHPullRequests', () => {
    let req
    let requestHelperUNStub
    let requestHelperResponseStub
    const firstResponse = [{ html_url: 'the html url', title: 'cool title', comments_url: 'comment', commits_url: 'commits', user: { login: 'user' } }]
    const secondResponse = [1, 2, 3]
    const thirdResponse = [1, 2]

    beforeEach(() => {
      req = {
        query: {
          gh_repository_url: 'https://github.com/stephendsmithco/Github_Pull_Requests'
        }
      }
      requestHelperUNStub = sinon.stub(ghRequestHelper, 'getUsernameRepoFromUrl').returns(
        Promise.resolve({
          username: 'stephendsmithco',
          repo: 'Github_Pull_Requests'
        }))

      requestHelperResponseStub = sinon.stub(ghRequestHelper, 'getGHResponseFromUrl')
      requestHelperResponseStub.onCall(0).returns(Promise.resolve(firstResponse))
      requestHelperResponseStub.onCall(1).returns(Promise.resolve(secondResponse))
      requestHelperResponseStub.onCall(2).returns(Promise.resolve(thirdResponse))
    })

    afterEach(() => {
      requestHelperUNStub.restore()
      requestHelperResponseStub.restore()
    })

    it('should handle the happy path and put the necessary data onto the res', async () => {
      const expectedResponse = {
        count: 1,
        results: [{
          html_url: 'the html url',
          title: 'cool title',
          user: 'user',
          comment_count: 3,
          commit_count: 2
        }]
      }
      const res = {
        send: response => {
          expect(response).to.eql(expectedResponse)
        }
      }
      await ghPullRequestController.getGHPullRequests(req, res)
    })
  })
})
