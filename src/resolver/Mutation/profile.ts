import { Context } from '../../types/context';
import { ProfileInput } from '../../types/profile';
import { getErrorMessage } from '../../utils/errorHelper';

export const profileResolver = {
  updateProfile: async (
    parent: unknown,
    { input }: ProfileInput,
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', profile: null };
    }

    try {
      const existingProfile = await prisma.profile.findUnique({
        where: { userId },
      });

      let profile;
      if (existingProfile) {
        profile = await prisma.profile.update({
          where: { userId },
          data: {
            ...input,
          },
        });
      } else {
        profile = await prisma.profile.create({
          data: {
            userId,
            ...input,
          },
        });
      }

      return { userError: null, profile };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), profile: null };
    }
  },
};
