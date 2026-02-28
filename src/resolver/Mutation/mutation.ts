import { authResolver } from './authentication';
import { profileResolver } from './profile';
import { travelPlanResolver } from './travelPlan';
import { reviewResolver } from './review';
import { paymentResolver } from './payment';

export const Mutation = {
  ...authResolver,
  ...profileResolver,
  ...travelPlanResolver,
  ...reviewResolver,
  ...paymentResolver,
};
