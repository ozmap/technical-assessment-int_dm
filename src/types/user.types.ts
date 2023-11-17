export type UserRequestBody = {
  name: string;
  email: string;
  address?: UserAddress;
  coordinates?: [number, number];
};

export type UserAddress = {
  street: string;
  neighborhood: string;
  number?: number;
  city: string;
  state: string;
  country: string;
};

export type NewUser = {
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
};
