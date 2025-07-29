import { authResolvers } from './auth';
import { userResolvers } from './user';
import { workspaceResolvers } from './workspace';
import { boardResolvers } from './board';
import { itemResolvers } from './item';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';

export const resolvers = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...workspaceResolvers.Query,
    ...boardResolvers.Query,
    ...itemResolvers.Query,
  },
  
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...workspaceResolvers.Mutation,
    ...boardResolvers.Mutation,
    ...itemResolvers.Mutation,
  },
  
  Subscription: {
    ...boardResolvers.Subscription,
    ...itemResolvers.Subscription,
  },
  
  User: userResolvers.User,
  Workspace: workspaceResolvers.Workspace,
  Board: boardResolvers.Board,
  Item: itemResolvers.Item,
  Group: boardResolvers.Group,
  Column: boardResolvers.Column,
  ColumnValue: itemResolvers.ColumnValue,
};