import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
