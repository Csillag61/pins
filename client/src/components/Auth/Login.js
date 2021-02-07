import React from "react";
import { GraphQlClient} from 'graphql-request';
import {GoogleLogin} from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {

  const onSuccess = async googleUser => {
    const idToken=googleUser.getAuthResponse()
    .id_token;
    const client = new GraphQlClient('http://localhost:4000/graphql',{
      headers: {authorization: idToken}
    });
    const data = await client.request(ME_QUERY);
    console.log({data})
  };

  return <GoogleLogin 
  clientId="932114674960-4kgu9autk9vcho6ghhgmns8ffe3uuu77.apps.googleusercontent.com"
  onSuccess={onSuccess}
  isSignedIn={true}
  />;
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
