import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public translate: TranslateService,
    public translationService: TranslationService
  ) {}

  onSelect(lang): void {
    this.translationService.selectLanguage(lang);
  }
}
