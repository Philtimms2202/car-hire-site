import { client } from "@/sanity/lib/client"

const BASE_URL = "https://timmstravel.com"

// Your existing major hubs (origins only — we pair regionals against these)
const MAJOR_HUBS = [
  // UK & Ireland
  "LHR", "LGW", "MAN", "EDI", "DUB",

  // Western Europe
  "CDG", "AMS", "FRA", "MUC", "ZRH", "VIE", "BRU", "CPH", "OSL", "ARN",

  // Southern Europe
  "BCN", "MAD", "AGP", "ALC", "PMI", "TFS", "ACE",
  "FCO", "MXP", "VCE", "ATH", "LIS", "OPO", "PRG",

  // United States
  "ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS",
  "MCO", "MIA", "PHX", "IAH", "BOS", "CLT",

  // Canada
  "YYZ", "YVR", "YYC",

  // Mexico & Caribbean
  "CUN", "SJD", "PUJ", "MBJ", "NAS", "AUA", "CUR", "GCM",

  // Latin America
  "GRU", "GIG", "EZE", "SCL", "BOG", "LIM",

  // Middle East
  "DXB", "DOH", "AUH", "AMM", "BEY",

  // Turkey
  "IST",

  // India
  "DEL", "BOM", "MAA", "BLR", "HYD",

  // China
  "PEK", "PVG", "CAN", "SZX",

  // Japan
  "HND", "NRT", "KIX", "CTS",

  // Korea
  "ICN",

  // Singapore
  "SIN",

  // Thailand
  "BKK", "HKT",

  // Indonesia
  "DPS", "CGK",

  // Vietnam
  "SGN", "HAN",

  // Australia & NZ
  "SYD", "MEL", "BNE", "PER", "AKL",

  // Africa
  "CPT", "JNB", "NBO", "ZNZ", "CAI", "RAK", "MBA",

  // Previous additions
  "TLL", "RIX", "WAW", "KRK", "BUD", "ZAG", "DBV", "SPU",
  "HER", "RHO", "CFU", "SKG", "MLA", "TIV",
  "SAN", "TPA", "HNL", "OGG", "STT", "STX",
  "CEB", "MNL", "KUL", "HKG", "SSH", "HRG", "CNS"
]

