import { Mutation } from './Mutation/mutation';
import { Query } from './Query/query';
import { User } from './user';
import { Profile } from './profile';
import { TravelPlan } from './travelPlan';
import { Review } from './review';
import { Subscription } from './subscription';
import { TravelRequest } from './travelRequestType';

export const resolvers = {
  Query,
  Mutation,
  User,
  Profile,
  TravelPlan,
  Review,
  Subscription,
  TravelRequest,
};
