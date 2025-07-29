import { GraphQLError } from 'graphql';
import { Context } from '../context';

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return prisma.user.findUnique({
        where: { id },
      });
    },

    users: async (_: any, { workspaceId }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user has access to workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const userWorkspaces = await prisma.userWorkspace.findMany({
        where: { workspaceId },
        include: { user: true },
      });

      return userWorkspaces.map(uw => uw.user);
    },
  },

  Mutation: {
    updateProfile: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return prisma.user.update({
        where: { id: user.id },
        data: input,
      });
    },
  },

  User: {
    workspaces: async (parent: any, _: any, { prisma }: Context) => {
      const userWorkspaces = await prisma.userWorkspace.findMany({
        where: { userId: parent.id },
        include: { workspace: true },
      });

      return userWorkspaces.map(uw => uw.workspace);
    },
  },
};