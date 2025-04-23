import { Component, inject } from '@angular/core';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { startWith, switchMap } from 'rxjs';
import { I18nService } from '../../services/languages/i18n.service';

@Component({
  selector: 'app-landing',
  imports: [TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private i18nService = inject(I18nService);
  private translate = inject(TranslateService);

  constructor() {
    this.translate.onLangChange
      .pipe(
        startWith({
          lang: this.translate.currentLang,
        } as LangChangeEvent),
        switchMap((event) =>
          this.i18nService.loadComponentTranslations(
            'pages/landing',
            event.lang
          )
        )
      )
      .subscribe();
  }
}
