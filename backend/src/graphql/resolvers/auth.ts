import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiry } from '../../utils/auth';
import { z } from 'zod';

const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, { user, prisma }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return prisma.user.findUnique({
        where: { id: user.id },
      });
    },
  },

  Mutation: {
    register: async (_: any, { input }: any, { prisma }: Context) => {
      const validated = RegisterInputSchema.parse(input);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (existingUser) {
        throw new GraphQLError('User already exists with this email', {
          extensions: { code: 'USER_EXISTS' },
        });
      }

      // Hash password and create user
      const passwordHash = await hashPassword(validated.password);
      const user = await prisma.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          passwordHash,
        },
      });

      // Generate tokens
      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: getTokenExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        },
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    },

    login: async (_: any, args: any, { prisma }: Context) => {
      const validated = LoginSchema.parse(args);
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' },
        });
      }

      // Verify password
      const validPassword = await verifyPassword(validated.password, user.passwordHash);
      if (!validPassword) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'INVALID_CREDENTIALS' },
        });
      }

      // Generate tokens
      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: getTokenExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        },
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    },

    logout: async (_: any, __: any, { user, prisma }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Delete all sessions for the user
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      return true;
    },

    refreshToken: async (_: any, { refreshToken }: any, { prisma }: Context) => {
      // Verify refresh token
      const payload = await verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new GraphQLError('Invalid refresh token', {
          extensions: { code: 'INVALID_TOKEN' },
        });
      }

      // Check if session exists
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new GraphQLError('Session expired', {
          extensions: { code: 'SESSION_EXPIRED' },
        });
      }

      // Delete old session
      await prisma.session.delete({
        where: { id: session.id },
      });

      // Generate new tokens
      const tokenPayload = { userId: session.user.id, email: session.user.email };
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Create new session
      await prisma.session.create({
        data: {
          userId: session.user.id,
          refreshToken: newRefreshToken,
          expiresAt: getTokenExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
        },
      });

      return {
        user: session.user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    },
  },
};