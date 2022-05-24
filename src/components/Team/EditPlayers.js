import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { createPlayer, deletePlayer, updatePlayer } from '../../api/player'
import { showTeam } from '../../api/team'

class EditPlayers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      tId: '',
      amt: 0,
      players: []
    }
  }

  componentDidMount () {
    const id = this.props.match.params.id
    const { user } = this.props
    showTeam(user, id)
      .then((response) => this.setState({ tId: response.data.team._id, name: response.data.team.name, players: response.data.team.players }))
      .then(() => this.setState({ amt: this.state.players.length }))
      .then(() => {
        for (let i = 1; i < this.state.amt + 1; i++) {
          let value = this.state.players[i - 1].name
          const pId = this.state.players[i - 1]._id
          const points = this.state.players[i - 1].points
          const rebounds = this.state.players[i - 1].rebounds
          const assists = this.state.players[i - 1].assists

          if (pId === undefined) value = ''
          if (value === undefined) value = ''
          this.setState({
            ['player' + i]: value,
            ['player' + i + 'key']: pId,
            ['player' + i + 'points']: points,
            ['player' + i + 'rebounds']: rebounds,
            ['player' + i + 'assists']: assists

          })
        }
      })
      .catch(console.error)
  }

  onShowTeam = () => {
    const id = this.props.match.params.id
    const { user } = this.props
    showTeam(user, id)
      .then((response) => this.setState({ players: response.data.team.players }))
      .then(() => {
        for (let i = 1; i < this.state.players.length + 1; i++) {
          let value = this.state.players[i - 1].name
          let pId = this.state.players[i - 1]._id
          const points = this.state.players[i - 1].points
          const rebounds = this.state.players[i - 1].rebounds
          const assists = this.state.players[i - 1].assists
          if (pId === undefined) pId = ''
          if (value === undefined) value = ''
          this.setState({
            ['player' + 1]: value,
            ['player' + i + 'key']: pId,
            ['player' + i + 'points']: points,
            ['player' + i + 'rebounds']: rebounds,
            ['player' + i + 'assists']: assists
          })
        }
      })
      .catch(console.error)
  }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

    onSubmit= (event) => {
      event.preventDefault()

      let iteration = 0
      for (let i = 1; i < this.state.amt + 1; i++) {
        const { user, history } = this.props
        const name = this.state['player' + i]
        const pId = this.state['player' + i + 'key']
        const points = this.state['player' + i + 'points']
        const rebounds = this.state['player' + i + 'rebounds']
        const assists = this.state['player' + i + 'assists']
        // console.log({ user })
        if (pId === undefined) {
          createPlayer(user, this.state.tId, name, points, rebounds, assists)
          // .then((response) =>
          //   this.setState({ players: response.data.team.players }))
            .then(() => this.onShowTeam())
            .then(() => this.setJSX())
            .then(() => history.push('/teams/' + this.state.tId))
            .catch(() => console.error)
        } else {
          updatePlayer(user, this.state.tId, pId, name, points, rebounds, assists)
            .then(() => this.onShowTeam())
            .then(() => this.setJSX())
            .then(() => {
              iteration++
              if (iteration === this.state.amt) {
                history.push('/teams/' + this.state.tId)
              }
            })
            .catch(() => {
              iteration++
              return console.error
            })
        }
      }
    }

    deleteDynamic = (event) => {
      const num = event.target.getAttribute('data-num')
      const pId = event.target.getAttribute('data-id')
      const { tId, amt } = this.state
      const { user } = this.props
      if (pId === null || pId === '') {
        for (let i = num; i < amt; i++) {
          const r = parseInt(i) + 1
          if (this.state['player' + r] === undefined) {
            this.setState({ ['player' + i]: '' })
          }
          this.setState({ ['player' + i]: this.state['player' + r] })
        }
        this.setState({ amt: this.state.amt - 1, ['player' + amt]: null })
        this.setJSX()
        return
      }
      deletePlayer(tId, pId, user)
        .then(() => this.onShowTeam())
        .then(() => {
          for (let i = num; i < amt; i++) {
            const r = parseInt(i) + 1
            if (this.state['player' + r] === undefined) {
              this.setState({ ['player' + i]: '' })
            }
            this.setState({ ['player' + i]: this.state['player' + r], ['player' + i + 'key']: this.state['player' + r + 'key'] })
          }
          this.setState({ amt: this.state.amt - 1, ['player' + amt]: undefined, ['player' + amt + 'key']: undefined })
        })
        .then(() => this.setJSX())
        .catch(() => console.error)
    }

  addPlayer = () => {
    this.setState({
      amt: 1,
      ['player' + 1]: '',
      ['player' + 1 + 'key']: undefined,
      ['player' + 1 + 'points']: '',
      ['player' + 1 + 'rebounds']: '',
      ['player' + 1 + 'assists']: ''
    })
    this.setJSX()
  }

  setJSX = () => {
    const playerJSX = []
    for (let i = 1; i < this.state.amt + 1; i++) {
      playerJSX.push(
        <div key={i}>
          <Form.Group>
            <Form.Label>Player</Form.Label>
            <Form.Control
              required
              maxLength='300'
              type='text'
              value={this.state['player' + i] || ''}
              name={'player' + i}
              placeholder='Enter player Name'
              onChange={(e) => this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Points per game</Form.Label>
            <Form.Control
              name={'player' + i + 'points'}
              type='text'
              value={this.state['player' + i + 'points'] || ''}
              placeholder='Enter point per game'
              onChange={(e) => this.handleChange}
            />
          </Form.Group>
          <Button
            variant='primary'
            type='button'
            onClick={this.deleteDynamic}
            data-num={i}
            data-id={this.state['player' + i + 'key']}>Delete Player
          </Button>
        </div>
      )
    }
    return playerJSX
  }

  render () {
    const playerJSX = this.setJSX()
    const { name } = this.state
    if (name === '') {
      return 'Loading ...'
    }
    return (
      <>
        <h4>{this.state.name}</h4>
        <p>Team Name: {this.state.text}</p>
        <Button variant='primary' onClick={this.addPlayer}>Add Player</Button>
        <Form onSubmit={this.onSubmit}>
          {playerJSX}
          <Button variant='primary' type='submit'>Submit</Button>
        </Form>
      </>
    )
  }
}

export default withRouter(EditPlayers)
