import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { z } from 'zod';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const CreateBoardInputSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['MAIN', 'PRIVATE', 'SHAREABLE']),
  templateId: z.string().optional(),
});

export const boardResolvers = {
  Query: {
    board: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const board = await prisma.board.findUnique({
        where: { id },
        include: { workspace: true },
      });

      if (!board) {
        throw new GraphQLError('Board not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check if user has access to board's workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: board.workspaceId,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return board;
    },

    boards: async (_: any, { workspaceId }: any, { prisma, user }: Context) => {
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

      return prisma.board.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    createBoard: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const validated = CreateBoardInputSchema.parse(input);

      // Check if user has access to workspace
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: validated.workspaceId,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Create board with default columns and groups
      const board = await prisma.board.create({
        data: {
          ...validated,
          createdById: user.id,
          columns: {
            create: [
              { title: 'Name', type: 'TEXT', position: 0, width: 200 },
              { title: 'Status', type: 'STATUS', position: 1, width: 150, settings: {
                labels: [
                  { id: '1', value: 'To Do', color: '#e2445c' },
                  { id: '2', value: 'In Progress', color: '#fdab3d' },
                  { id: '3', value: 'Done', color: '#00c875' },
                ]
              }},
              { title: 'Person', type: 'PERSON', position: 2, width: 150 },
              { title: 'Date', type: 'DATE', position: 3, width: 150 },
            ],
          },
          groups: {
            create: [
              { title: 'New Group', color: '#579bfc', position: 0 },
            ],
          },
          views: {
            create: [
              { name: 'Main Table', type: 'TABLE', isDefault: true },
            ],
          },
        },
      });

      return board;
    },

    updateBoard: async (_: any, { id, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check access
      const board = await prisma.board.findUnique({
        where: { id },
        include: { workspace: true },
      });

      if (!board) {
        throw new GraphQLError('Board not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: board.workspaceId,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role === 'VIEWER' || userWorkspace.role === 'GUEST') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updatedBoard = await prisma.board.update({
        where: { id },
        data: input,
      });

      pubsub.publish('BOARD_UPDATED', {
        boardUpdated: updatedBoard,
      });

      return updatedBoard;
    },

    createColumn: async (_: any, { boardId, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check access
      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        throw new GraphQLError('Board not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: board.workspaceId,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role === 'VIEWER' || userWorkspace.role === 'GUEST') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Get max position
      const lastColumn = await prisma.column.findFirst({
        where: { boardId },
        orderBy: { position: 'desc' },
      });

      const position = input.position ?? (lastColumn ? lastColumn.position + 1 : 0);

      return prisma.column.create({
        data: {
          boardId,
          ...input,
          position,
        },
      });
    },

    createGroup: async (_: any, { boardId, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check access (similar to createColumn)
      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        throw new GraphQLError('Board not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: board.workspaceId,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role === 'VIEWER' || userWorkspace.role === 'GUEST') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Get max position
      const lastGroup = await prisma.group.findFirst({
        where: { boardId },
        orderBy: { position: 'desc' },
      });

      const position = input.position ?? (lastGroup ? lastGroup.position + 1 : 0);

      return prisma.group.create({
        data: {
          boardId,
          ...input,
          position,
        },
      });
    },
  },

  Subscription: {
    boardUpdated: {
      subscribe: (_: any, { boardId }: any) => pubsub.asyncIterator(['BOARD_UPDATED']),
      resolve: (payload: any) => payload.boardUpdated,
    },
  },

  Board: {
    workspace: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.workspace.findUnique({
        where: { id: parent.workspaceId },
      });
    },

    columns: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.column.findMany({
        where: { boardId: parent.id },
        orderBy: { position: 'asc' },
      });
    },

    groups: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.group.findMany({
        where: { boardId: parent.id },
        orderBy: { position: 'asc' },
      });
    },

    views: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.view.findMany({
        where: { boardId: parent.id },
      });
    },

    automations: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.automation.findMany({
        where: { boardId: parent.id },
      });
    },

    createdBy: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.createdById },
      });
    },

    settings: (parent: any) => {
      return parent.settings || {
        defaultView: 'TABLE',
        itemDefaults: {},
        notifications: {},
      };
    },

    permissions: async (parent: any, _: any, { prisma, user }: Context) => {
      if (!user) return {
        canEdit: false,
        canDelete: false,
        canShare: false,
        canManageAutomations: false,
      };

      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: parent.workspaceId,
          },
        },
      });

      if (!userWorkspace) return {
        canEdit: false,
        canDelete: false,
        canShare: false,
        canManageAutomations: false,
      };

      const isAdmin = userWorkspace.role === 'ADMIN';
      const isMember = userWorkspace.role === 'MEMBER';

      return {
        canEdit: isAdmin || isMember,
        canDelete: isAdmin,
        canShare: isAdmin || isMember,
        canManageAutomations: isAdmin || isMember,
      };
    },
  },

  Group: {
    board: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.board.findUnique({
        where: { id: parent.boardId },
      });
    },

    items: async (parent: any, { limit = 50, offset = 0 }: any, { prisma }: Context) => {
      const items = await prisma.item.findMany({
        where: { groupId: parent.id },
        orderBy: { position: 'asc' },
        take: limit + 1,
        skip: offset,
      });

      const hasMore = items.length > limit;
      const returnItems = hasMore ? items.slice(0, -1) : items;

      const totalCount = await prisma.item.count({
        where: { groupId: parent.id },
      });

      return {
        items: returnItems,
        totalCount,
        hasMore,
      };
    },
  },

  Column: {
    board: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.board.findUnique({
        where: { id: parent.boardId },
      });
    },
  },
};