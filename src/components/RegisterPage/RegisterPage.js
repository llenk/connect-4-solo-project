import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid } from '@material-ui/core';

import RulesSide from '../RulesSide/RulesSide';

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.setState({
        message: 'Choose a username and password!',
      });
    } else {
      const body = {
        username: this.state.username,
        password: this.state.password,
      };

      // making the request to the server to post the new user's registration
      axios.post('/api/user/register/', body)
        .then((response) => {
          if (response.status === 201) {
            this.props.history.push('/home');
          } else {
            this.setState({
              message: 'Ooops! That didn\'t work. The username might already be taken. Try again!',
            });
          }
        })
        .catch(() => {
          this.setState({
            message: 'Ooops! Something went wrong! Is the server running?',
          });
        });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.state.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.state.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <Grid container>
        <Grid item md={8} xs={12}>
          <RulesSide />
        </Grid>
        <Grid item md={4} xs={12}>
          <div>
            {this.renderAlert()}
            <form onSubmit={this.registerUser} className="loReg">
              <h1>Register User</h1>
              <Grid container>
                <Grid item xs={4}>
                  <label htmlFor="username">
                    Username:
                  </label>
                </Grid>
                <Grid item xs={8}>
                  <input
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleInputChangeFor('username')}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <div>
                    <label htmlFor="password">
                      Password:
                  </label>
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <div>
                    <input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleInputChangeFor('password')}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Link to="/home">Cancel</Link>
                </Grid>
                <Grid item xs={8}>
                  <input
                    type="submit"
                    name="submit"
                    value="Register"
                  />
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default RegisterPage;

