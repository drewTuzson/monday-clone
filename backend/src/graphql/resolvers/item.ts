import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const itemResolvers = {
  Query: {
    item: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const item = await prisma.item.findUnique({
        where: { id },
        include: { 
          board: true,
          group: true,
        },
      });

      if (!item) {
        throw new GraphQLError('Item not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check if user has access to item's board
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: item.board.workspaceId,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return item;
    },

    items: async (_: any, { boardId, groupId, limit = 50, offset = 0 }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check board access
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

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const where = {
        boardId,
        ...(groupId && { groupId }),
      };

      const items = await prisma.item.findMany({
        where,
        orderBy: { position: 'asc' },
        take: limit + 1,
        skip: offset,
      });

      const hasMore = items.length > limit;
      const returnItems = hasMore ? items.slice(0, -1) : items;

      const totalCount = await prisma.item.count({ where });

      return {
        items: returnItems,
        totalCount,
        hasMore,
      };
    },

    search: async (_: any, { query, workspaceId }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Get user's accessible workspaces
      const userWorkspaces = await prisma.userWorkspace.findMany({
        where: {
          userId: user.id,
          ...(workspaceId && { workspaceId }),
        },
        select: { workspaceId: true },
      });

      const accessibleWorkspaceIds = userWorkspaces.map(uw => uw.workspaceId);

      // Search boards
      const boards = await prisma.board.findMany({
        where: {
          workspaceId: { in: accessibleWorkspaceIds },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });

      // Search items
      const items = await prisma.item.findMany({
        where: {
          board: {
            workspaceId: { in: accessibleWorkspaceIds },
          },
          name: { contains: query, mode: 'insensitive' },
        },
        take: 20,
      });

      // Search users
      const users = workspaceId ? await prisma.user.findMany({
        where: {
          workspaces: {
            some: { workspaceId },
          },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      }) : [];

      return {
        boards,
        items,
        users,
        totalCount: boards.length + items.length + users.length,
      };
    },
  },

  Mutation: {
    createItem: async (_: any, { boardId, groupId, input }: any, { prisma, user }: Context) => {
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
      const lastItem = await prisma.item.findFirst({
        where: { groupId },
        orderBy: { position: 'desc' },
      });

      const position = input.position ?? (lastItem ? lastItem.position + 1 : 0);

      const item = await prisma.item.create({
        data: {
          boardId,
          groupId,
          name: input.name,
          position,
          createdById: user.id,
        },
      });

      // Create column values if provided
      if (input.columnValues && input.columnValues.length > 0) {
        await prisma.columnValue.createMany({
          data: input.columnValues.map((cv: any) => ({
            itemId: item.id,
            columnId: cv.columnId,
            value: cv.value,
            lastModifiedById: user.id,
          })),
        });
      }

      // Create activity
      await prisma.activity.create({
        data: {
          itemId: item.id,
          type: 'ITEM_CREATED',
          data: { userId: user.id },
        },
      });

      pubsub.publish('ITEM_CREATED', {
        itemCreated: item,
        boardId,
      });

      return item;
    },

    updateItem: async (_: any, { id, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const item = await prisma.item.findUnique({
        where: { id },
        include: { board: true },
      });

      if (!item) {
        throw new GraphQLError('Item not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check access
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: item.board.workspaceId,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role === 'VIEWER' || userWorkspace.role === 'GUEST') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updatedItem = await prisma.item.update({
        where: { id },
        data: input,
      });

      // Create activity
      await prisma.activity.create({
        data: {
          itemId: id,
          type: 'ITEM_UPDATED',
          data: { userId: user.id, changes: input },
        },
      });

      pubsub.publish('ITEM_UPDATED', {
        itemUpdated: updatedItem,
        boardId: item.boardId,
      });

      return updatedItem;
    },

    updateColumnValue: async (_: any, { itemId, columnId, value }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { board: true },
      });

      if (!item) {
        throw new GraphQLError('Item not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check access
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: item.board.workspaceId,
          },
        },
      });

      if (!userWorkspace || userWorkspace.role === 'VIEWER' || userWorkspace.role === 'GUEST') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const columnValue = await prisma.columnValue.upsert({
        where: {
          itemId_columnId: {
            itemId,
            columnId,
          },
        },
        update: {
          value,
          lastModifiedById: user.id,
        },
        create: {
          itemId,
          columnId,
          value,
          lastModifiedById: user.id,
        },
      });

      // Create activity
      await prisma.activity.create({
        data: {
          itemId,
          type: 'COLUMN_VALUE_UPDATED',
          data: { userId: user.id, columnId, value },
        },
      });

      pubsub.publish('COLUMN_VALUE_UPDATED', {
        columnValueUpdated: columnValue,
        boardId: item.boardId,
      });

      return columnValue;
    },

    createUpdate: async (_: any, { itemId, input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { board: true },
      });

      if (!item) {
        throw new GraphQLError('Item not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Check access
      const userWorkspace = await prisma.userWorkspace.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: item.board.workspaceId,
          },
        },
      });

      if (!userWorkspace) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const update = await prisma.update.create({
        data: {
          itemId,
          userId: user.id,
          body: input.body,
        },
      });

      // Handle mentions
      if (input.mentionUserIds && input.mentionUserIds.length > 0) {
        await prisma.mention.createMany({
          data: input.mentionUserIds.map((userId: string) => ({
            updateId: update.id,
            mentionedUserId: userId,
          })),
        });

        // Create notifications for mentioned users
        await prisma.notification.createMany({
          data: input.mentionUserIds.map((userId: string) => ({
            userId,
            type: 'MENTION',
            title: `${user.email} mentioned you`,
            body: `You were mentioned in an update on "${item.name}"`,
            data: { updateId: update.id, itemId: item.id },
          })),
        });
      }

      // Create activity
      await prisma.activity.create({
        data: {
          itemId,
          type: 'UPDATE_POSTED',
          data: { userId: user.id, updateId: update.id },
        },
      });

      pubsub.publish('UPDATE_CREATED', {
        updateCreated: update,
        itemId,
      });

      return update;
    },
  },

  Subscription: {
    itemCreated: {
      subscribe: (_: any, { boardId }: any) => pubsub.asyncIterator(['ITEM_CREATED']),
      resolve: (payload: any) => {
        if (payload.boardId === boardId) {
          return payload.itemCreated;
        }
        return null;
      },
    },

    itemUpdated: {
      subscribe: (_: any, { boardId }: any) => pubsub.asyncIterator(['ITEM_UPDATED']),
      resolve: (payload: any) => {
        if (payload.boardId === boardId) {
          return payload.itemUpdated;
        }
        return null;
      },
    },

    itemDeleted: {
      subscribe: (_: any, { boardId }: any) => pubsub.asyncIterator(['ITEM_DELETED']),
      resolve: (payload: any) => {
        if (payload.boardId === boardId) {
          return payload.itemId;
        }
        return null;
      },
    },

    columnValueUpdated: {
      subscribe: (_: any, { boardId }: any) => pubsub.asyncIterator(['COLUMN_VALUE_UPDATED']),
      resolve: (payload: any) => {
        if (payload.boardId === boardId) {
          return payload.columnValueUpdated;
        }
        return null;
      },
    },

    updateCreated: {
      subscribe: (_: any, { itemId }: any) => pubsub.asyncIterator(['UPDATE_CREATED']),
      resolve: (payload: any) => {
        if (payload.itemId === itemId) {
          return payload.updateCreated;
        }
        return null;
      },
    },
  },

  Item: {
    board: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.board.findUnique({
        where: { id: parent.boardId },
      });
    },

    group: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.group.findUnique({
        where: { id: parent.groupId },
      });
    },

    columnValues: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.columnValue.findMany({
        where: { itemId: parent.id },
      });
    },

    subitems: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.item.findMany({
        where: { parentItemId: parent.id },
        orderBy: { position: 'asc' },
      });
    },

    updates: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.update.findMany({
        where: { itemId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    activities: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.activity.findMany({
        where: { itemId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    createdBy: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.createdById },
      });
    },
  },

  ColumnValue: {
    item: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.item.findUnique({
        where: { id: parent.itemId },
      });
    },

    column: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.column.findUnique({
        where: { id: parent.columnId },
      });
    },

    lastModifiedBy: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.lastModifiedById },
      });
    },

    displayValue: async (parent: any, _: any, { prisma }: Context) => {
      const column = await prisma.column.findUnique({
        where: { id: parent.columnId },
      });

      if (!column) return '';

      // Format value based on column type
      switch (column.type) {
        case 'TEXT':
          return parent.value || '';
        case 'STATUS':
          const statusSettings = column.settings as any;
          const status = statusSettings?.labels?.find((l: any) => l.id === parent.value);
          return status?.value || '';
        case 'PERSON':
          if (Array.isArray(parent.value)) {
            const users = await prisma.user.findMany({
              where: { id: { in: parent.value } },
            });
            return users.map(u => u.name).join(', ');
          }
          return '';
        case 'DATE':
          return parent.value ? new Date(parent.value).toLocaleDateString() : '';
        default:
          return JSON.stringify(parent.value);
      }
    },
  },
};