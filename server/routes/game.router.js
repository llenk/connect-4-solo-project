const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const emptyBoard = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
];

router.get('/human', (req, res) => {
  if (req.isAuthenticated) {
    let queryText = `SELECT * FROM "human_game"
            WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(queryText, [req.user.id]
    ).then(response => res.send({
      board: response.rows[0].position,
      turn: response.rows[0].turn,
      id: response.rows[0].id,
    })
    ).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(403);
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

router.put('/', (req, res) => {
  if (req.isAuthenticated) {
    let checkQueryText = `SELECT * FROM "human_game"
      WHERE "player_one" = $1 OR "player_two" = $1;`;
    pool.query(checkQueryText, [req.user.id]
    ).then(response => {
      if (response.rows[0].turn == req.user.id) {
        let board = response.rows[0].position;
        console.log(req.body);
        let col = board[req.body.col];
        console.log(col);
        let last = -1;
        for (let i = 0; i < col.length; i++) {
          if (col[i] == '') {
            last = i;
          }
        }
        last++;
        console.log(req.body.col, last)
        let token;
        if (last > 0) {
          if (response.rows[0].player_one == req.user.id) {
            token = 'x';
            let queryText = `UPDATE "human_game"
            SET "position"[$2][$3] = $4, "turn" = "human_game"."player_two"
            WHERE "player_one" = $1;`;
            let queryArray = [req.user.id, req.body.col + 1, last, token];
            console.log(queryArray);
            pool.query(queryText, queryArray
            ).then(response => {
              console.log(response);
              res.sendStatus(200);
            }).catch(error => {
              console.log(error, 111);
              res.sendStatus(500);
            });
          } else {
            token = 'o';
            let queryText = `UPDATE "human_game"
            SET "position"[$2][$3] = $4, "turn" = "human_game"."player_one"
            WHERE "player_two" = $1;`;
            pool.query(queryText, [req.user.id, req.body.col + 1, last, token]
            ).then(response => res.sendStatus(200)
            ).catch(error => {
              console.log(error, 122);
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
      console.log(error, 130);
      res.sendStatus(500);
    })
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;