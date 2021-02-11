import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Context from '../../context';

import { ME_QUERY } from '../../graphql/queries.js';
import {
  LOGIN_USER, IS_LOGGED_IN
} from '../../actions';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: LOGIN_USER, payload: me });
      dispatch({ type: IS_LOGGED_IN, payload: googleUser.isSignedIn() });
    } catch (err) {
      onFailure();
      dispatch({ type: IS_LOGGED_IN, payload: false });
    }
  };
  const onFailure = err => {
    console.error('Error logging in ', err);
  };

  return (
    <div className={ classes.root}>
    <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
    >
    Welcome
    
    </Typography>

  <GoogleLogin 
  clientId="68551619717-11oo6u2adrbc5kv53ca77f3c4bqsrn8d.apps.googleusercontent.com"
  onSuccess={ onSuccess }
  onFailure={ onFailure }
  isSignedIn={ true }
  buttonText="Login with Google"
  theme='dark'
  cookiePolicy={"single_host_origin"}
  />
  </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
