import apiUrl from '../apiConfig'
import axios from 'axios'

export const createTeam = (team, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/teams/',
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      team: {
        name: team.name
      }
    }
  })
}
export const indexTeams = (user) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/teams/',
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

export const showTeam = (user, id) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/teams/' + id,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

export const updateTeam = (team, user, id) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/surveys' + id,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      team: team.name
    }
  })
}

export const deleteTeam = (user, id) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/teams/' + id,
    headers: {
      Authoriation: `Bearer ${user.token}`
    }
  })
}
