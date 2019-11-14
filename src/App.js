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
import Home from './pages/Home';
import SupervizorHome from './pages/SupervizorHome';
import UserHome from './pages/UserHome';
import AdminData from './pages/AdminData';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
        <Route
            path="/"
            exact={true}
            render={props => {
              return (
                <Home {...props} />
              );
            }}
            />
            <Route
            path="/admin"
            exact={true}
            render={props => {
              return (
                <AdminData {...props} />
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
            path="/login"
            exact={true}
            render={props => {
              return (
                <Login {...props} />
              );
            }}
          />
          
           <Route
            path="/user"
            exact={true}
            render={props => {
              return (
                <UserHome {...props} />
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
