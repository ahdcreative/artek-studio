export type StudioLang = 'en' | 'it';

export function useLocale() {
  const lang = useCookie<StudioLang>('art3k_lang', {
    default: () => 'en',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  });

  function setLang(next: StudioLang) {
    lang.value = next;
  }

  function toggleLang() {
    lang.value = lang.value === 'en' ? 'it' : 'en';
  }

  function t(en: string, it: string): string {
    return lang.value === 'it' ? it : en;
  }

  return {
    lang,
    setLang,
    toggleLang,
    t
  };
}
