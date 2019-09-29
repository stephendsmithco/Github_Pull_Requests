'use strict'

var expect = require('chai').expect

describe('helloWorldController', () => {
  const helloWorldController = require('../../src/controllers/hello_world_controller')
  describe('getHelloWorld', () => {
    it('should send the string "Hello World" onto the res', () => {
      var res = {
        send: textToSend => {
          expect(textToSend).to.equal('Hello World')
        }
      }
      helloWorldController.getHelloWorld({}, res)
    })
  })
})
