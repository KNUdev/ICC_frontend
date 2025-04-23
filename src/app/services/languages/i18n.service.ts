import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import {
  AVAILABLE_LANGUAGES,
  LANG_TO_LOCALE,
  LANGUAGE_KEY,
  LanguageCode,
} from './i18n.constants';

interface LanguageOption {
  code: LanguageCode;
  active: boolean;
  name: string;
  img: string;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  public currentLang = signal<LanguageCode>('uk');
  public supportedLanguages = computed<LanguageOption[]>(() => {
    return AVAILABLE_LANGUAGES.map((code) => ({
      code,
      active: this.currentLang() === code,
      name: code === 'uk' ? 'Українська' : code === 'en' ? 'English' : code,
      img: `assets/icon/language/${code}.svg`,
    }));
  });
  private currentLocaleSubject = new BehaviorSubject<string>(
    LANG_TO_LOCALE[
      (localStorage.getItem(LANGUAGE_KEY) as LanguageCode) || 'uk'
    ] || 'uk-UA'
  );

  constructor(private translate: TranslateService, private http: HttpClient) {
    const savedLanguage =
      (localStorage.getItem(LANGUAGE_KEY) as LanguageCode) || 'uk';
    const browserLang = navigator.language.split('-')[0] as LanguageCode;
    const defaultLang = AVAILABLE_LANGUAGES.includes(browserLang)
      ? browserLang
      : savedLanguage;

    this.currentLang.set(defaultLang);
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      const newLocale = LANG_TO_LOCALE[event.lang as LanguageCode] || 'en-UK';
      this.currentLocaleSubject.next(newLocale);
    });
  }

  public switchLang(languageCode: LanguageCode): void {
    this.translate.use(languageCode);
    this.currentLang.set(languageCode);
    localStorage.setItem(LANGUAGE_KEY, languageCode);
  }

  public loadComponentTranslations(
    component: string,
    lang: string
  ): Observable<any> {
    const paths = [
      `app/${component}/i18n/${lang}.json`,
      `app/common/i18n/${lang}.json`,
    ];

    const requests = paths.map((path) =>
      this.http.get(path).pipe(
        map((translations) => {
          if (translations) {
            return this.translate.setTranslation(lang, translations, true);
          }
          return {};
        }),
        catchError((error) => {
          console.error(error);
          return of({});
        })
      )
    );

    return forkJoin(requests);
  }

  public getCurrentLanguage(): Observable<{
    img: string;
    name: string;
  }> {
    return this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.currentLang }),
      map(() => ({
        img: `assets/icon/language/${this.translate.currentLang}.svg`,
        name: this.translate.currentLang === 'uk' ? 'Українська' : 'English',
      }))
    );
  }
}
