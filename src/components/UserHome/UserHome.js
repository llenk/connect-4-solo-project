import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

import { Grid, Button } from '@material-ui/core';
import './UserHome.css';

const mapStateToProps = state => ({
  user: state.user,
});

class UserHome extends Component {
  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('');
    }
  }

  logout = () => {
    this.props.dispatch(triggerLogout());
    this.props.history.push('');
  }

  render() {
    let content = null;
    console.log(this.props.user);
    if (this.props.user.userInfo) {
      content = (
        <div>
          <Grid container>
            <Grid item lg={11} md={10} xs={9}>
            </Grid>
            <Grid item lg={1} md={2} xs={3}>
              <Button
                onClick={this.logout}
              >
                Log Out
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item lg={7}>
              <div className="welcomeDiv">
                <h1>
                  Welcome to Connect 4, {this.props.user.userInfo.username}!
                </h1>
                <h3>
                  Your stats are:
                </h3>
                <p>
                  Wins against an easy computer: {this.props.user.userInfo.wins_easy_computer}
                </p>
                <p>
                  Losses against an easy computer: {this.props.user.userInfo.losses_easy_computer}
                </p>
                <p>
                  Wins against a human: {this.props.user.userInfo.wins_human}
                </p>
                <p>
                  Losses against a human: {this.props.user.userInfo.losses_human}
                </p>
                <h3>
                  The rules are:
                </h3>
                <p>
                  The object of Connect 4 is to get four pieces in a row. This can be horizontally, vertically, or diagonally.
                </p>
                <p>
                  The game begins when the first player drops one checker in a column. They do this by clicking the column, and the checker will drop to the lowest unoccupied spot in that column. The second player then plays, and play alternates from there.
                </p>
                <p>
                  For strategy, the most valuable column is usually the middle column, since the most rows of four can be built from there.
                </p>
              </div>
            </Grid>
            <Grid item lg={5}>
              <div className="gameDiv">
                <h1>
                  Ready to Play?
                </h1>
                <Button variant="contained" className="butt">
                  Play against human
                </Button>
                <br />
                <Button variant="contained" className="butt">
                  Play against easy computer
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserHome);