// Regional and secondary airports NOT in the existing sitemap
const REGIONAL_AIRPORTS = [
  // UK Regional
  "BHX", // Birmingham
  "LBA", // Leeds Bradford
  "NCL", // Newcastle
  "BFS", // Belfast International
  "BHD", // Belfast City
  "GLA", // Glasgow
  "ABZ", // Aberdeen
  "INV", // Inverness
  "SOU", // Southampton
  "EXT", // Exeter
  "NWI", // Norwich
  "HUY", // Humberside
  "MME", // Teesside
  "DSA", // Doncaster Sheffield
  "CWL", // Cardiff
  "PIK", // Glasgow Prestwick
  "STN", // London Stansted
  "LTN", // London Luton
  "LCY", // London City

  // Ireland Regional
  "SNN", // Shannon
  "ORK", // Cork
  "KIR", // Kerry
  "NOC", // Knock

  // French Regional
  "LYS", // Lyon
  "NCE", // Nice
  "MRS", // Marseille
  "TLS", // Toulouse
  "BOD", // Bordeaux
  "NTE", // Nantes
  "SXB", // Strasbourg
  "LIL", // Lille
  "BIQ", // Biarritz
  "MPL", // Montpellier

  // German Regional
  "DUS", // Düsseldorf
  "HAM", // Hamburg
  "STR", // Stuttgart
  "NUE", // Nuremberg
  "LEJ", // Leipzig
  "BRE", // Bremen
  "CGN", // Cologne
  "HAJ", // Hannover
  "FKB", // Karlsruhe/Baden-Baden

  // Italian Regional
  "BLQ", // Bologna
  "PSA", // Pisa
  "TRN", // Turin
  "NAP", // Naples
  "PMO", // Palermo
  "CTA", // Catania
  "BRI", // Bari
  "CAG", // Cagliari
  "OLB", // Olbia

  // Spanish Regional
  "SVQ", // Seville
  "VLC", // Valencia
  "BIO", // Bilbao
  "SDR", // Santander
  "GRX", // Granada
  "MJV", // Murcia
  "VGO", // Vigo
  "OVD", // Asturias
  "LPA", // Gran Canaria
  "FUE", // Fuerteventura

  // Portuguese
  "FAO", // Faro
  "FNC", // Madeira
  "PDL", // Azores

  // Greek Islands
  "JMK", // Mykonos
  "JSI", // Skiathos
  "KGS", // Kos
  "ZTH", // Zakynthos
  "CHQ", // Chania
  "EFL", // Kefalonia
  "PVK", // Preveza
  "SMI", // Samos

  // Scandinavian Regional
  "BGO", // Bergen
  "SVG", // Stavanger
  "TRD", // Trondheim
  "TOS", // Tromsø
  "GOT", // Gothenburg
  "MMX", // Malmö
  "OUL", // Oulu
  "TMP", // Tampere
  "HEL", // Helsinki
  "RVN", // Rovaniemi

  // Eastern Europe
  "OTP", // Bucharest
  "SOF", // Sofia
  "SKP", // Skopje
  "TIA", // Tirana
  "SJJ", // Sarajevo
  "LWO", // Lviv
  "KBP", // Kyiv
  "VNO", // Vilnius
  "MSQ", // Minsk
  "KTW", // Katowice
  "POZ", // Poznan
  "WRO", // Wroclaw
  "GDN", // Gdansk

  // US Regional
  "PDX", // Portland
  "MSP", // Minneapolis
  "DTW", // Detroit
  "PIT", // Pittsburgh
  "CVG", // Cincinnati
  "CMH", // Columbus
  "IND", // Indianapolis
  "MKE", // Milwaukee
  "STL", // St Louis
  "BNA", // Nashville
  "RDU", // Raleigh-Durham
  "MEM", // Memphis
  "JAX", // Jacksonville
  "SAT", // San Antonio
  "AUS", // Austin
  "OKC", // Oklahoma City
  "TUL", // Tulsa
  "ABQ", // Albuquerque
  "ELP", // El Paso
  "OMA", // Omaha
  "BUF", // Buffalo
  "ALB", // Albany
  "PVD", // Providence
  "BDL", // Hartford
  "PWM", // Portland ME
  "GSO", // Greensboro
  "CHS", // Charleston SC
  "SAV", // Savannah
  "DAY", // Dayton
  "GRR", // Grand Rapids
  "DSM", // Des Moines
  "LIT", // Little Rock
  "MSY", // New Orleans
  "BIR", // Biratnagar (placeholder — swap as needed)
  "SDF", // Louisville
  "ROC", // Rochester NY
  "SYR", // Syracuse
  "BOI", // Boise
  "MCI", // Kansas City
  "TUS", // Tucson
  "ONT", // Ontario CA
  "SMF", // Sacramento
  "SJC", // San Jose
  "OAK", // Oakland
  "BUR", // Burbank
  "LGB", // Long Beach
  "SNA", // Orange County
  "PSP", // Palm Springs

  // Canadian Regional
  "YOW", // Ottawa
  "YUL", // Montreal
  "YEG", // Edmonton
  "YHZ", // Halifax
  "YWG", // Winnipeg
  "YQR", // Regina
  "YXE", // Saskatoon

  // Mexico Regional
  "GDL", // Guadalajara
  "MTY", // Monterrey
  "OAX", // Oaxaca
  "MID", // Merida
  "VER", // Veracruz
  "ZIH", // Zihuatanejo
  "PVR", // Puerto Vallarta
  "MZT", // Mazatlan
  "HMO", // Hermosillo

  // Caribbean & Central America
  "SXM", // Sint Maarten
  "BGI", // Barbados
  "GND", // Grenada
  "SKB", // St Kitts
  "SVD", // St Vincent
  "SLU", // St Lucia
  "TAB", // Tobago
  "POS", // Trinidad
  "GEO", // Georgetown Guyana
  "PTY", // Panama City
  "SAL", // El Salvador
  "RTB", // Roatan Honduras
  "LIR", // Liberia Costa Rica
  "SJO", // San Jose Costa Rica

  // South America Regional
  "MDE", // Medellin
  "CTG", // Cartagena
  "CLO", // Cali
  "UIO", // Quito
  "GYE", // Guayaquil
  "CUZ", // Cusco
  "AQP", // Arequipa
  "CGB", // Cuiaba
  "SSA", // Salvador
  "REC", // Recife
  "FOR", // Fortaleza
  "BEL", // Belem
  "MCP", // Macapa
  "VCP", // Campinas
  "FLN", // Florianopolis
  "POA", // Porto Alegre
  "CWB", // Curitiba
  "MVD", // Montevideo
  "ASU", // Asuncion
  "VVI", // Santa Cruz Bolivia
  "LPB", // La Paz

  // Middle East Regional
  "KWI", // Kuwait
  "BAH", // Bahrain
  "MCT", // Muscat
  "SHJ", // Sharjah
  "RUH", // Riyadh
  "JED", // Jeddah
  "TLV", // Tel Aviv
  "GYD", // Baku
  "EVN", // Yerevan
  "TBS", // Tbilisi
  "ALA", // Almaty
  "TSE", // Nursultan

  // Indian Regional
  "AMD", // Ahmedabad
  "CCU", // Kolkata
  "COK", // Kochi
  "TRV", // Trivandrum
  "IXB", // Bagdogra
  "GAU", // Guwahati
  "PAT", // Patna
  "LKO", // Lucknow
  "VNS", // Varanasi
  "JAI", // Jaipur
  "GOI", // Goa

  // Southeast Asia Regional
  "DAD", // Da Nang
  "PQC", // Phu Quoc
  "UIH", // Quy Nhon
  "VCA", // Can Tho
  "REP", // Siem Reap
  "PNH", // Phnom Penh
  "VTE", // Vientiane
  "LPQ", // Luang Prabang
  "RGN", // Yangon
  "MDL", // Mandalay
  "KNO", // Medan
  "PLM", // Palembang
  "SUB", // Surabaya
  "UPG", // Makassar
  "LOP", // Lombok
  "BPN", // Balikpapan
  "JOG", // Yogyakarta
  "SRG", // Semarang
  "KCH", // Kuching
  "BKI", // Kota Kinabalu
  "PEN", // Penang
  "LGK", // Langkawi
  "HKT", // Phuket (duplicate of hub — filtered out automatically at runtime)
  "CNX", // Chiang Mai
  "USM", // Koh Samui
  "HDY", // Hat Yai

  // Japan Regional
  "OKA", // Okinawa
  "FUK", // Fukuoka
  "NGO", // Nagoya
  "HIJ", // Hiroshima
  "SDJ", // Sendai
  "KMJ", // Kumamoto
  "KOJ", // Kagoshima
  "AOJ", // Aomori

  // China Regional
  "CTU", // Chengdu
  "KMG", // Kunming
  "XIY", // Xian
  "WUH", // Wuhan
  "CSX", // Changsha
  "NKG", // Nanjing
  "HGH", // Hangzhou
  "TAO", // Qingdao
  "DLC", // Dalian
  "SHE", // Shenyang
  "HRB", // Harbin
  "XMN", // Xiamen
  "FOC", // Fuzhou
  "NNG", // Nanning
  "HAK", // Haikou
  "SYX", // Sanya

  // Australia Regional
  "ADL", // Adelaide
  "CBR", // Canberra
  "OOL", // Gold Coast
  "TSV", // Townsville
  "NTL", // Newcastle AUS
  "MKY", // Mackay
  "ROK", // Rockhampton
  "HTI", // Hamilton Island
  "LST", // Launceston
  "HBA", // Hobart
  "DRW", // Darwin

  // New Zealand Regional
  "WLG", // Wellington
  "CHC", // Christchurch
  "ZQN", // Queenstown
  "DUD", // Dunedin
  "PMR", // Palmerston North

  // Pacific Islands
  "NAN", // Fiji
  "APW", // Samoa
  "TBU", // Tonga
  "PPT", // Tahiti
  "RAR", // Rarotonga
  "HIR", // Honiara
  "VLI", // Vanuatu
  "GUM", // Guam

  // Africa Regional
  "LOS", // Lagos
  "ACC", // Accra
  "ABV", // Abuja
  "DKR", // Dakar
  "ABJ", // Abidjan
  "CMN", // Casablanca
  "TUN", // Tunis
  "ALG", // Algiers
  "LFW", // Lomé
  "COO", // Cotonou
  "DLA", // Douala
  "NSI", // Yaounde
  "LBV", // Libreville
  "BZV", // Brazzaville
  "FIH", // Kinshasa
  "LAD", // Luanda
  "WDH", // Windhoek
  "GBE", // Gaborone
  "HRE", // Harare
  "LUN", // Lusaka
  "BLZ", // Blantyre
  "DAR", // Dar es Salaam
  "MWZ", // Mwanza
  "KGL", // Kigali
  "EBB", // Entebbe
  "ADD", // Addis Ababa
  "JIB", // Djibouti
  "MGQ", // Mogadishu
  "HAR", // Harare (alt)
  "TNR", // Antananarivo
  "RUN", // Reunion
  "MRU", // Mauritius
]

