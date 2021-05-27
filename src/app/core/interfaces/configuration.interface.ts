import { IImage } from './image.interface';

export enum ConfigurationStatus {
  draft,
  published
}

export interface IConfiguration {
  name: string;
  title: string;
  description?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  logo?: string;
  gallery?: IImage[];
  objectId?: string;
  ownerId?: string;
  status: ConfigurationStatus;
}
