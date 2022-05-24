import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { updateTeam, showTeam } from '../../api/team'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class UpdateTeam extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      players: false
    }
  }

  componentDidMount () {
    const id = this.props.match.params.id
    const { user } = this.props
    showTeam(user, id)
      .then((response) => this.setState({ name: response.data.team.name }))
      .catch(console.error)
  }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

  onUpdateTeam = (event) => {
    event.preventDefault()
    const id = this.props.match.params.id
    const { user, history } = this.props
    updateTeam(this.state, user, id)
      .then(() => history.push('/teams/' + this.props.match.params.id))
  }

  test = () => {
    this.setState({ players: true })
  }

  render () {
    if (this.state.name === '') {
      return 'Loading...'
    }
    if (this.state.players) {
      return <Redirect to={'/teams/' + this.props.match.params.id + '/update/players'}/>
    }
    return (
      <>
        <div className='row'>
          <div className='col-sm-10 col-md-8 mx-auto mt-5'>
            <h3>Update Team Name</h3>
            <Form onSubmit={this.onUpdateTeam}>
              <Form.Group controlId='title'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type='title'
                  name='name'
                  value={this.state.name}
                  placeholder='Enter team name'
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button variant='primary' type='submit'>Submit</Button>
            </Form>
          </div>
        </div>
        <Button variant='primary' onClick={this.test}>Players</Button>
      </>
    )
  }
}

export default withRouter(UpdateTeam)