export async function GET() {
  const cities = await client.fetch(`
    *[_type == "city" && defined(primaryIATA)]{
      "slug": slug.current,
      primaryIATA
    }
  `)

  // Separate into hubs and regionals based on what's in Sanity
  // regionalCities explicitly excludes anything already in MAJOR_HUBS to prevent overlap with sitemap-routes-hubs
  const hubCities = cities.filter((c: any) => MAJOR_HUBS.includes(c.primaryIATA))
  const regionalCities = cities.filter((c: any) =>
    REGIONAL_AIRPORTS.includes(c.primaryIATA) && !MAJOR_HUBS.includes(c.primaryIATA)
  )

  const urls: string[] = []
  const seen = new Set<string>()

  // Regional → Hub routes (e.g. Birmingham to Paris)
  for (const origin of regionalCities) {
    for (const destination of hubCities) {
      if (origin.primaryIATA === destination.primaryIATA) continue

      const key = `${origin.primaryIATA}-${destination.primaryIATA}`
      if (seen.has(key)) continue
      seen.add(key)

      const originCode = origin.primaryIATA.toLowerCase()
      const destinationCode = destination.primaryIATA.toLowerCase()
      const slug = `${origin.slug}-to-${destination.slug}`
      const url = `${BASE_URL}/flights/${originCode}/${destinationCode}/${slug}`

      urls.push(`
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `)
    }
  }

  // Hub → Regional routes (e.g. London to Birmingham)
  for (const origin of hubCities) {
    for (const destination of regionalCities) {
      if (origin.primaryIATA === destination.primaryIATA) continue

      const key = `${origin.primaryIATA}-${destination.primaryIATA}`
      if (seen.has(key)) continue
      seen.add(key)

      const originCode = origin.primaryIATA.toLowerCase()
      const destinationCode = destination.primaryIATA.toLowerCase()
      const slug = `${origin.slug}-to-${destination.slug}`
      const url = `${BASE_URL}/flights/${originCode}/${destinationCode}/${slug}`

      urls.push(`
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `)
    }
  }

  // Regional → Regional routes (e.g. Birmingham to Edinburgh)
  for (const origin of regionalCities) {
    for (const destination of regionalCities) {
      if (origin.primaryIATA === destination.primaryIATA) continue

      const key = `${origin.primaryIATA}-${destination.primaryIATA}`
      if (seen.has(key)) continue
      seen.add(key)

      const originCode = origin.primaryIATA.toLowerCase()
      const destinationCode = destination.primaryIATA.toLowerCase()
      const slug = `${origin.slug}-to-${destination.slug}`
      const url = `${BASE_URL}/flights/${originCode}/${destinationCode}/${slug}`

      urls.push(`
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`.trim()

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}