import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `name = '${this.route.snapshot.params.name}' and status = ${ConfigurationStatus.published}`
    );

    Backendless.Data.of('Websites')
      .find(dataQuery)
      .then((website: IConfiguration[]) => {
        if (!website.length) {
          this.router.navigate(['/landing']);
        }

        this.data = website[0];
      })
      .catch(() => {
        this.router.navigate(['/landing']);
      });
  }
}
