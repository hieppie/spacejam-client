import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { showTeam, deleteTeam } from '../../api/team'
import { Button, Table } from 'react-bootstrap'

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

  addPlayers = () => {
    const { history } = this.props
    history.push('/teams/' + this.props.match.params.id + '/update/players')
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
      playerJSX = <div >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Points per Game</th>
              <th>Rebounds per Game</th>
              <th>Assists per Game</th>
            </tr>
          </thead>
          <tbody>
            {team.players.map((player) => (
              <tr key={player._id}>
                <td>{player.name.replaceAll('_', ' ')}</td>
                <td>{player.points}</td>
                <td>{player.rebounds}</td>
                <td>{player.assists}</td>
              </tr>
            ))}
            {/* <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr> */}
          </tbody>
        </Table>
        {/* <p>{player.name.replaceAll('_', ' ')}</p>
          <p> points: {player.points}</p>
          <p> rebounds:{player.rebounds}</p>
          <p> assist: {player.assists}</p> */}
      </div>
    }
    let buttonJSX
    if (team.owner === user._id) {
      buttonJSX =
            <>
              <Button variant="primary" onClick={this.deleteClick}>Delete Team</Button>
              <Button variant="primary" onClick={this.updateClick}>Edit Team</Button>
              <Button variant="primary" onClick={this.addPlayers}>Edit Roster</Button>
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
        <h2>{this.state.team.name}</h2>
        {buttonJSX}
        <h4>Players stats per game</h4>
        <div>{playerJSX}</div>
      </>
    )
  }
}

export default withRouter(Team)
