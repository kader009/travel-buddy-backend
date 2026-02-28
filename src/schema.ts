export const typeDefs = `#graphql
  enum Role {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String
    email: String
    password: String
    role: Role
    isVerified: Boolean
    createdAt: String
    updatedAt: String

    profile: Profile
    travelPlans: [TravelPlan]
    reviewsSent: [Review]
    reviewsReceived: [Review]
    subscription: Subscription
  }

  type Profile {
    id: String
    userId: String
    bio: String
    profileImage: String
    travelInterests: [String]
    visitedCountries: [String]
    currentLocation: String
    createdAt: String
    updatedAt: String
    user: User
  }

  type TravelPlan {
    id: ID!
    userId: String
    destination: String
    startDate: String
    endDate: String
    budgetRange: String
    travelType: String
    description: String
    createdAt: String
    updatedAt: String
    user: User
  }

  type Review {
    id: ID!
    reviewerId: String
    reviewedId: String
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
    reviewer: User
    reviewed: User
  }

  type Subscription {
    id: ID!
    userId: String
    planType: String
    status: String
    transactionId: String
    createdAt: String
    updatedAt: String
    user: User
  }

  type RatingInfo {
    average: Float
    count: Int
  }

  type AdminStats {
    totalUsers: Int
    totalTravelPlans: Int
    totalReviews: Int
    totalActiveSubscriptions: Int
  }

  type AuthPayload {
    userError: String
    token: String
    user: User
  }

  type UserPayload {
    userError: String
    user: User
  }

  type TravelPlanPayload {
    userError: String
    travelPlan: TravelPlan
  }
  
  type ProfilePayload {
    userError: String
    profile: Profile
  }
  
  type ReviewPayload {
    userError: String
    review: Review
  }

  type SubscriptionPayload {
    userError: String
    subscription: Subscription
  }

  input ProfileInput {
    bio: String
    profileImage: String
    travelInterests: [String]
    visitedCountries: [String]
    currentLocation: String
  }

  type Query {
    # User queries
    me: User
    users(page: Int, limit: Int): [User]
    user(id: ID!): User

    # Travel plan queries
    travelPlans(page: Int, limit: Int): [TravelPlan]
    travelPlan(id: ID!): TravelPlan
    matchTravelers(
      destination: String
      startDate: String
      endDate: String
      travelType: String
    ): [TravelPlan]

    # Review queries
    reviewsForUser(userId: ID!, page: Int, limit: Int): [Review]
    averageRating(userId: ID!): RatingInfo

    # Admin queries
    adminStats: AdminStats
  }

  type Mutation {
    # Auth
    signup(
      name: String!
      email: String!
      password: String!
    ): AuthPayload

    login(
      email: String!
      password: String!
    ): AuthPayload

    # User
    updateUser(
      name: String
      email: String
    ): UserPayload

    # Profile
    updateProfile(
      input: ProfileInput!
    ): ProfilePayload

    # Travel Plans
    createTravelPlan(
      destination: String!
      startDate: String!
      endDate: String!
      budgetRange: String!
      travelType: String!
      description: String!
    ): TravelPlanPayload

    updateTravelPlan(
      id: ID!
      destination: String
      startDate: String
      endDate: String
      budgetRange: String
      travelType: String
      description: String
    ): TravelPlanPayload

    deleteTravelPlan(id: ID!): TravelPlanPayload

    # Reviews
    createReview(
      reviewedId: ID!
      rating: Int!
      comment: String!
    ): ReviewPayload

    updateReview(
      id: ID!
      rating: Int
      comment: String
    ): ReviewPayload

    deleteReview(id: ID!): ReviewPayload

    # Payment
    createPaymentIntent(planType: String!): String
    verifyPayment(transactionId: String!, planType: String!): SubscriptionPayload

    # Admin
    updateUserRole(userId: ID!, role: Role!): UserPayload
    adminDeleteUser(userId: ID!): UserPayload
    adminDeleteTravelPlan(id: ID!): TravelPlanPayload
  }
`;
