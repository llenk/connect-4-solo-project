const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const pickMove = require('../modules/solver');

const computerID = process.env.COMPUTER_ID;

// each array is one column, not one row
const emptyBoard = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
];

const checkWonHuman = (board) => {
  let position = board.position;
  // check for rows inside each column
  for (let i = 0; i < position.length; i++) {
    for (let j = 0; j < position[i].length - 3; j++) {
      let token = position[i][j];
      if (position[i][j + 1] == token && position[i][j + 2] == token && position[i][j + 3] == token) {
        if (token == 'x') {
          return 'one';
        }
        else if (token == 'o') {
          return 'two';
        }
      }
    }
  }
  // check for rows in each row
  for (let i = 0; i < position.length - 3; i++) {
    for (let j = 0; j < position[i].length; j++) {
      let token = position[i][j];
      if (position[i + 1][j] == token && position[i + 2][j] == token && position[i + 3][j] == token) {
        if (token == 'x') {
          return 'one';
        }
        else if (token == 'o') {
          return 'two';
        }
      }
    }
  }
  // check for rows in diagonals going down/right
  for (let i = 0; i < position.length - 3; i++) {
    for (let j = 0; j < position[i].length - 3; j++) {
      let token = position[i][j];
      if (position[i + 1][j + 1] == token && position[i + 2][j + 2] == token && position[i + 3][j + 3] == token) {
        if (token == 'x') {
          return 'one';
        }
        else if (token == 'o') {
          return 'two';
        }
      }
    }
  }
  // check for rows in diagonals going down/left
  for (let i = 3; i < position.length; i++) {
    for (let j = 0; j < position[i].length - 3; j++) {
      let token = position[i][j];
      if (position[i - 1][j + 1] == token && position[i - 2][j + 2] == token && position[i - 3][j + 3] == token) {
        if (token == 'x') {
          return 'one';
        }
        else if (token == 'o') {
          return 'two';
        }
      }
    }
  }
  // check if draw
  let draw = true;
  for (let i = 0; i < position.length; i++) {
    for (let j = 0; j < position[i].length; j++) {
      if (position[i][j] == '') {
        draw = false;
      }
    }
  }
  if (draw) {
    return 'draw';
  }
  return '';
}

