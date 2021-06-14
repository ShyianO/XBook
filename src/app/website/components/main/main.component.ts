import { AfterViewInit, Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import Backendless from 'backendless';
import {
  ConfigurationScheme,
  ConfigurationStatus,
  IConfiguration
} from '../../../core/interfaces/configuration.interface';
import { Title } from '@angular/platform-browser';

import { IImage } from '../../../core/interfaces/image.interface';
import { tileLayer, latLng } from 'leaflet';
import { parseJson } from '@angular/cli/utilities/json-file';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  configuration: IConfiguration;
  images = [];
  latitude: number;
  longitude: number;

  options;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration(): void {
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

        this.selectSchema(this.configuration.schema);
        this.loadImages();
        this.getCoordinates();
      })
      .catch(() => {
        this.router.navigate(['/landing']);
      });
  }

  loadImages(): void {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `ownerId = '${this.configuration.ownerId}'`
    );

    Backendless.Data.of('Images')
      .find(dataQuery)
      .then((imageGallery: IImage[]) => {
        this.images = imageGallery;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectSchema(schema: number): void {
    const head = document.getElementsByTagName('HEAD')[0];
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.type = 'text/css';

    if (schema === ConfigurationScheme.DeepPurpleAmber) {
      link.href = '../../../../assets/themes/deeppurple-amber.css';
    } else if (schema === ConfigurationScheme.IndigoPink) {
      link.href = '../../../../assets/themes/indigo-pink.css';
    } else if (schema === ConfigurationScheme.PinkBlueGrey) {
      link.href = '../../../../assets/themes/pink-bluegrey.css';
    } else if (schema === ConfigurationScheme.PurpleGreen) {
      link.href = '../../../../assets/themes/purple-green.css';
    }

    head.appendChild(link);
  }

  getCoordinates(): void {
    const address = `https://nominatim.openstreetmap.org/search.php?q=${this.configuration.address}%2C+${this.configuration.city}%2C+${this.configuration.country}&format=jsonv2`;

    fetch(address)
      .then((response) => {
        return response.json();
      })
      .then((coords) => {
        if (coords.length) {
          this.options = {
            layers: [
              tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '...'
              })
            ],
            zoom: 18,
            center: latLng(coords[0].lat, coords[0].lon)
          };
        }
      });
  }
}
