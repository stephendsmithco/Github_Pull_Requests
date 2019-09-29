const express = require('express')
const app = express()
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')
const port = process.env.PORT || 5000
const ghPullRequestsController = require('./controllers/gh_pull_requests_controller')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/gh_pull_requests', (req, res) => {
  ghPullRequestsController.getGHPullRequests(req, res)
})

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname + '/../client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
