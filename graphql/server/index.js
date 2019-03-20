"use strict";
const { ApolloServer, gql } = require('apollo-server-express'),
  DataLoader = require('dataloader'),
  { Author: AuthorController } = require('../../controllers'),
  resolvers = require('../resolvers');
/**
 * import RootQuery
 */
const { Query } = require("../types");

const SchemaDefinition = gql`
  schema {
    query: Query
  }
`;
/**
 * data loader initializing
 */
const loaders = {
  author: new DataLoader(AuthorController().findAuthor)
};

const Server = new ApolloServer({
  typeDefs: [SchemaDefinition, Query],
  resolvers,
  context: ({req,res}) => {
    const UUID = res._headers['x-request-id'];
    return {
      loaders,
      UUID
    }
  },
  formatError: e => {
    global.logger.warn(`UUID=${e.extensions.exception.UUID},Error=${e.message},Stacktrace=${e.extensions.exception.stacktrace}`);
    e.extensions.exception = undefined // remove stacktrace
    return e;
  },
});

module.exports = Server;
