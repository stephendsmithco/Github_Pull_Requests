'use strict'

var expect = require('chai').expect

describe('helloWorldController', () => {
  const ghPullRequestController = require('../../src/controllers/gh_pull_requests_controller')
  describe('getGHPullRequests', () => {
    it('should send the string "Hello World" onto the res', () => {
      var res = {
        send: textToSend => {
          expect(textToSend).to.equal('Hello World')
        }
      }
      ghPullRequestController.getGHPullRequests({}, res)
    })
  })
})
