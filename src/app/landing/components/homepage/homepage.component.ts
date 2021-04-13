import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
