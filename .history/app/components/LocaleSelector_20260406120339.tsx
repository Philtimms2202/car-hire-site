'use client'

import { useLocale } from "@/context/LocaleContext"

export default function LocaleSelector() {
  const { locale, setLocale, currency, setCurrency } = useLocale()

  return (
    <div className="flex items-center gap-3">

      {/* Language selector */}
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="input-field bg-white text-gray-900 w-48"
      >
        <option value="en_gb">🇬🇧 English (UK)</option>
        <option value="en_us">🇺🇸 English (US)</option>
        <option value="en_au">🇦🇺 English (Australia)</option>
        <option value="en_ca">🇨🇦 English (Canada)</option>
        <option value="en_sg">🇸🇬 English (Singapore)</option>

        <option value="fr_fr">🇫🇷 Français</option>
        <option value="fr_ca">🇨🇦 Français (Canada)</option>

        <option value="de_de">🇩🇪 Deutsch</option>

        <option value="es_es">🇪🇸 Español</option>
        <option value="es_mx">🇲🇽 Español (México)</option>

        <option value="it_it">🇮🇹 Italiano</option>

        <option value="pt_pt">🇵🇹 Português</option>
        <option value="pt_br">🇧🇷 Português (Brasil)</option>

        <option value="nl_nl">🇳🇱 Nederlands</option>
        <option value="sv_se">🇸🇪 Svenska</option>
        <option value="da_dk">🇩🇰 Dansk</option>
        <option value="fi_fi">🇫🇮 Suomi</option>
        <option value="no_no">🇳🇴 Norsk</option>

        <option value="ja_jp">🇯🇵 日本語</option>
        <option value="ko_kr">🇰🇷 한국어</option>
        <option value="zh_cn">🇨🇳 中文 (简体)</option>
        <option value="zh_tw">🇹🇼 中文 (繁體)</option>

        <option value="ru_ru">🇷🇺 Русский</option>
        <option value="ar_ae">🇦🇪 العربية</option>
      </select>

      {/* Currency selector */}
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="input-field bg-white text-gray-900 w-40"
      >
        <option value="gbp">🇬🇧 GBP £</option>
        <option value="eur">🇪🇺 EUR €</option>
        <option value="usd">🇺🇸 USD $</option>
        <option value="cad">🇨🇦 CAD $</option>
        <option value="aud">🇦🇺 AUD $</option>
        <option value="nzd">🇳🇿 NZD $</option>
        <option value="sgd">🇸🇬 SGD $</option>
        <option value="hkd">🇭🇰 HKD $</option>
        <option value="jpy">🇯🇵 JPY ¥</option>
        <option value="cny">🇨🇳 CNY ¥</option>
        <option value="inr">🇮🇳 INR ₹</option>
        <option value="aed">🇦🇪 AED د.إ</option>
        <option value="sar">🇸🇦 SAR ر.س</option>
        <option value="chf">🇨🇭 CHF</option>
        <option value="sek">🇸🇪 SEK kr</option>
        <option value="nok">🇳🇴 NOK kr</option>
        <option value="dkk">🇩🇰 DKK kr</option>
        <option value="pln">🇵🇱 PLN zł</option>
        <option value="czk">🇨🇿 CZK Kč</option>
        <option value="mxn">🇲🇽 MXN $</option>
        <option value="brl">🇧🇷 BRL R$</option>
        <option value="zar">🇿🇦 ZAR R</option>
        <option value="thb">🇹🇭 THB ฿</option>
        <option value="krw">🇰🇷 KRW ₩</option>
        <option value="idr">🇮🇩 IDR Rp</option>
      </select>

    </div>
  )
}