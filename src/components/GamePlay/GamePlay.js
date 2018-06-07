import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

import { Grid, Button } from '@material-ui/core';
import './GamePlay.css';

const mapStateToProps = state => ({
  user: state.user,
  game: state.game,
});

class GamePlay extends Component {
  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: 'GET_BOARD' });
    this.props.dispatch({type: 'SET_LOAD_ERROR', payload: ''});
    this.props.dispatch({type: 'SET_GAME_ERROR', payload: ''});
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('');
    }
    if (this.props.user.userInfo) {
      setTimeout(() => {
        this.props.dispatch({ type: 'GET_BOARD' });
      }, 5000);
    }
  }

  logout = () => {
    this.props.dispatch(triggerLogout());
    this.props.history.push('');
  }

  cellToPic = (cell, j) => {
    if (cell === 'x') {
      return (
        <div>
          <img src="/images/holder.png" alt="empty" />
          <img src="/images/player_one.png" alt="player one" />
        </div>
      )
    } else if (cell === 'o') {
      return (
        <div>
          <img src="/images/holder.png" alt="empty" />
          <img src="/images/player_two.png" alt="player two" />
        </div>
      )
    } else {
      return (
        <div>
          <img src="/images/holder.png" alt="empty" />
        </div>
      )
    }
  }

  checkTurn = (turn) => {
    if (turn === this.props.user.userInfo.id) {
      return "It's your turn!!";
    } else {
      return "Not your turn.";
    }
  }

  placeToken = (col) => (event) => {
    const action = {type: 'PLACE_TOKEN', payload: {col: col}};
    this.props.dispatch(action);
  }

  render() {
    let content = null;
    if (this.props.user.userInfo && this.props.game.gameState.board) {
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
            <Grid item xs={12} md={7}>
              <div className="board">
                {this.props.game.gameState.board.map((row, i) => {
                  return (
                    <div key={i} onClick={this.placeToken(i)}>
                      {row.map((cell, j) => {
                        return (
                          <div key={j} className="cell">
                            {this.cellToPic(cell, j)}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="turn">
                <h2>
                  {this.checkTurn(this.props.game.gameState.turn)}
                </h2>
                <h3>
                  {this.props.game.errorMessageGame}
                </h3>
              </div>
            </Grid>
          </Grid>
        </div >
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default connect(mapStateToProps)(GamePlay);

