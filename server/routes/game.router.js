const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

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
          console.log(error, 109);
        });
      }).catch(error => {
        console.log(error, 112);
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
              (position, player_one, turn)
              VALUES ($1, $2, $3);`;
            pool.query(addQueryText, [emptyBoard, req.user.id, req.user.id]
            ).then(response => {
              res.sendStatus(200);
            }).catch(error => {
              console.log(error);
              res.sendStatus(500);
            });
          } else {
            addQueryText = `UPDATE "human_game" 
              SET "player_two"=$2 
              WHERE "id"=$1;`;
            pool.query(addQueryText, [responseTwo.rows[0].id, req.user.id]
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

module.exports = router;

// testing data:
// {{"","","","","",o},{"","","",x,x,x},{"","","",o,o,o},{"","","","",x,x},{"","","","",o,x},{"","","",o,x,o},{"","","","",o,x}}