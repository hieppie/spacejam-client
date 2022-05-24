import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { showTeam, deleteTeam } from '../../api/team'
import { Button } from 'react-bootstrap'

class Team extends Component {
  constructor (props) {
    super(props)
    this.state = {
      team: null
    }
  }

  componentDidMount (response) {
    const id = this.props.match.params.id
    const { user } = this.props
    // console.log(response.data.team)

    showTeam(user, id)
      .then((response) => this.setState({ team: response.data.team }))
      .catch(console.error)
  }

  deleteClick = () => {
    const id = this.props.match.params.id
    const { user, history } = this.props
    deleteTeam(user, id)
      .then(() => history.push('/teams'))
      .catch(console.error)
  }

  updateClick = () => {
    const { history } = this.props
    history.push('/teams/' + this.props.match.params.id + '/update')
  }

  render () {
    const { team } = this.state
    const { user } = this.props
    if (team === null) {
      return 'Loading...'
    }
    let playerJSX
    if (team.players.length === 0) {
      playerJSX = 'Your team is empty. Please add players'
    } else {
      playerJSX = team.players.map(player => (
        <li key={player._id}>{player.name}</li>
      ))
    }
    let buttonJSX
    if (team.owner === user._id) {
      buttonJSX =
            <>
              <Button variant="primary" onCLick={this.deleteClick}>Delete Team</Button>
              <Button variant="primary" onClick={this.updateClick}>Update Team Name</Button>
            </>
    }
    if (team.text === '') {
      return (
        <>
          <h4>Team</h4>
          <h5> All of Players</h5>
          <>{playerJSX}</>
          {buttonJSX}
        </>
      )
    }
    return (
      <>
        <h4>Team</h4>
        <h5>{this.state.team.name}</h5>
        <h5>All the Players</h5>
        <ul>{playerJSX}</ul>
        {buttonJSX}
      </>
    )
  }
}

export default withRouter(Team)
