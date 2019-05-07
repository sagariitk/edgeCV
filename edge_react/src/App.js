import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LandingPage from './components/Landing';
import Login from './components/Login';
import Frames from './components/Frames';
import Error from './components/Error';


export default class App extends Component {
  render() {
    return (
        <div className="">
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/Frames" component={Frames} />
                <Route exact path="/Login" component={Login} />
                <Route component={Error} />
          </Switch>
          </BrowserRouter>
        </div>
    );
  }
}