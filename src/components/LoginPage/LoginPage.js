import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { triggerLogin, formError, clearError } from '../../redux/actions/loginActions';
import { Grid } from '@material-ui/core';

import RulesSide from '../RulesSide/RulesSide';

const mapStateToProps = state => ({
  user: state.user,
  login: state.login,
});

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(clearError());
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.user.userName) {
      this.props.history.push('/user');
    }
  }

  login = (event) => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.props.dispatch(formError());
    } else {
      this.props.dispatch(triggerLogin(this.state.username, this.state.password));
    }
  }

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.props.login.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.props.login.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <Grid container>
        <Grid item md={8}>
          <RulesSide />
        </Grid>
        <Grid item md={4}>
          <div>
            {this.renderAlert()}
            <form onSubmit={this.login} className="loReg">
              <h1>Login</h1>
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
                  <label htmlFor="password">
                    Password:
                </label>
                </Grid>
                <Grid item xs={8}>
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChangeFor('password')}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Link to="/register">Register</Link>
                </Grid>
                <Grid item xs={8}>
                  <input
                    type="submit"
                    name="submit"
                    value="Log In"
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

export default connect(mapStateToProps)(LoginPage);
