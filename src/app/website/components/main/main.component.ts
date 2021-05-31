import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import Backendless from 'backendless';
import {
  ConfigurationStatus,
  IConfiguration
} from '../../../core/interfaces/configuration.interface';
import { Title } from '@angular/platform-browser';

import { IImage } from '../../../core/interfaces/image.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  configuration: IConfiguration;
  images = [];
  position = { lat: 59.33555, lng: 18.029851 };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration = () => {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `name = '${this.route.snapshot.params.name}' and status = ${ConfigurationStatus.published}`
    );

    Backendless.Data.of('Websites')
      .find(dataQuery)
      .then((website: IConfiguration[]) => {
        if (!website.length) {
          this.router.navigate(['/landing']);
        }

        this.configuration = website[0];
        this.titleService.setTitle(this.configuration.title);
        console.log(this.configuration);
        this.loadImages();
      })
      .catch(() => {
        this.router.navigate(['/landing']);
      });
  };

  loadImages = () => {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `ownerId = '${this.configuration.ownerId}'`
    );

    Backendless.Data.of('Images')
      .find(dataQuery)
      .then((imageGallery: IImage[]) => {
        this.images = imageGallery;
        console.log(imageGallery);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
