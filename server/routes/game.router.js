const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const emptyBoard = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
];

router.get('/', (req, res) => {

});

router.post('/start/human', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user);
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

router.post('/', (req, res) => {

});

module.exports = router;