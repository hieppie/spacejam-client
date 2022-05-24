import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { indexTeams } from '../../api/team'
import { Button } from 'react-bootstrap'

class IndexTeams extends Component {
  constructor (props) {
    super(props)
    this.state = {
      teams: null,
      show: false,
      owned: false
    }
  }

    viewAllTeams = () => {
      const { msgAlert, user } = this.props
      indexTeams(user)
        .then((res) =>
          res.data.teams.filter((team) => team.owner !== this.props.user._id)
        )
        .then((res) => this.setState({ teams: res, show: true, owned: false }))
        .then(() =>
          msgAlert({
            heading: 'Index of Teams',
            message: 'success',
            variant: 'success'
          })
        )
        .catch((error) => {
          msgAlert({
            heading: 'Error',
            message: 'Error' + error.message,
            variant: 'danger'
          })
        })
    }

    viewYourTeams = () => {
      const { msgAlert, user } = this.props
      indexTeams(user)
        .then((res) =>
          res.data.teams.filter((team) => team.owner === this.props.user._id)
        )
        .then((res) => this.setState({ teams: res, show: true, owned: true }))
        .then(() =>
          msgAlert({
            heading: 'Index Team Success',
            message: 'success',
            variant: 'success'
          })
        )
        .catch((error) => {
          msgAlert({
            heading: 'Error',
            message: 'Error:' + error.message,
            variant: 'danger'
          })
        })
    }

    goBack = () => {
      this.setState({ show: false })
    }

    render () {
      const { teams, show, owned } = this.state
      let nameJSX
      if (owned) {
        nameJSX = <h3> Your Teams</h3>
      } else {
        nameJSX = <h3> All Teams</h3>
      }
      if (show) {
        if (teams === null) {
          return 'Loading...'
        } else {
          return (
            <div className='row'>
              <div className='col-sm-10 col-md-8 mx-auto mt-5'>
                {nameJSX}
                {teams.map(team => {
                  return <li id={team._id} key={team._id}><Link to={'/teams/' + team._id}>{team.name}</Link></li>
                })}
                <Button variant='primary' onClick={this.goBack}>Back</Button>
              </div>
            </div>
          )
        }
      }

      return (
        <>
          <Button variant='primary' onClick={this.viewAllTeams}>View All Teams</Button> <br/>
          <Button onClick={this.viewYourTeams}>View Your Teams</Button>
        </>
      )
    }
}

export default withRouter(IndexTeams)