const setWonHuman = (id, val, board) => {
  // id is the id of the game
  // val is the value returned by checkWonHuman
  // board is the row from SQL, not just the position
  if (val == 'one') {
    let queryText = `UPDATE "human_game"
    SET "won" = $2, "turn" = $3
    WHERE "id" = $1;`;
    pool.query(queryText, [id, val, computerID]
    ).then(response => {
      let checkWinnerQueryText = `SELECT * FROM "person"
        WHERE "id" = $1;`;
      pool.query(checkWinnerQueryText, [board['player_' + val]]
      ).then(winnerResponse => {
        let updateWinnerQueryText = `UPDATE "person"
          SET "wins_human" = $1
          WHERE "id" = $2;`;
        console.log(winnerResponse);
        pool.query(updateWinnerQueryText, [winnerResponse.rows[0].wins_human + 1, winnerResponse.rows[0].id]
        ).then(response => {
          console.log('Set winner');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
      let checkLoserQueryText = `SELECT * FROM "person"
        WHERE "id" = $1;`;
      pool.query(checkLoserQueryText, [board['player_two']]
      ).then(loserResponse => {
        let updateLoserQueryText = `UPDATE "person"
          SET "losses_human" = $1
          WHERE "id" = $2;`;
        pool.query(updateLoserQueryText, [loserResponse.rows[0].losses_human + 1, loserResponse.rows[0].id]
        ).then(response => {
          console.log('Set loser');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }
  else if (val == 'two') {
    let queryText = `UPDATE "human_game"
    SET "won" = $2, "turn" = $3
    WHERE "id" = $1;`;
    pool.query(queryText, [id, val, computerID]
    ).then(response => {
      let checkWinnerQueryText = `SELECT * FROM "person"
        WHERE "id" = $1;`;
      pool.query(checkWinnerQueryText, [board['player_' + val]]
      ).then(winnerResponse => {
        let updateWinnerQueryText = `UPDATE "person"
          SET "wins_human" = $1
          WHERE "id" = $2;`;
        pool.query(updateWinnerQueryText, [winnerResponse.rows[0].wins_human + 1, winnerResponse.rows[0].id]
        ).then(response => {
          console.log('Set winner');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
      let checkLoserQueryText = `SELECT * FROM "person"
        WHERE "id" = $1;`;
      pool.query(checkLoserQueryText, [board['player_one']]
      ).then(loserResponse => {
        let updateLoserQueryText = `UPDATE "person"
          SET "losses_human" = $1
          WHERE "id" = $2;`;
        pool.query(updateLoserQueryText, [loserResponse.rows[0].losses_human + 1, loserResponse.rows[0].id]
        ).then(response => {
          console.log('Set loser');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }
  else if (val == 'draw') {
    let queryText = `UPDATE "human_game"
      SET "won" = $2
      WHERE "id" = $1;`;
    pool.query(queryText, [id, val]
    ).then(response => {
    }).catch(error => {
      console.log(error);
    });
  }
}

const availableColumns = (board) => {
  let cols = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i][0] === '') {
      cols.push(i);
    }
  }
  return cols;
}

router.get('/human', (req, res) => {
  if (req.isAuthenticated) {
    let queryText = `SELECT * FROM "human_game"
      WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(queryText, [req.user.id]
    ).then(response => res.send(response.rows[0])
    ).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
  }
});

router.delete('/human', (req, res) => {
  if (req.isAuthenticated()) {
    let checkQueryText = `SELECT * FROM "human_game"
      WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(checkQueryText, [req.user.id]
    ).then(checkResponse => {
      let player, otherPlayer;
      if (checkResponse.rows[0].player_one == req.user.id) {
        player = 'one';
        otherPlayer = 'two';
      } else {
        player = 'two';
        otherPlayer = 'one';
      }
      // if the other player is the computer, the game can be deleted
      if (checkResponse.rows[0]['player_' + otherPlayer] == computerID) {
        let deleteQueryText = `DELETE FROM "human_game" WHERE "id"=$1;`;
        pool.query(deleteQueryText, [checkResponse.rows[0].id]
        ).then(response => {
          res.sendStatus(200);
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      }
      // otherwise, the other player may still want to look at the game
      // so it cannot be deleted
      // but the player id should be changed to computer
      else {
        let updateQueryText = `UPDATE "human_game" 
          SET "player_${player}"=$2 
          WHERE "id"=$1;`;
        pool.query(updateQueryText, [checkResponse.rows[0].id, computerID]
        ).then(response => {
          res.sendStatus(200);
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
  }
  else {
    res.sendStatus(404);
  }
});

router.post('/start/human', (req, res) => {
  if (req.isAuthenticated()) {
    let checkQueryText = `SELECT * FROM "human_game"
      WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(checkQueryText, [req.user.id]
    ).then(responseOne => {
      if (responseOne.rows.length == 0) {
        let queryText = `SELECT * FROM "human_game" 
          WHERE "player_two" IS NULL;`;
        let addQueryText;
        pool.query(queryText
        ).then(responseTwo => {
          if (responseTwo.rows.length == 0) {
            addQueryText = `INSERT INTO "human_game"
              (position, player_one)
              VALUES ($1, $2);`;
            pool.query(addQueryText, [emptyBoard, req.user.id]
            ).then(response => {
              res.sendStatus(200);
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          } else {
            addQueryText = `UPDATE "human_game" 
              SET "player_two"=$2, "turn" = $3 
              WHERE "id"=$1;`;
            pool.query(addQueryText, [responseTwo.rows[0].id, req.user.id, responseTwo.rows[0].player_one]
            ).then(response => {
              res.sendStatus(200);
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          }
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      }
      else {
        res.sendStatus(409);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
  }
});

router.put('/human', (req, res) => {
  if (req.isAuthenticated) {
    let checkQueryText = `SELECT * FROM "human_game"
      WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(checkQueryText, [req.user.id]
    ).then(response => {
      if (response.rows[0].turn == req.user.id) {
        let board = response.rows[0].position;
        let col = board[req.body.col];
        let last = -1;
        for (let i = 0; i < col.length; i++) {
          if (col[i] == '') {
            last = i;
          }
        }
        last++;
        let token;
        if (last > 0) {
          if (response.rows[0].player_one == req.user.id) {
            token = 'x';
            let queryText = `UPDATE "human_game"
            SET "position"[$2][$3] = $4, "turn" = "human_game"."player_two"
            WHERE "player_one" = $1;`;
            let queryArray = [req.user.id, req.body.col + 1, last, token];
            pool.query(queryText, queryArray
            ).then(responsePrime => {
              let queryText = `SELECT * FROM "human_game"
                WHERE "id" = $1`;
              pool.query(queryText, [response.rows[0].id]
              ).then(response => {
                let board = response.rows[0];
                setWonHuman(board.id, checkWonHuman(board), board);
                res.sendStatus(200);
              }).catch(error => {
                console.log(error);
                res.sendStatus(500);
              });
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          } else {
            token = 'o';
            let queryText = `UPDATE "human_game"
            SET "position"[$2][$3] = $4, "turn" = "human_game"."player_one"
            WHERE "player_two" = $1;`;
            pool.query(queryText, [req.user.id, req.body.col + 1, last, token]
            ).then(responsePrime => {
              let queryText = `SELECT * FROM "human_game"
                WHERE "id" = $1`;
              pool.query(queryText, [response.rows[0].id]
              ).then(response => {
                let board = response.rows[0];
                setWonHuman(board.id, checkWonHuman(board), board);
                res.sendStatus(200);
              }).catch(error => {
                console.log(error);
                res.sendStatus(500);
              });
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          }
        } else {
          res.sendStatus(409);
        }
      } else {
        res.sendStatus(403);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
  } else {
    res.sendStatus(403);
  }
});

router.post('/computer', (req, res) => {
  if (req.isAuthenticated) {
    let checkQueryText = `SELECT * FROM "computer_game"
      WHERE "player_one" = $1;`;
    pool.query(checkQueryText, [req.user.id]
    ).then(response => {
      if (response.rowCount == 0) {
        let addQueryText, addQueryArray;
        if (req.body.type == 'hard') {
          addQueryText = `INSERT INTO "computer_game" 
            ("position", "player_one", "hard")
            VALUES ($1, $2, $3);`;
          addQueryArray = [emptyBoard, req.user.id, true];
        }
        else {
          addQueryText = `INSERT INTO "computer_game" 
            ("position", "player_one")
            VALUES ($1, $2);`;
          addQueryArray = [emptyBoard, req.user.id];
        }
        console.log(addQueryText, addQueryArray);
        pool.query(addQueryText, addQueryArray
        ).then(response => {
          res.sendStatus(200);
        }).catch(error => {
          res.sendStatus(500);
        })
      } else {
        res.sendStatus(409);
      }
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
  }
});

router.get('/computer', (req, res) => {
  if (req.isAuthenticated) {
    let queryText = `SELECT * FROM "computer_game"
      WHERE "player_one" = $1;`;
    pool.query(queryText, [req.user.id]
    ).then(response => res.send(response.rows[0])
    ).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
  }
});

router.put('/computer', async function (req, res) {
  if (req.isAuthenticated) {
    let checkQueryText = `SELECT * FROM "computer_game"
      WHERE "player_one" = $1;`;
    let checkResponse = await pool.query(checkQueryText, [req.user.id]);
    // info is the whole row in SQL
    // board is just the position
    let info = checkResponse.rows[0];
    console.log(info);
    let board = info.position;
    let col = board[req.body.col];
    let last = -1;
    for (let i = 0; i < col.length; i++) {
      if (col[i] == '') {
        last = i;
      }
    }
    // last is the zero-based index of the bottom empty spot
    // it is -1 if the column is full
    if (info.turn && last >= 0 && info.won.length == 0) {
      board[req.body.col][last] = 'x';
      info.position_string += (req.body.col);
      console.log('placing human token:', req.body.col, last);
      let updateQueryText = `UPDATE "computer_game"
        SET "position" = $2, "turn" = $3, "position_string" = $4
        WHERE "player_one" = $1;`;
      await pool.query(updateQueryText, [req.user.id, board, false, info.position_string]);
      let result = checkWonHuman({ position: board });
      console.log(result);
      if (result == 'one') {
        // game is over, human won
        let gameQueryText = `UPDATE "computer_game"
          SET "won" = $2, "turn" = $3
          WHERE "id" = $1;`;
        if (info.hard) {
          let personQueryText = `UPDATE "person"
          SET "wins_hard_computer" = "wins_hard_computer" + 1
          WHERE "id" = $1;`;
        }
        else {
          let personQueryText = `UPDATE "person"
            SET "wins_easy_computer" = "wins_easy_computer" + 1
            WHERE "id" = $1;`;
        }
        pool.query(gameQueryText, [info.id, 'won', false]
        ).then(response => {
          pool.query(personQueryText, [info.player_one]
          ).then(response => {
            res.sendStatus(200);
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      }
      else if (result == 'draw') {
        // game is over, human didn't win
        let gameQueryText = `UPDATE "computer_game"
          SET "won" = $2, "turn" = $3
          WHERE "id" = $1;`;
        pool.query(gameQueryText, [info.id, 'draw', false]
        ).then(response => {
          res.sendStatus(200);
        }).catch(error => {
          console.log(error);
          res.sendStatus(500);
        });
      }
      else {
        // game is not over 
        if (info.hard) {
          let chosenColumn = await pickMove(info.position);
          console.log('noooooo');
          console.log(chosenColumn);
        }
        else {
          let availableCols = availableColumns(board);
          let chosenColumn = availableCols[Math.floor(Math.random() * availableCols.length)];
        }
        col = board[chosenColumn];
        let last = -1;
        for (let i = 0; i < col.length; i++) {
          if (col[i] == '') {
            last = i;
          }
        }

        console.log('placing computer token:', chosenColumn, last);
        board[chosenColumn][last] = 'o';
        info.position_string += (chosenColumn);
        await pool.query(updateQueryText, [req.user.id, board, true, info.position_string]);
        let result = checkWonHuman({ position: board });
        if (result == 'two') {
          // computer won, game is over
          let gameQueryText = `UPDATE "computer_game"
              SET "won" = $2, "turn" = $3
              WHERE "id" = $1;`;
          if (info.hard) {
            let personQueryText = `UPDATE "person"
              SET "losses_hard_computer" = "losses_hard_computer" + 1
              WHERE "id" = $1;`;
          }
          else {
            let personQueryText = `UPDATE "person"
              SET "losses_easy_computer" = "losses_easy_computer" + 1
              WHERE "id" = $1;`;
          }
          pool.query(gameQueryText, [info.id, 'lost', false]
          ).then(function (response) {
            pool.query(personQueryText, [info.player_one]
            ).then(response => {
              res.sendStatus(200);
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        }
        else if (result == 'draw') {
          // drew, game over
          let gameQueryText = `UPDATE "computer_game"
          SET "won" = $2, "turn" = $3
          WHERE "id" = $1;`;
          pool.query(gameQueryText, [info.id, 'draw', false]
          ).then(response => {
            res.sendStatus(200);
          }).catch(error => {
            console.log(error);
            res.sendStatus(500);
          });
        }
        else {
          // no one won, keep playing!
          res.sendStatus(200);
        }
      }
    }
    else {
      res.sendStatus(409);
    }
  }
  else {
    res.sendStatus(403);
  }
});

router.delete('/computer', (req, res) => {
  if (req.isAuthenticated) {
    let queryText = `DELETE FROM "computer_game" WHERE "player_one"=$1;`;
    pool.query(queryText, [req.user.id]
    ).then(response => {
      res.sendStatus(200);
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  }
});

module.exports = router;
