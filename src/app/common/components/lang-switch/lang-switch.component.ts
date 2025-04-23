import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../../../services/languages/i18n.service';

``;

@Component({
  selector: 'app-lang-switch',
  imports: [MatIconModule, CommonModule],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {
  isOpenLang = signal<boolean>(false);
  readonly iconPaths = {
    arrowDown: 'assets/icon/system/arrowDown.svg',
  } as const;
  public i18nService = inject(I18nService);
  protected currentLanguage$ = this.i18nService.getCurrentLanguage();

  toggleDropdownLang() {
    this.isOpenLang.update((value) => !value);
  }

  selectLanguage(code: string) {
    this.i18nService.switchLang(code as any);
    this.isOpenLang.set(false);
  }
}
