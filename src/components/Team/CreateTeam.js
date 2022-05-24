import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { createTeam } from '../../api/team'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class CreateTeam extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      id: ''
    }
  }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

    onCreateTeam = (event) => {
      event.preventDefault()

      const { msgAlert, user, history } = this.props

      createTeam(this.state, user)
        .then((rest) => this.setState({ id: rest.data.team._id }))
        .then(() =>
          msgAlert({
            heading: 'Team created',
            message: 'success',
            variant: 'success'
          })
        )
        .then(() => history.push('/teams' + this.state.id))
        .catch((error) => {
          msgAlert({
            heading: 'Error',
            message: 'Error:' + error.message,
            variant: 'danger'
          })
        })
    }

    render () {
      const { name } = this.state
      return (
        <div className='row'>
          <div className= 'col-sm-10 cold-md-8 mx-auto mt-5'>
            <h3>Create a Team</h3>
            <Form onSubmit={this.onCreateTeam}>
              <Form.Group controlId='name'>
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  required
                  type='title'
                  name='title'
                  value={name}
                  placeholder='Enter team name'
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button variant='primary' type='submit'>Submit</Button>
            </Form>
          </div>
        </div>
      )
    }
}

export default withRouter(CreateTeam)
