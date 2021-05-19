import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { IImage } from '../interfaces/image.interface';
import { Store } from '@ngxs/store';
import { LoadImages } from '../../store/admin.action';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private store: Store) {}

  saveImages(images: IImage[]): void {
    const imagesToUpload = [];
    const imagesToDelete = [];
    let count = 0;

    const saveImagesURLs = () => {
      if (imagesToUpload.length) {
        Backendless.Data.of('Images')
          .bulkCreate(imagesToUpload)
          .then(() => {
            this.store.dispatch(new LoadImages());
          });
      }
    };

    const deleteImagesURLs = () => {
      if (imagesToDelete.length) {
        Backendless.Data.of('Images')
          .bulkDelete(imagesToDelete)
          .then(() => {
            this.store.dispatch(new LoadImages());
          })
          .catch((error) => {
            console.log('Server reported an error ' + error);
          });
      }
    };

    for (const image of images) {
      if (!image.objectId && !image.deleted) {
        console.log(image);
        Object.defineProperty(image, 'name', {
          value: Date.now() + image.name.substring(image.name.indexOf('.'))
        });

        Backendless.Files.upload(image, 'images')
          .then((fileURLs) => {
            count++;
            imagesToUpload.push(fileURLs);

            if (count === images.length) {
              saveImagesURLs();
              deleteImagesURLs();
            }
          })
          .catch((error) => {
            console.log('error - ' + error.message);
          });
      } else if (image.objectId && image.deleted) {
        Backendless.Files.remove(image.fileURL)
          .then(() => {
            count++;
            imagesToDelete.push(image.objectId);

            if (count === images.length) {
              saveImagesURLs();
              deleteImagesURLs();
            }
          })
          .catch((error) => {
            console.log('error - ' + error.message);
          });
      } else {
        count++;

        if (count === images.length) {
          saveImagesURLs();
          deleteImagesURLs();
        }
      }
    }
  }
}
