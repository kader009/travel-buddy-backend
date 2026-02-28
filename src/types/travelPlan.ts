export interface CreateTravelPlanInput {
  destination: string;
  startDate: string;
  endDate: string;
  budgetRange: string;
  travelType: string;
  description: string;
}

export interface UpdateTravelPlanInput extends Partial<CreateTravelPlanInput> {
  id: string;
}
