import React, {useContext} from "react";
import { GraphQlClient} from 'graphql-request';
import {GoogleLogin} from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
//import { ApolloClient } from 'apollo-client';
import Typography from "@material-ui/core/Typography";
import Context from '../../context';
import {ME_QUERY} from '../../graphql/queries';


const Login = ({ classes }) => {
  const {dispatch}=useContext(Context)

  const onSuccess = async googleUser => {
    try{

    const idToken=googleUser.getAuthResponse()
    .id_token;
    
    const client = new GraphQlClient('http://localhost:4000/graphql',{
      headers: {authorization: idToken}
    });
    
    const {me} = await client.request(ME_QUERY);
    console.log({me})
    dispatch({ type: "LOGIN_USER", payload:me })
  } catch (err){
     onFailure(err)
  }
  };
  const onFailure = err =>{
    console.log("error logging in", err);
  }

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
  clientId="932114674960-4kgu9autk9vcho6ghhgmns8ffe3uuu77.apps.googleusercontent.com"
  onSuccess={ onSuccess }
  onFailure={ onFailure }
  isSignedIn={ true }
  theme='dark'
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
