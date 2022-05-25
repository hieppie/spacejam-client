import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { createPlayer, deletePlayer, updatePlayer } from '../../api/player'
import { showTeam } from '../../api/team'

class EditPlayers extends Component {
  // _isMounted = false
  // these props are pretty much Team props
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
    // this._isMounted = true
    const id = this.props.match.params.id
    // make the user this.props
    const { user } = this.props
    console.log(this.state.players)
    console.log(this.props)
    console.log(user)
    console.log(id)
    showTeam(user, id)
      // put the response team and players inside of state. put the teamid, team name, players to this state.
      .then((response) => this.setState({ tId: response.data.team._id, name: response.data.team.name, players: response.data.team.players }))
      // set amt= the number of players of that team
      .then(() => this.setState({ amt: this.state.players.length }))
      .then(() => {
        for (let i = 1; i < this.state.amt + 1; i++) {
          // set 'value' to state name
          const value = this.state.players[i - 1].name
          // set 'playerId' to state playersA._id
          const pId = this.state.players[i - 1]._id
          // set 'points' to state playersA.points
          const points = this.state.players[i - 1].points
          // set 'points' to state playersA.rebounds
          const rebounds = this.state.players[i - 1].rebounds
          // set 'points' to state playersA.assists
          const assists = this.state.players[i - 1].assists

          // if (pId === undefined) value = ''
          // if (value === undefined) value = ''
          // assigning those variables to the setstate fields
          this.setState({
            ['player' + i]: value,
            ['player' + i + 'key']: pId,
            ['player' + i + 'points']: points,
            ['player' + i + 'rebounds']: rebounds,
            ['player' + i + 'assists']: assists

          })
          console.log(this.state)
        }
      })
      .catch(console.error)
    console.log(this.props)
    console.log(this.state)
    console.log(this.state.players)
  }

  // onShowTeam = () => {
  //   const id = this.props.match.params.id
  //   const { user } = this.props
  //   showTeam(user, id)
  //     .then((response) => this.setState({ players: response.data.team.players }))
  //     .then(() => {
  //       for (let i = 1; i < this.state.players.length + 1; i++) {
  //         const value = this.state.players[i - 1].name
  //         const pId = this.state.players[i - 1]._id
  //         const points = this.state.players[i - 1].points
  //         const rebounds = this.state.players[i - 1].rebounds
  //         const assists = this.state.players[i - 1].assists
  //         // if (pId === undefined) pId = ''
  //         // if (value === undefined) value = ''
  //         this.setState({
  //           ['player' + i]: value,
  //           ['player' + i + 'key']: pId,
  //           ['player' + i + 'points']: points,
  //           ['player' + i + 'rebounds']: rebounds,
  //           ['player' + i + 'assists']: assists
  //         })
  //       }
  //     })
  //     .catch(console.error)
  // }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

  onSubmit= (event) => {
    event.preventDefault()

    // let iteration = 0
    for (let i = 1; i < this.state.amt + 1; i++) {
      const { user, history } = this.props
      console.log(user)
      // assigning variables to the state fields
      const name = this.state['player' + i]
      const pId = this.state['player' + i + 'key']
      const points = this.state['player' + i + 'points']
      const rebounds = this.state['player' + i + 'rebounds']
      const assists = this.state['player' + i + 'assists']
      if (pId === undefined) {
        // pushing the state tId, name, pts, rebs, assists to the database
        createPlayer(user, this.state.tId, name, points, rebounds, assists)
          // .then(() => this.onShowTeam())
          // .then(() => this.setJSX())
          .then(() => history.push('/teams/' + this.state.tId))
          .catch(() => console.error)
      } else {
        updatePlayer(user, this.state.tId, pId, name, points, rebounds, assists)
          // .then(() => this.onShowTeam())
          // .then(() => this.setJSX())
          .then(() => history.push('/teams/' + this.state.tId))
          .catch(() => console.error)
          // put in iterations because it could not update all players in time. had to make sure all iterations run then .push
          // however without it, it will update multiple players but not show it in time. but only happen for the first time update.
          // after the first update every update after that is good
        // .then(() => {
        //   iteration++
        //   if (iteration === this.state.amt) {
        //     history.push('/teams/' + this.state.tId)
        //   }
        // })
        // .catch(() => {
        //   // iteration++
        //   return console.error
        // })
      }
    }
    console.log(this.state)
  }

    deleteDynamic = (event) => {
      const num = event.target.getAttribute('data-num')
      const pId = event.target.getAttribute('data-id')
      const { tId, amt } = this.state
      console.log(this.state)
      const { user } = this.props
      console.log(user)
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
        // .then(() => this.onShowTeam())
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
      // error if : ''
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type='text'
              // has to put || '' or else it will throw a uncontrolled error
              value={this.state['player' + i] || ''}
              name={'player' + i}
              placeholder='Enter player Name'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Points per game</Form.Label>
            <Form.Control
              name={'player' + i + 'points'}
              type='text'
              value={this.state['player' + i + 'points'] || ''}
              placeholder='Enter point per game'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rebounds per game</Form.Label>
            <Form.Control
              name={'player' + i + 'rebounds'}
              type='text'
              value={this.state['player' + i + 'rebounds'] || ''}
              placeholder='Enter rebounds per game'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Assists per game</Form.Label>
            <Form.Control
              name={'player' + i + 'assists'}
              type='text'
              value={this.state['player' + i + 'assists'] || ''}
              placeholder='Enter assists per game'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button
            variant='primary'
            type='button'
            onClick={this.deleteDynamic}
            data-num={i}
            data-id={this.state['player' + i + 'key']}>Drop Player
          </Button>
        </div>
      )
    }
    return playerJSX
  }

  // had to throw this in. fix Warning: Can't perform a React state update on an unmounted component.google
  componentWillUnmount () {
    this.setState = (state, callback) => { }
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
        {/* <p>Team Name: {this.state.text}</p> */}
        <Button variant='primary' onClick={this.addPlayer}>Add a player</Button>
        <Form onSubmit={this.onSubmit}>
          {playerJSX}
          <Button variant='primary' type='submit'>Submit</Button>
        </Form>
      </>
    )
  }
}

export default withRouter(EditPlayers)
