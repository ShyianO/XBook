import { Component, OnInit } from '@angular/core';
import { BackendlessService } from './core/services/backendless.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'xbook';

  constructor(private backendlessService: BackendlessService) {}

  ngOnInit(): void {
    this.backendlessService.init();
  }
}
