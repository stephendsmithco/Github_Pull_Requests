const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')
const port = process.env.PORT || 3000
const ghPullRequestsController = require('./controllers/gh_pull_requests_controller')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/gh_pull_requests', (req, res) => {
  ghPullRequestsController.getGHPullRequests(req, res)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
