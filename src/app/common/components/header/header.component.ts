import { Component, inject } from '@angular/core';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { startWith, switchMap } from 'rxjs';
import { I18nService } from '../../../services/languages/i18n.service';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';

@Component({
  selector: 'app-header',
  imports: [LangSwitchComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
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
            'common/components/header',
            event.lang
          )
        )
      )
      .subscribe();
  }
}
