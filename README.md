# Connect 4
This app allows the user to log in, play Connect 4 against the computer, or play against another human logged in on another account. It also saves the user's win/loss stats, and displays them on the landing page. 

## Built With
React
Redux
Redux Sagas
Node.js
PostgreSQL
Passport
Express
Material-UI

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Installing

Create a new database called `connect_4` and create a `person` table:

```SQL
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    username VARCHAR (80) UNIQUE NOT NULL,
    password VARCHAR (1000) NOT NULL,
    wins_human INTEGER DEFAULT 0,
    losses_human INTEGER DEFAULT 0,
    wins_easy_computer INTEGER DEFAULT 0,
    losses_easy_computer INTEGER DEFAULT 0
);
CREATE TABLE human_game (
    id SERIAL PRIMARY KEY, 
    position VARCHAR (2)[],
    player_one INTEGER REFERENCES person(id),
    player_two INTEGER REFERENCES person(id),
    turn INTEGER REFERENCES person(id),
    won VARCHAR (10) DEFAULT ''
);
CREATE TABLE computer_game (
    id SERIAL PRIMARY KEY, 
    position VARCHAR (2)[],
    player_one INTEGER REFERENCES person(id),
    turn BOOLEAN DEFAULT true,
    won VARCHAR (10) DEFAULT '',
    hard BOOLEAN DEFAULT false,
    position_string VARCHAR (42) DEFAULT ''
);
```
## Screen Shots

## Documentation

### Completed Features

- [x] Landing page with stats and redirect to new game
- [x] Play against another human
- [x] Play against a computer that randomly places tokens

### Next Steps

- [ ] Properly connect python script that solves game to place winning tokens

## Deployment

1. Create a new Heroku project
1. Link the Heroku project to the project GitHub Repo
1. Create an Herkoku Postgres database
1. Connect to the Heroku Postgres database from Postico
1. Create the necessary tables
1. Add an environment variable for `SERVER_SESSION_SECRET` with a nice random string for security
1. In the deploy section, select manual deploy
