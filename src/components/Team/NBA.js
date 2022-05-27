import React, { Component } from 'react'
// import './App.css'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { createPlayer } from '../../api/player'
import { Button, Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { showTeam } from '../../api/team'

class NBA extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playerName: '',
      players: [],
      playerStats: {},
      tId: ''
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.getPlayerId()
    // console.log(this.state.playerName)
  }

  onSubmit= (event) => {
    event.preventDefault()
    const { user, history } = this.props
    // console.log(user)
    // assigning variables to the state fields
    const name = this.state.playerName
    const points = this.state.playerStats.pts
    const rebounds = this.state.playerStats.reb
    const assists = this.state.playerStats.ast

    // pushing the state tId, name, pts, rebs, assists to the database
    createPlayer(user, this.state.tId, name, points, rebounds, assists)
    // .then(() => this.onShowTeam())
    // .then(() => this.setJSX())
      .then(() => history.push('/teams/' + this.state.tId))
      .catch(() => console.error)
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    const replace = event.target.value.split(' ').join('_')
    if (replace.length > 0) {
      this.setState({ playerName: replace })
    } else {
    //   alert('please type players name!')
    }
  }

    getPlayerId = () => {
      axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
        .then(async res => {
        // console.log(res.data.data)
          if (res.data.data[0] === undefined) {
            // alert('this player is either injured or hasn\'t played yet!')
          } else if (res.data.data.length > 1) {
            // alert('please specify the name more')
          } else {
            await this.getPlayerStats(res.data.data[0].id)
          }
        }).catch(err => {
          console.log(err)
        })
    }

    getPlayerStats = (playerId) => {
      axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${playerId}`)
        .then(async (res) => {
          // console.log(res.data.data)
          this.setState({ playerStats: res.data.data[0] })
        }).catch((err) => {
          console.log(err)
        })
    }

    componentDidMount () {
      const id = this.props.match.params.id

      const { user } = this.props

      showTeam(user, id)
      // put the response team and players inside of state. put the teamid, team name, players to this state.
        .then((response) => this.setState({ tId: response.data.team._id, name: response.data.team.name, players: response.data.team.players }))
        .catch(console.error)
      // this.getPlayerId()
      // this.getPlayerStats()
    }

    render () {
      return (
        <div className='App'>
          <h3>Add NBA Players to your Roster</h3>
          <Form onSubmit={this.handleSubmit}>
            <div >Search Players Stats per Game <br/>
              <input
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
                placeholder='First and Last name'
              />
            </div>
            <Button variant='primary' type='submit'>Search</Button>
            <Button variant='primary' type='button' onClick={this.onSubmit}>Add to Roster</Button>
          </Form>
          <br/>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Rebounds</th>
                <th>Assists</th>
                <th>3ptm</th>
                <th>Steals</th>
                <th>Blocks</th>
                <th>FG%</th>
                <th>FT%</th>
                <th>Turnovers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.playerName.replaceAll('_', ' ')}</td>
                <td>{this.state.playerStats.pts}  </td>
                <td>{this.state.playerStats.reb}</td>
                <td>{this.state.playerStats.ast}</td>
                <td>{this.state.playerStats.fg3m}</td>
                <td>{this.state.playerStats.stl}</td>
                <td>{this.state.playerStats.blk}</td>
                <td>{this.state.playerStats.fg_pct}</td>
                <td>{this.state.playerStats.ft_pct}</td>
                <td>{this.state.playerStats.turnover}</td>
              </tr>
            </tbody>
          </Table>
          {/* <br />
                    Name: {this.state.playerName.replaceAll('_', ' ')}
          <br />
                  Points: {this.state.playerStats.pts}
          <br />
                  Rebounds: {this.state.playerStats.reb}
          <br />
                  Assists: {this.state.playerStats.ast}
          <br />
                  3ptm: {this.state.playerStats.fg3m}
          <br />
                  Steals: {this.state.playerStats.stl}
          <br />
                  Blocks: {this.state.playerStats.blk}
          <br />
                  FG%: {this.state.playerStats.fg_pct}
          <br />
                  FT%: {this.state.playerStats.ft_pct}
          <br />
                  Turnovers: {this.state.playerStats.turnover}
          <br /> */}
          {/* position: {this.state.playerStats['player']['position']}
                  <br /> */}
          <Form onSubmit={this.onSubmit}>
          </Form>
        </div>
      )
    }
}

export default withRouter(NBA)
