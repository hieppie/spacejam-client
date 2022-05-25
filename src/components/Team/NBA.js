import React, { Component } from 'react'
// import './App.css'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class NBA extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playerName: null,
      playerStats: {}
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.getPlayerId()
    // console.log(this.state.playerName)
  }

  handleChange = (event) => {
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
          console.log(res.data.data)
          this.setState({ playerStats: res.data.data[0] })
        }).catch((err) => {
          console.log(err)
        })
    }

    componentDidMount () {
      this.getPlayerId()
      this.getPlayerStats()
    }

    render () {
      return (
        <div className='App'>
          <h3>NBA players stats per game</h3>
          <form onSubmit={this.handleSubmit}>
            <label>Player Name
              <input
                type='text'
                value={this.state.value}
                onChange={this.handleChange}
                placeholder='Enter player name'
              />
            </label>
            <input type='submit' value='Submit' />
          </form>
          <br />
                    Name: {this.state.playerName}
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
          <br />
          {/* position: {this.state.playerStats['player']['position']}
                  <br /> */}
        </div>
      )
    }
}

export default withRouter(NBA)
