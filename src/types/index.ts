export type UserRequestBody = {
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
  regions?: string[];
};
