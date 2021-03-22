import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
