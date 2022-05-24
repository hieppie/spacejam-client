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
    // console.log('delete button')
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
      playerJSX = team.players.map((player) => (
        <div key={player._id}>
          <li>{player.name}</li>
          <p> points: {player.points}</p>
          <p> assist: {player.assists}</p>
          <p> rebounds:{player.rebounds}</p>
        </div>
      ))
    }
    let buttonJSX
    if (team.owner === user._id) {
      buttonJSX =
            <>
              <Button variant="primary" onClick={this.deleteClick}>Delete Team</Button>
              <Button variant="primary" onClick={this.updateClick}>Update Team Name</Button>
              {/* <Button variant="primary" onClick>Update Player</Button> */}
            </>
    }
    if (team.text === '') {
      return (
        <>
          <h4>Team Name</h4>
          <h5> Players</h5>
          <>{playerJSX}</>
          {buttonJSX}
        </>
      )
    }
    return (
      <>
        <h4>Team Name: {this.state.team.name}</h4>
        <h5>Players:</h5>
        <ul>{playerJSX}</ul>
        {buttonJSX}
      </>
    )
  }
}

export default withRouter(Team)
