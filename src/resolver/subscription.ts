import { Context } from '../types/context';

export const Subscription = {
  user: async (
    parent: { userId: string },
    args: unknown,
    { userLoader }: Context,
  ) => {
    return userLoader.load(parent.userId);
  },
};
