import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

import { Grid, Button } from '@material-ui/core';
import './UserHome.css';

const mapStateToProps = state => ({
  user: state.user,
  game: state.game,
});

class UserHome extends Component {

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({type: 'SET_ERROR', payload: ''});
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.humanGameState.position) {
      this.props.history.push('/human-game');
    }
    if (nextProps.game.computerGameState.position) {
      this.props.history.push('/computer-game');
    }
  }

  logout = () => {
    this.props.dispatch(triggerLogout());
    this.props.history.push('');
  }

  humanGame = () => {
    this.props.dispatch({type: 'HUMAN_GAME_START', payload: this.props.user.userInfo.id});
  }

  computerGame = () => {
    this.props.dispatch({type: 'COMPUTER_GAME_START', payload: this.props.user.userInfo.id});
  }

  render() {
    let content = null;
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
            <Grid item xs={12} lg={7}>
              <div className="welcomeDiv">
                <h1>
                  Welcome to Connect 4, {this.props.user.userInfo.username}!
                </h1>
                <h2>
                  Your stats are:
                </h2>
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
                <h2>
                  The rules are:
                </h2>
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
            <Grid item xs={12} lg={5}>
              <div className="gameDiv">
                <h1>
                  Ready to Play?
                </h1>
                <h3>
                  {this.props.game.errorMessageLoad}
                </h3>
                <Button variant="contained" className="butt" onClick={this.humanGame}>
                  Play against human
                </Button>
                <br />
                <Button variant="contained" className="butt" onClick={this.computerGame}>
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

export default connect(mapStateToProps)(UserHome);

