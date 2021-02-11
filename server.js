const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require("./controllers/userController");

mongoose
.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useFindAndModify: false
 })
.then(()=> console.log('DB connected!'))
.catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization
      if (authToken) {
        // Find or create a User.
        currentUser = await findOrCreateUser(authToken)
      }
    } catch {
      console.error(`Unable to authenticate ${authToken}`)
    }
    return { currentUser }
  }
});
 
server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});