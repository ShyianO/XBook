import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { IFile } from '../interfaces/file.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  saveImages(images: IFile[]): void {
    const arr = [];
    let count = 0;

    for (const image of images) {
      if (image.status === 'Without URL') {
        Object.defineProperty(image, 'name', {
          value: Date.now() + image.name.substring(image.name.indexOf('.'))
        });

        Backendless.Files.upload(image, 'images')
          .then((fileURLs) => {
            arr.push(fileURLs);
            count++;
            image.status = 'Sending';

            if (count === images.length) {
              saveImagesURLs();
            }
          })
          .catch((error) => {
            console.log('error - ' + error.message);
          });
      } else if (image.status === 'With URL') {
        count++;
      } else if (image.status === 'Sending') {
        count++;
      }
    }

    const saveImagesURLs = () => {
      Backendless.Data.of('Images')
        .bulkCreate(arr)
        .then((success) => {
          console.log(success);
        });
    };
  }
}
