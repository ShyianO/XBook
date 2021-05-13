import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  saveImages(images): void {
    for (const image of images) {
      Backendless.Files.upload(image, 'images')
        .then((fileURLs) => {
          console.log(fileURLs);
        })
        .catch((error) => {
          console.log('error - ' + error.message);
        });
    }
  }
}
