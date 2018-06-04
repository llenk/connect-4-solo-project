import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UserHome from './components/UserHome/UserHome';
import GamePlay from './components/GamePlay/GamePlay';
import ResultPage from './components/ResultPage/ResultPage';

import './styles/main.css';

const App = () => (
  <div>
    {/* <Header title="Project Base" /> */}
    <Router>
      <Switch>
        <Route
          exact path="/"
          component={LoginPage}
        />
        <Route
          path="/register"
          component={RegisterPage}
        />
        <Route
          path="/home"
          component={UserHome}
        />
        <Route
          path="/game"
          component={GamePlay}
        />
        <Route 
          page="/result"
          component={ResultPage}
        />
        {/* OTHERWISE (no path!) */}
        <Route render={() => <h1>404</h1>} />

      </Switch>
    </Router>
  </div>
);

export default App;
