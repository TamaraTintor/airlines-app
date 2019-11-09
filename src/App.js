/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
//import Home from './pages/Home';
import SupervizorHome from './pages/SupervizorHome';
import AdminHome from './pages/AdminHome';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
        <Route
            path="/admin"
            exact={true}
            render={props => {
              return (
                <AdminHome {...props} />
              );
            }}
          />
            <Route
            path="/supervizor"
            exact={true}
            render={props => {
              return (
                <SupervizorHome {...props} />
              );
            }}
          />
           <Route
            path="/"
            exact={true}
            render={props => {
              return (
                <Login {...props} />
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
