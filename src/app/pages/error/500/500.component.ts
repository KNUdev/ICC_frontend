import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LangChangeEvent,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { startWith, switchMap } from 'rxjs';
import { I18nService } from '../../../services/languages/i18n.service';

@Component({
  selector: 'error-internal',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './500.component.html',
  styleUrl: './500.component.scss',
})
export class InternalErrorPage {
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
            'pages/error/500',
            event.lang
          )
        )
      )
      .subscribe();
  }
}
