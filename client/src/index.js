import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class GitHubForm extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      url: '',
      prDetails: [],
      message: 'Set a repository url to see commits'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({ url: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    fetch(`/gh_pull_requests?gh_repository_url=${this.state.url}`)
      .then(res => {
        if (!res.ok) {
          this.setState({ message: 'Error encountered' })
          return
        }
        return res.json()
      })
      .then(prInfo => {
        const details = []
        if (prInfo && prInfo.results) {
          if (prInfo.results.length > 0) {
            prInfo.results.forEach(pr => {
              details.push({
                html_url: pr.html_url,
                title: pr.title,
                user: pr.user,
                comment_count: pr.comment_count,
                commit_count: pr.commit_count
              })
            })
            this.setState({ prDetails: details, message: '' })
          } else {
            this.setState({ message: 'No PRs found' })
          }
        }
      })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Github Repository Url:
          <input type="text" value={ this.state.url } onChange={ this.handleChange } />
        </label>
        <input type="submit" value="Search" />
        {this.state && this.state.prDetails && this.state.prDetails.length > 0 ? (
          <div>
            <table>
              <tr>
                <th>PR Title</th>
                <th>PR Url</th>
                <th>User</th>
                <th>Commit Count</th>
                <th>Comment Count</th>
              </tr>
              {this.state.prDetails.map((pr) => {
                return (
                  <React.Fragment>
                    <th>{pr.title}</th>
                    <th>{pr.html_url}</th>
                    <th>{pr.user}</th>
                    <th>{pr.commit_count}</th>
                    <th>{pr.comment_count}</th>
                  </React.Fragment>
                )
              })}
            </table>
          </div>
      ) : (
      <div>
        {this.state.message}
      </div>
      )}
      </form>
    )
  }
}

ReactDOM.render(
  <GitHubForm />,
  document.getElementById('root')
)
