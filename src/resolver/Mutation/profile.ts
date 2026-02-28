import { Context } from '../../types/context';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

interface ProfileInput {
  input: {
    bio?: string;
    profileImage?: string;
    travelInterests?: string[];
    visitedCountries?: string[];
    currentLocation?: string;
  };
}

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
