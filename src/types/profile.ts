export interface ProfileInput {
  input: {
    bio?: string;
    profileImage?: string;
    travelInterests?: string[];
    visitedCountries?: string[];
    currentLocation?: string;
  };
}
