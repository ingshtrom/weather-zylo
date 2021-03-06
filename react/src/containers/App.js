import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from '../store'

import Home from './Home';

import Header from '../components/Header';
import Footer from '../components/Footer';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header />

            <main role='main' className='container'>
              <Route exact path='/' component={Home} />
            </main>

            <Footer />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
