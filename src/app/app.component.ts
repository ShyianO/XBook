import { Component, OnInit } from '@angular/core';
import { BackendlessService } from './backendless.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'xbook';

  constructor(private backendless: BackendlessService) {}

  ngOnInit(): void {
    this.backendless.init();
  }
}
