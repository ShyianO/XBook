import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  selected = 'option2';
  option = '';

  showSelectedOption(): void {
    this.option = this.selected;
  }
}
