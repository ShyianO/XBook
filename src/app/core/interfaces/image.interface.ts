export interface IImage extends File {
  created: number;
  fileURL: string;
  objectId: string;
  ownerId: string;
  updated: string;
  status?: string;
  deleted?: boolean;
  ___class: string;
}
