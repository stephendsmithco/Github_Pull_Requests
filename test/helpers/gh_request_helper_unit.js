const expect = require('chai').expect
const sinon = require('sinon')

describe('gh_requst_helper_unit', () => {
  const ghRequestHelper = require('../../src/helpers/gh_request_helper')

  describe('getUsernameRepoFromUrl', () => {
    it('should parse the username and repo out of a valid github url', () => {
      const url = 'https://github.com/stephendsmithco/Github_Pull_Requests'
      const results = ghRequestHelper.getUsernameRepoFromUrl(url)
      expect(results).to.eql({ username: 'stephendsmithco', repo: 'Github_Pull_Requests' })
    })

    it('should throw an error if the url is not valid', () => {
      try {
        const url = 'stephendsmithco/Github_Pull_Requests'
        ghRequestHelper.getUsernameRepoFromUrl(url)
        expect(true).to.equal(false, 'Should have thrown an error')
      } catch (err) {
        expect(err.message).to.eql('Unable to parse url')
      }
    })
  })

  describe('getGHResponseFromUrl', () => {
    const rpNative = require('request-promise-native')
    let rpNativeStub

    beforeEach(() => {
      rpNativeStub = sinon.stub(rpNative, 'get')
        .returns(Promise.resolve(JSON.stringify([{ test: 'test' }])))
    })

    afterEach(() => {
      rpNativeStub.restore()
    })

    it('should call rpNative.get with the supplied url and userAgent and return the results', async () => {
      const response = await ghRequestHelper.getGHResponseFromUrl('url', 'userAgent')
      sinon.assert.calledWith(rpNativeStub, 'url', {
        headers: {
          'User-Agent': 'userAgent'
        }
      })
      expect(response).to.eql([{ test: 'test' }])
    })
  })
})
