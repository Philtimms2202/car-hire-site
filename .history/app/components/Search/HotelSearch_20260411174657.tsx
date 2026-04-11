'use client'

import { useLocale } from '@/context/localeContext'

const TRIP_LOCALE_MAP: Record<string, string> = {
  en: 'en_gb',
  es: 'es_es',
  fr: 'fr_fr',
  de: 'de_de',
  it: 'it_it',
  pt: 'pt_pt',
  nl: 'nl_nl',
  sv: 'sv_se',
  no: 'no_no',
  da: 'da_dk',
  fi: 'fi_fi',
  pl: 'pl_pl',
  cs: 'cs_cz',
  sk: 'sk_sk',
  hu: 'hu_hu',
  ro: 'ro_ro',
  bg: 'bg_bg',
  ru: 'ru_ru',
  uk: 'uk_ua',
  tr: 'tr_tr',
  el: 'el_gr',
  ar: 'ar_ae',
  he: 'he_il',
  zh: 'zh_cn',
  ko: 'ko_kr',
  ja: 'ja_jp',
  id: 'id_id',
  vi: 'vi_vn',
  th: 'th_th',
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const tripLocale = TRIP_LOCALE_MAP[language] ?? 'en_gb'

  const desktopUrl = `https://www.trip.com/partners/ad/S15169730?Allianceid=8052073&SID=304662590&trip_sub1=&locale=${tripLocale}&curr=${currency}`
  const mobileUrl = `https://www.trip.com/partners/ad/S15169730?Allianceid=8052073&SID=304662590&trip_sub1=&locale=${tripLocale}&currency=${currency}`

  return (
    <div className="w-full flex justify-center px-4 py-6">

      {/* Desktop widget */}
      <div className="hidden md:block w-full max-w-[900px] rounded-xl overflow-hidden shadow-md bg-white">
        <iframe
          id="S15169730-desktop"
          src={desktopUrl}
          style={{
            width: '100%',
            height: '400px',
            border: 'none',
          }}
          scrolling="no"
        />
      </div>

      {/* Mobile widget */}
      <div className="block md:hidden w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-md bg-white">
        <iframe
          id="S15169730-mobile"
          src={mobileUrl}
          style={{
            width: '100%',
            height: '350px',
            border: 'none',
          }}
          scrolling="no"
        />
      </div>

    </div>
  )
}
