import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { InMemoryCache } from "apollo-cache-inmemory";

import Context from './context';
import reducer from './reducer';
import ProtectedRoute from './ProtectedRoute';

import App from './pages/App';
import Splash from './pages/Splash';

const wsLink = new WebSocketLink({
  uri:'wss://pinitall.herokuapp.com/graphql',
  options:{
    reconnect: true,
    
  }
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
})

/**
 * Using Context with Router.
 * @state Application state after the reducer has run.
 * @dispatch Dispatches actions that will change the state.
 */

const Root = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Router>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch }}>
          <Switch>
            <ProtectedRoute exact path="/" component={App} />
            <Route path="/login" component={Splash} />
          </Switch>
        </Context.Provider>
      </ApolloProvider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
