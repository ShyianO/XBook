import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { IImage } from '../interfaces/image.interface';
import { Store } from '@ngxs/store';
import { LoadImages, SetLoader } from '../../store/admin.action';

type FileURL = {
  fileURL?: string;
};

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private store: Store) {}

  saveImages(images: IImage[]): void {
    const imagesToUpload: FileURL[] = [];
    const imagesToDelete: string[] = [];
    const imagePromises: Promise<unknown>[] = [];
    const urlPromises: Promise<unknown>[] = [];

    for (const image of images) {
      if (!image.objectId && !image.deleted) {
        Object.defineProperty(image, 'name', {
          value: Date.now() + image.name.substring(image.name.indexOf('.'))
        });

        imagePromises.push(
          Backendless.Files.upload(image, 'images').then((fileURLs) => {
            imagesToUpload.push(fileURLs);
          })
        );
      } else if (image.objectId && image.deleted) {
        imagePromises.push(
          Backendless.Files.remove(image.fileURL).then(() => {
            imagesToDelete.push(image.objectId);
          })
        );
      }
    }

    Promise.all(imagePromises).then(() => {
      if (imagesToUpload.length) {
        urlPromises.push(
          Backendless.Data.of('Images').bulkCreate(imagesToUpload)
        );
      }

      if (imagesToDelete.length) {
        urlPromises.push(
          Backendless.Data.of('Images').bulkDelete(imagesToDelete)
        );
      }

      Promise.all(urlPromises).then(() => {
        this.store.dispatch(new LoadImages());
        this.store.dispatch(new SetLoader(false));
      });
    });
  }
}
