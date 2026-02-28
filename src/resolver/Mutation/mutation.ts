import { authResolver } from './authentication';
import { profileResolver } from './profile';
import { travelPlanResolver } from './travelPlan';
import { reviewResolver } from './review';
import { paymentResolver } from './payment';
import { adminResolver } from './admin';
import { userMutationResolver } from './userMutation';

export const Mutation = {
  ...authResolver,
  ...profileResolver,
  ...travelPlanResolver,
  ...reviewResolver,
  ...paymentResolver,
  ...adminResolver,
  ...userMutationResolver,
};
