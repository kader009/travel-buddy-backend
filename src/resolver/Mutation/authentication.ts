import { UserCreate, LoginInput } from '../../types/userInterface';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtHelper';
import { Context } from '../../types/context';
import { getErrorMessage } from '../../utils/errorHelper';

export const authResolver = {
  signup: async (parent: unknown, args: UserCreate, { prisma }: Context) => {
    try {
      if (!args.name || args.name.trim().length < 2) {
        return {
          userError: 'Name must be at least 2 characters',
          token: null,
          user: null,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(args.email)) {
        return { userError: 'Invalid email format', token: null, user: null };
      }

      if (args.password.length < 6) {
        return {
          userError: 'Password must be at least 6 characters',
          token: null,
          user: null,
        };
      }

      const isExist = await prisma.user.findFirst({
        where: { email: args.email },
      });

      if (isExist) {
        return { userError: 'User already exists', token: null, user: null };
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      const token = generateToken(newUser.id);
      return { userError: null, token, user: newUser };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), token: null, user: null };
    }
  },

  login: async (parent: unknown, args: LoginInput, { prisma }: Context) => {
    try {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });

      if (!user) {
        return { userError: 'User not found', token: null, user: null };
      }

      const valid = await bcrypt.compare(args.password, user.password);

      if (!valid) {
        return { userError: 'Invalid password', token: null, user: null };
      }

      const token = generateToken(user.id);
      return { userError: null, token, user };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), token: null, user: null };
    }
  },
};
