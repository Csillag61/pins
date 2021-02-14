const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express')
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

mongoose
  .connect(process.env.MONGO_URI, {
    //useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'pins',     
  })
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.log(err))

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  cors: true,
  context: async ({ req }) => {
    let authToken=null;
    let currentUser=null;
    
    try {
      authToken = req.headers.authorization
      if (authToken) {
        // Find or create a User.
        currentUser = await findOrCreateUser(authToken)
      }
    } catch (err){
      console.warn(
        `Unable to authenticate using auth token: ${authToken}`,
        err
      );
    }
    return { authToken, currentUser };
  }
});
const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}
server.applyMiddleware({ app, cors: corsOptions })
app.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
