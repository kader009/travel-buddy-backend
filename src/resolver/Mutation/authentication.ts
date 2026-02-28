import { UserCreate } from '../../types/userInterface';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtHelper';
import { Context } from '../../types/context';

export const authResolver = {
  signup: async (parent: unknown, args: UserCreate, { prisma }: Context) => {
    const isExit = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });

    if (isExit) {
      throw new Error('User already exists');
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
    return { token, user: newUser };
  },

  login: async (parent: unknown, args: UserCreate, { prisma }: Context) => {
    const user = await prisma.user.findFirst({
      where: {
        email: args.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user.id);
    return { token, user };
  },
};
