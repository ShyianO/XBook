import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import Backendless from 'backendless';
import {
  ConfigurationStatus,
  IConfiguration
} from '../../../core/interfaces/configuration.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  data: IConfiguration;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `name = '${this.router.url.substring(9)}'`
    );

    Backendless.Data.of('Websites')
      .find(dataQuery)
      .then((website: IConfiguration[]) => {
        if (website.length === 0) {
          this.router.navigate(['/landing']);
        }

        if (website[0].status === ConfigurationStatus.published) {
          this.data = website[0];
        } else if (website[1].status === ConfigurationStatus.published) {
          this.data = website[1];
        }
      })
      .catch(() => {
        this.router.navigate(['/landing']);
      });
  }
}
