import apiUrl from '../apiConfig'
import axios from 'axios'

export const createPlayer = (name, points, rebounds, assists, threeptm, steals, blocks, fgpct, ftpct, turnovers, teamId, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/players/',
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      player: {
        name: name,
        points: points,
        rebounds: rebounds,
        assists: assists,
        threeptm: threeptm,
        steals: steals,
        blocks: blocks,
        fgpct: fgpct,
        ftpct: ftpct,
        turnovers: turnovers,
        teamId: teamId,
        owner: user._id
      }
    }
  })
}

export const updatePlayer = (name, points, rebounds, assists, threeptm, steals, blocks, fgpct, ftpct, turnovers, teamId, pId, user) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/players/' + pId,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      player: {
        name: name,
        points: points,
        rebounds: rebounds,
        assists: assists,
        threeptm: threeptm,
        steals: steals,
        blocks: blocks,
        fgpct: fgpct,
        ftpct: ftpct,
        turnovers: turnovers,
        teamId: teamId,
        owner: user._id
      }
    }
  })
}

export const deletePlayer = (tId, pId, user) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/players/' + pId,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      player: {
        teamId: tId
      }
    }
  })
}
