import apiUrl from '../apiConfig'
import axios from 'axios'

export const createPlayer = (user, teamId, name, points, rebounds, assists) => {
  // console.log(user)
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
        teamId: teamId,
        owner: user._id
      }
    }
  })
}

export const updatePlayer = (user, teamId, pId, name, points, rebounds, assists) => {
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
