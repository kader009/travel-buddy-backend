import { Context } from '../../types/context';
import { UpdateUserInput } from '../../types/user';
import { getErrorMessage } from '../../utils/errorHelper';

export const userMutationResolver = {
  updateUser: async (
    parent: unknown,
    args: UpdateUserInput,
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', user: null };
    }

    try {
      const updateData: Partial<{ name: string; email: string }> = {};

      if (args.name) {
        if (args.name.trim().length < 2) {
          return {
            userError: 'Name must be at least 2 characters',
            user: null,
          };
        }
        updateData.name = args.name;
      }

      if (args.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(args.email)) {
          return { userError: 'Invalid email format', user: null };
        }

        const existing = await prisma.user.findFirst({
          where: { email: args.email, NOT: { id: userId } },
        });
        if (existing) {
          return { userError: 'Email already in use', user: null };
        }
        updateData.email = args.email;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return { userError: null, user };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), user: null };
    }
  },
};
