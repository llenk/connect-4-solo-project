import React from 'react';
import { Link } from 'react-router-dom';

import './RulesSide.css';

const Nav = () => (
    <div className="rules">
        <h1>Welcome to Connect 4!</h1>
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
);

export default Nav;
