// Import ApolloServer from apollo-server package to set up the GraphQL server
const { ApolloServer } = require("apollo-server"); 

// Import schema from the schema.graphql file
const { importSchema } = require("graphql-import");
const typeDefs = importSchema("./schema.graphql");

// Import the custom EtherDataSource class 
const EtherDataSource = require("./datasource/ethDatasource");

// Load environment variables from .env file
require("dotenv").config(); 

// Define resolvers that call data source methods
const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) => 
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance, passing typeDefs, resolvers 
// and custom data source
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), 
  }),
});

// Start the server on port 9000
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});