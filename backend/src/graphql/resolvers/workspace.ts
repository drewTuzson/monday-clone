import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { z } from 'zod';

const CreateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional(),
});

const UpdateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  logoUrl: z.string().url().optional(),
  settings: z.any().optional(),
});

export const workspaceResolvers = {
  Query: {
    workspace: async (_: any, { id }: any, { prisma, user }: Context) => {
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
            workspaceId: id,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.workspace.findUnique({
        where: { id },
      });
    },

    workspaces: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const userWorkspaces = await prisma.userWorkspace.findMany({
        where: { userId: user.id },
        include: { workspace: true },
      });

      return userWorkspaces.map(uw => uw.workspace);
    },
  },

  Mutation: {
    createWorkspace: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const validated = CreateWorkspaceInputSchema.parse(input);

      // Check if slug is already taken
      const existingWorkspace = await prisma.workspace.findUnique({
        where: { slug: validated.slug },
      });

      if (existingWorkspace) {
        throw new GraphQLError('Workspace slug already exists', {
          extensions: { code: 'SLUG_EXISTS' },
        });
      }

      // Create workspace and add user as admin
      const workspace = await prisma.workspace.create({
        data: {
          ...validated,
          users: {
            create: {
              userId: user.id,
              role: 'ADMIN',
            },
          },
        },
      });

      return workspace;
    },

    updateWorkspace: async (_: any, { id, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const validated = UpdateWorkspaceInputSchema.parse(input);

      // Check if user is admin of workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: id,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role !== 'ADMIN') {
        throw new GraphQLError('Only admins can update workspace', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.workspace.update({
        where: { id },
        data: validated,
      });
    },

    deleteWorkspace: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user is admin of workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: id,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role !== 'ADMIN') {
        throw new GraphQLError('Only admins can delete workspace', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await prisma.workspace.delete({
        where: { id },
      });

      return true;
    },

    inviteToWorkspace: async (_: any, { workspaceId, email, role }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user is admin of workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId,
          },
        },
      });

      if (!userWorkspace || (userWorkspace.role !== 'ADMIN' && userWorkspace.role !== 'MEMBER')) {
        throw new GraphQLError('Insufficient permissions to invite users', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Find user by email
      const invitedUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!invitedUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      }

      // Check if user is already in workspace
      const existingMembership = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: invitedUser.id,
            workspaceId,
          },
        },
      });

      if (existingMembership) {
        throw new GraphQLError('User is already a member of this workspace', {
          extensions: { code: 'ALREADY_MEMBER' },
        });
      }

      // Add user to workspace
      await prisma.userWorkspace.create({
        data: {
          userId: invitedUser.id,
          workspaceId,
          role,
        },
      });

      // TODO: Send invitation email

      return true;
    },
  },

  Workspace: {
    users: async (parent: any, _: any, { prisma }: Context) => {
      const userWorkspaces = await prisma.userWorkspace.findMany({
        where: { workspaceId: parent.id },
        include: { user: true },
      });

      return userWorkspaces.map(uw => ({
        user: uw.user,
        role: uw.role,
        joinedAt: uw.joinedAt,
      }));
    },

    boards: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.board.findMany({
        where: { workspaceId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    settings: (parent: any) => {
      return parent.settings || {
        features: {},
        branding: {},
        limits: {},
      };
    },
  },
};