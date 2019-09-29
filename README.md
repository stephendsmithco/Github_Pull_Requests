# Github_Pull_Requests
This is an app that displays pull request information for a given public github repository.
Swagger documentation for the back-end is available at /api-docs

# Dev start up
NOTE: Normally this would be split into separate repositories for ease of separate deployments/scaling/ect
From server directory
`npm run start:dev`  // This starts in dev mode, which will automatically restart the server when changes are detected
in another terminal, navigate to client directory and run `npm start`
Should be able to navigate to http://localhost:3000 and use app as normal.
WARNING: github has rate limiting that you may run into while testing this

test!
# Tests
npm test
Note: needs error tests still, only contains happy path unit tests