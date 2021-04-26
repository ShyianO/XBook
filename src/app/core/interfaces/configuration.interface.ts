export interface IConfiguration {
  name: string;
  title: string;
  description?: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  objectId?: string;
  draft?: boolean;
  published?: boolean;
}
