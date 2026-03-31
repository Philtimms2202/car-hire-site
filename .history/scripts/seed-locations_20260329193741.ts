import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skeN4GcFwGW4SWZezsnJPjnnjJPN255WdyAQHFS9YS8anrNKVz3odzb1Btx0Y36FC7DH4AgwU4LZx1fuLAwvm7X4lbMwhfnokr4wrCTYhNT9DEqMaHS5mp7u5InHWA0TBvI2ckhn74j3kECZkxvFPwWvjXDz6w1fVQsZ5iZoZ29kbB2uxtBM',
  useCdn: false,
})

const locations = [
  // United Kingdom
  { city: 'London', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'London Heathrow Airport', emoji: '🏙️', heroDescription: 'From the buzzing streets of the capital to the rolling hills of the Cotswolds, hiring a car in London opens up a whole new side of England. Pick up at Heathrow and you are on the road in minutes.' },
  { city: 'Manchester', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Manchester Airport', emoji: '🐝', heroDescription: 'Manchester is the perfect base for exploring the North of England. The Peak District, Lake District and Yorkshire Dales are all within easy reach when you have a hire car at your disposal.' },
  { city: 'Edinburgh', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Edinburgh Airport', emoji: '🏰', heroDescription: 'Hire a car in Edinburgh and Scotland is yours to explore. From the dramatic Highland landscapes to whisky distilleries and ancient castles, every road trip from Edinburgh is an adventure.' },
  { city: 'Birmingham', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Birmingham Airport', emoji: '🏭', heroDescription: 'Sitting right in the heart of England, Birmingham is the ideal base for road trips in every direction. The Cotswolds, Shropshire Hills and Stratford upon Avon are all just a short drive away.' },
  { city: 'Bristol', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Bristol Airport', emoji: '🌉', heroDescription: 'Bristol is the gateway to some of England\'s most beautiful scenery. Hire a car and you can be on the beaches of Cornwall, the streets of Bath or exploring Exmoor in under an hour.' },
  { city: 'Glasgow', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Glasgow Airport', emoji: '🎶', heroDescription: 'Glasgow puts the very best of Scotland within easy reach. Hire a car and you can be driving along the shores of Loch Lomond or exploring the Trossachs National Park in no time at all.' },
  { city: 'Leeds', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Leeds Bradford Airport', emoji: '🏙️', heroDescription: 'Leeds is a vibrant city in the heart of Yorkshire. Hire a car and the Yorkshire Dales, North York Moors and the stunning Harrogate are all within easy reach.' },
  { city: 'Liverpool', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Liverpool John Lennon Airport', emoji: '🎵', heroDescription: 'Liverpool is one of England\'s most iconic cities. Hire a car and explore the stunning Wirral Peninsula, North Wales coastline and the rolling hills of the Cheshire countryside.' },
  { city: 'Newcastle', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Newcastle International Airport', emoji: '🏟️', heroDescription: 'Newcastle is the gateway to the stunning Northumberland coast and countryside. Hire a car and you can be at Hadrian\'s Wall, the Northumberland National Park or the Farne Islands in no time.' },
  { city: 'Belfast', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Belfast International Airport', emoji: '🏔️', heroDescription: 'Belfast is the perfect starting point for exploring Northern Ireland. Hire a car and the Giant\'s Causeway, the Causeway Coastal Route and the Mourne Mountains are all within easy reach.' },
  { city: 'Cardiff', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Cardiff Airport', emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', heroDescription: 'Cardiff is a brilliant base for exploring Wales. Hire a car and the Brecon Beacons, the Pembrokeshire Coast and Snowdonia National Park are all just a comfortable drive away.' },
  { city: 'Aberdeen', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Aberdeen Airport', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', heroDescription: 'Aberdeen is the gateway to Royal Deeside and the stunning Scottish Highlands. Hire a car and discover whisky distilleries, ancient castles and breathtaking mountain scenery.' },
  { city: 'Inverness', country: 'United Kingdom', countryEmoji: '🇬🇧', airport: 'Inverness Airport', emoji: '🦌', heroDescription: 'Inverness is the capital of the Scottish Highlands and the perfect base for exploring some of the most dramatic scenery in Europe. Loch Ness, Glencoe and Skye are all within easy reach.' },
  // Spain
  { city: 'Barcelona', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Barcelona El Prat Airport', emoji: '🏛️', heroDescription: 'Barcelona is one of Europe\'s greatest cities and a hire car makes it even better. Head up the coast to the Costa Brava, explore the vineyards of Penedes or drive into the Pyrenees for the day.' },
  { city: 'Malaga', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Malaga Costa del Sol Airport', emoji: '🌞', heroDescription: 'Malaga is the gateway to the Costa del Sol and the whole of Andalusia. Pick up your hire car at the airport and within minutes you can be driving along some of Europe\'s most spectacular coastline.' },
  { city: 'Madrid', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Adolfo Suarez Madrid Barajas Airport', emoji: '👑', heroDescription: 'Madrid sits right in the heart of Spain making it a brilliant base for road trips. Toledo, Segovia and the Sierra Nevada mountains are all within easy reach from the Spanish capital.' },
  { city: 'Alicante', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Alicante Elche Airport', emoji: '🏖️', heroDescription: 'Alicante is the perfect base for exploring the Costa Blanca. Hire a car and discover stunning beaches, charming whitewashed villages and the dramatic mountains of the interior.' },
  { city: 'Palma', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Palma de Mallorca Airport', emoji: '🌴', heroDescription: 'Palma is the beautiful capital of Mallorca and a hire car is the best way to explore the island. From the dramatic Serra de Tramuntana mountains to hidden coves and sandy beaches.' },
  { city: 'Seville', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Seville Airport', emoji: '💃', heroDescription: 'Seville is one of Spain\'s most passionate cities. Hire a car and explore the whitewashed villages of Andalusia, the sherry bodegas of Jerez and the stunning natural parks nearby.' },
  { city: 'Valencia', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Valencia Airport', emoji: '🍊', heroDescription: 'Valencia is a vibrant city on Spain\'s Mediterranean coast. Hire a car and discover the stunning natural park of La Albufera, the orange groves of the interior and the beautiful Costa del Azahar.' },
  { city: 'Tenerife', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Tenerife South Airport', emoji: '🌋', heroDescription: 'Tenerife is the largest of the Canary Islands and a hire car is the best way to see it all. From the volcanic landscapes of Teide National Park to the black sand beaches of the south.' },
  { city: 'Gran Canaria', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Gran Canaria Airport', emoji: '🏝️', heroDescription: 'Gran Canaria is a miniature continent with stunning variety. Hire a car and explore the dramatic sand dunes of Maspalomas, the lush pine forests of the interior and the colourful capital Las Palmas.' },
  { city: 'Lanzarote', country: 'Spain', countryEmoji: '🇪🇸', airport: 'Lanzarote Airport', emoji: '🌵', heroDescription: 'Lanzarote is unlike anywhere else on earth. Hire a car and explore the otherworldly volcanic landscapes of Timanfaya, the stunning vineyards of La Geria and the beautiful beaches of the north.' },
  // France
  { city: 'Paris', country: 'France', countryEmoji: '🇫🇷', airport: 'Charles de Gaulle Airport', emoji: '🗼', heroDescription: 'Paris is magnificent on foot but a hire car opens up an entirely different France. The Loire Valley chateaux, the champagne vineyards of Reims and the D-Day beaches of Normandy are all within a comfortable drive.' },
  { city: 'Nice', country: 'France', countryEmoji: '🇫🇷', airport: 'Nice Cote d\'Azur Airport', emoji: '💐', heroDescription: 'Nice is the jewel of the French Riviera and a hire car lets you explore the very best of the Cote d\'Azur. Monaco, Cannes, Antibes and the stunning Gorges du Verdon are all within easy reach.' },
  { city: 'Lyon', country: 'France', countryEmoji: '🇫🇷', airport: 'Lyon Saint Exupery Airport', emoji: '🍷', heroDescription: 'Lyon is France\'s gastronomic capital and a brilliant base for exploring the region. Hire a car and discover the vineyards of Burgundy and Beaujolais, the Alps and the ancient Roman ruins of the area.' },
  { city: 'Marseille', country: 'France', countryEmoji: '🇫🇷', airport: 'Marseille Provence Airport', emoji: '⚓', heroDescription: 'Marseille is France\'s oldest city and a vibrant port on the Mediterranean. Hire a car and explore the stunning Calanques national park, the lavender fields of Provence and the Camargue wetlands.' },
  { city: 'Bordeaux', country: 'France', countryEmoji: '🇫🇷', airport: 'Bordeaux Merignac Airport', emoji: '🍷', heroDescription: 'Bordeaux is the world\'s wine capital and a hire car is the best way to explore the famous vineyards. The Medoc, Saint Emilion and Pomerol are all just a short drive from the elegant city centre.' },
  { city: 'Toulouse', country: 'France', countryEmoji: '🇫🇷', airport: 'Toulouse Blagnac Airport', emoji: '🌸', heroDescription: 'Toulouse is the gateway to the Pyrenees and the Languedoc region. Hire a car and discover the medieval city of Carcassonne, the Canal du Midi and the stunning mountain scenery of the Pyrenees.' },
  // Italy
  { city: 'Rome', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Rome Fiumicino Airport', emoji: '🏛️', heroDescription: 'Italy was made for road trips and Rome is the perfect starting point. Drive through the rolling hills of Tuscany, along the Amalfi Coast or head south towards the ancient temples of Sicily.' },
  { city: 'Milan', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Milan Malpensa Airport', emoji: '👗', heroDescription: 'Milan is Italy\'s fashion and financial capital but a hire car reveals a very different side of the country. Lake Como, Lake Maggiore and the stunning Dolomites are all within easy reach.' },
  { city: 'Venice', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Venice Marco Polo Airport', emoji: '🚤', heroDescription: 'Venice is unique but a hire car lets you explore the wider Veneto region. The rolling Prosecco hills, the stunning Dolomites and the beautiful city of Verona are all just a short drive away.' },
  { city: 'Florence', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Florence Peretola Airport', emoji: '🎨', heroDescription: 'Florence is the birthplace of the Renaissance and the perfect base for exploring Tuscany. Hire a car and discover Siena, San Gimignano, the Chianti wine region and the stunning Val d\'Orcia.' },
  { city: 'Naples', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Naples International Airport', emoji: '🍕', heroDescription: 'Naples is chaotic, vibrant and utterly fascinating. Hire a car and you can explore Pompeii, drive the spectacular Amalfi Coast, visit the island of Capri and discover the stunning Cilento National Park.' },
  { city: 'Palermo', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Palermo Airport', emoji: '🍋', heroDescription: 'Palermo is the fascinating capital of Sicily. Hire a car and explore the Valley of the Temples, Mount Etna, the beautiful Baroque towns of the south east and the stunning beaches of the island.' },
  { city: 'Catania', country: 'Italy', countryEmoji: '🇮🇹', airport: 'Catania Fontanarossa Airport', emoji: '🌋', heroDescription: 'Catania sits in the shadow of Mount Etna and is a brilliant base for exploring Sicily. Hire a car and discover ancient Greek ruins, stunning beaches and some of the most dramatic volcanic scenery in Europe.' },
  // Portugal
  { city: 'Lisbon', country: 'Portugal', countryEmoji: '🇵🇹', airport: 'Humberto Delgado Airport', emoji: '🇵🇹', heroDescription: 'Lisbon is one of Europe\'s most charming capitals and a hire car lets you explore the very best of Portugal. Drive to Sintra, along the Algarve coast or up to the Douro Valley wine region.' },
  { city: 'Porto', country: 'Portugal', countryEmoji: '🇵🇹', airport: 'Francisco Sa Carneiro Airport', emoji: '🍷', heroDescription: 'Porto is one of Europe\'s most romantic cities and the home of port wine. Hire a car and discover the stunning Douro Valley, the beaches of the Minho coast and the ancient pilgrim city of Braga.' },
  { city: 'Faro', country: 'Portugal', countryEmoji: '🇵🇹', airport: 'Faro Airport', emoji: '🏖️', heroDescription: 'Faro is the gateway to the Algarve, Portugal\'s stunning southern coast. Hire a car and explore the dramatic sea caves of Lagos, the golden beaches of Meia Praia and the beautiful Ria Formosa nature reserve.' },
  { city: 'Funchal', country: 'Portugal', countryEmoji: '🇵🇹', airport: 'Madeira Airport', emoji: '🌺', heroDescription: 'Funchal is the capital of Madeira, the stunning island in the Atlantic. Hire a car and explore the dramatic mountain roads, levada walking trails and the breathtaking volcanic scenery of this unique island.' },
  // Greece
  { city: 'Athens', country: 'Greece', countryEmoji: '🇬🇷', airport: 'Athens International Airport', emoji: '🏛️', heroDescription: 'Athens is one of the world\'s great historic cities. Hire a car and explore the stunning Peloponnese, the ancient ruins of Delphi, the beautiful coastline of Attica and the nearby islands of the Saronic Gulf.' },
  { city: 'Heraklion', country: 'Greece', countryEmoji: '🇬🇷', airport: 'Heraklion International Airport', emoji: '🏺', heroDescription: 'Heraklion is the capital of Crete, the largest and most diverse of the Greek islands. Hire a car and discover the Minoan palace of Knossos, the stunning Samaria Gorge and the beautiful beaches of the south coast.' },
  { city: 'Rhodes', country: 'Greece', countryEmoji: '🇬🇷', airport: 'Rhodes International Airport', emoji: '🌹', heroDescription: 'Rhodes is one of the most beautiful islands in the Mediterranean. Hire a car and explore the stunning medieval old town, the ancient ruins of Kameiros and the dramatic Valley of the Butterflies.' },
  { city: 'Corfu', country: 'Greece', countryEmoji: '🇬🇷', airport: 'Corfu International Airport', emoji: '🫒', heroDescription: 'Corfu is one of Greece\'s most beautiful and lush islands. Hire a car and discover the stunning Venetian architecture of the old town, the beautiful beaches of Paleokastritsa and the dramatic mountains of the interior.' },
  { city: 'Thessaloniki', country: 'Greece', countryEmoji: '🇬🇷', airport: 'Thessaloniki Airport', emoji: '🏛️', heroDescription: 'Thessaloniki is Greece\'s second city and a vibrant cultural hub. Hire a car and explore the stunning Mount Olympus, the beautiful Halkidiki peninsula and the ancient royal tombs of Vergina.' },
  // Germany
  { city: 'Munich', country: 'Germany', countryEmoji: '🇩🇪', airport: 'Munich Airport', emoji: '🍺', heroDescription: 'Munich is the gateway to the Bavarian Alps and some of Europe\'s most stunning scenery. Hire a car and discover the fairy tale castle of Neuschwanstein, the beautiful Bavarian lakes and the Austrian border.' },
  { city: 'Berlin', country: 'Germany', countryEmoji: '🇩🇪', airport: 'Berlin Brandenburg Airport', emoji: '🐻', heroDescription: 'Berlin is one of Europe\'s most dynamic and fascinating cities. Hire a car and explore the Brandenburg countryside, the stunning Spreewald biosphere reserve and the historic city of Potsdam.' },
  { city: 'Frankfurt', country: 'Germany', countryEmoji: '🇩🇪', airport: 'Frankfurt Airport', emoji: '🏦', heroDescription: 'Frankfurt is Germany\'s financial capital and a brilliant base for road trips. The Rhine Valley, the medieval town of Heidelberg and the stunning Black Forest are all within easy reach.' },
  { city: 'Hamburg', country: 'Germany', countryEmoji: '🇩🇪', airport: 'Hamburg Airport', emoji: '⚓', heroDescription: 'Hamburg is Germany\'s second city and a vibrant port on the Elbe. Hire a car and explore the stunning Luneburg Heath, the beautiful Baltic Sea coast and the charming city of Lubeck.' },
  { city: 'Dusseldorf', country: 'Germany', countryEmoji: '🇩🇪', airport: 'Dusseldorf Airport', emoji: '🎨', heroDescription: 'Dusseldorf is one of Germany\'s most elegant cities. Hire a car and explore the stunning Rhine Valley, the historic city of Cologne and the beautiful Eifel National Park.' },
  // Netherlands
  { city: 'Amsterdam', country: 'Netherlands', countryEmoji: '🇳🇱', airport: 'Amsterdam Schiphol Airport', emoji: '🌷', heroDescription: 'Amsterdam is a brilliant base for exploring the Netherlands and beyond. Hire a car and the Dutch countryside, Belgian cities and the German Rhine Valley are all within easy striking distance.' },
  { city: 'Rotterdam', country: 'Netherlands', countryEmoji: '🇳🇱', airport: 'Rotterdam The Hague Airport', emoji: '⚓', heroDescription: 'Rotterdam is one of Europe\'s most architecturally exciting cities. Hire a car and explore the stunning tulip fields of the Bollenstreek, the beautiful city of Delft and the North Sea coast.' },
  // Belgium
  { city: 'Brussels', country: 'Belgium', countryEmoji: '🇧🇪', airport: 'Brussels Airport', emoji: '🍫', heroDescription: 'Brussels is the heart of Europe and a fascinating city to explore. Hire a car and discover the medieval city of Bruges, the beautiful city of Ghent and the stunning Ardennes forest.' },
  // Switzerland
  { city: 'Geneva', country: 'Switzerland', countryEmoji: '🇨🇭', airport: 'Geneva Airport', emoji: '⌚', heroDescription: 'Geneva sits on the shores of Lake Geneva and is surrounded by stunning Alpine scenery. Hire a car and explore the French Alps, the Jura mountains and the beautiful wine region of Lavaux.' },
  { city: 'Zurich', country: 'Switzerland', countryEmoji: '🇨🇭', airport: 'Zurich Airport', emoji: '🏔️', heroDescription: 'Zurich is Switzerland\'s largest city and a brilliant base for Alpine adventures. Hire a car and discover the stunning Rhine Falls, the beautiful Lake Constance and the dramatic peaks of the Swiss Alps.' },
  { city: 'Basel', country: 'Switzerland', countryEmoji: '🇨🇭', airport: 'EuroAirport Basel Mulhouse', emoji: '🎨', heroDescription: 'Basel is one of Europe\'s great cultural cities. Hire a car and explore the stunning Black Forest, the beautiful Alsace wine region and the dramatic Jura mountains.' },
  // Austria
  { city: 'Vienna', country: 'Austria', countryEmoji: '🇦🇹', airport: 'Vienna International Airport', emoji: '🎭', heroDescription: 'Vienna is one of Europe\'s most imperial and elegant capitals. Hire a car and explore the stunning Wachau Valley, the beautiful Salzkammergut lake district and the dramatic Alps of the Tyrol.' },
  { city: 'Salzburg', country: 'Austria', countryEmoji: '🇦🇹', airport: 'Salzburg Airport', emoji: '🎵', heroDescription: 'Salzburg is the birthplace of Mozart and one of Europe\'s most beautiful cities. Hire a car and explore the stunning Salzkammergut lakes, the dramatic Berchtesgaden Alps and the beautiful Bavarian countryside.' },
  { city: 'Innsbruck', country: 'Austria', countryEmoji: '🇦🇹', airport: 'Innsbruck Airport', emoji: '🎿', heroDescription: 'Innsbruck is the capital of the Tyrol and one of the most beautiful Alpine cities in Europe. Hire a car and discover world class ski resorts, stunning mountain passes and charming Austrian villages.' },
  // Czech Republic
  { city: 'Prague', country: 'Czech Republic', countryEmoji: '🇨🇿', airport: 'Vaclav Havel Airport Prague', emoji: '🏰', heroDescription: 'Prague is one of Europe\'s most beautiful and best preserved cities. Hire a car and explore the stunning Bohemian countryside, the spa town of Karlovy Vary and the beautiful historic town of Cesky Krumlov.' },
  // Hungary
  { city: 'Budapest', country: 'Hungary', countryEmoji: '🇭🇺', airport: 'Budapest Ferenc Liszt International Airport', emoji: '🌉', heroDescription: 'Budapest is one of Europe\'s most stunning capital cities. Hire a car and explore the beautiful Danube Bend, the rolling hills of the Bukk National Park and the stunning vineyards of the Tokaj wine region.' },
  // Poland
  { city: 'Warsaw', country: 'Poland', countryEmoji: '🇵🇱', airport: 'Warsaw Chopin Airport', emoji: '🏰', heroDescription: 'Warsaw is a city of remarkable resilience and fascinating contrasts. Hire a car and explore the beautiful Mazovian countryside, the stunning Bialowieza Forest and the historic city of Krakow.' },
  { city: 'Krakow', country: 'Poland', countryEmoji: '🇵🇱', airport: 'Krakow John Paul II International Airport', emoji: '👑', heroDescription: 'Krakow is one of Europe\'s most beautiful and best preserved medieval cities. Hire a car and explore the stunning Tatra Mountains, the beautiful Ojcow National Park and the salt mines of Wieliczka.' },
  // Croatia
  { city: 'Dubrovnik', country: 'Croatia', countryEmoji: '🇭🇷', airport: 'Dubrovnik Airport', emoji: '🏰', heroDescription: 'Dubrovnik is one of the most beautiful cities in the Mediterranean. Hire a car and explore the stunning Dalmatian coastline, the beautiful Peljesac peninsula and the dramatic mountains of the hinterland.' },
  { city: 'Split', country: 'Croatia', countryEmoji: '🇭🇷', airport: 'Split Airport', emoji: '🌊', heroDescription: 'Split is a vibrant city built around Diocletian\'s Palace and a brilliant base for exploring Dalmatia. Hire a car and discover the stunning Krka waterfalls, the beautiful Cetina Canyon and the Plitvice Lakes.' },
  { city: 'Zagreb', country: 'Croatia', countryEmoji: '🇭🇷', airport: 'Zagreb Airport', emoji: '🏙️', heroDescription: 'Zagreb is Croatia\'s charming capital and a great base for exploring the country. Hire a car and discover the stunning Plitvice Lakes National Park, the beautiful Zagorje castles and the Slovenian capital Ljubljana.' },
  // Turkey
  { city: 'Istanbul', country: 'Turkey', countryEmoji: '🇹🇷', airport: 'Istanbul Airport', emoji: '🕌', heroDescription: 'Istanbul is one of the world\'s most fascinating cities, straddling two continents. Hire a car and explore the beautiful Bosphorus villages, the stunning Princes Islands and the rolling hills of Thrace.' },
  { city: 'Antalya', country: 'Turkey', countryEmoji: '🇹🇷', airport: 'Antalya Airport', emoji: '🏖️', heroDescription: 'Antalya is the gateway to the stunning Turkish Riviera. Hire a car and discover ancient Lycian ruins, the dramatic Taurus Mountains, the beautiful waterfalls of Duden and the charming harbour town of Kas.' },
  { city: 'Bodrum', country: 'Turkey', countryEmoji: '🇹🇷', airport: 'Milas Bodrum Airport', emoji: '⛵', heroDescription: 'Bodrum is one of Turkey\'s most glamorous destinations. Hire a car and explore the stunning Aegean coastline, the ancient ruins of Ephesus, the beautiful lake of Bafa and the charming village of Gumusluk.' },
  // UAE
  { city: 'Dubai', country: 'UAE', countryEmoji: '🇦🇪', airport: 'Dubai International Airport', emoji: '🏙️', heroDescription: 'Dubai is one of the world\'s most exciting destinations and a hire car lets you explore it on your own terms. From the towering skyscrapers of Downtown to the golden sand dunes of the desert, the city has it all.' },
  { city: 'Abu Dhabi', country: 'UAE', countryEmoji: '🇦🇪', airport: 'Abu Dhabi International Airport', emoji: '🕌', heroDescription: 'Abu Dhabi is the capital of the UAE and a city of extraordinary contrasts. Hire a car and explore the stunning Sheikh Zayed Grand Mosque, the beautiful Liwa Oasis and the incredible Formula 1 circuit on Yas Island.' },
  // USA
  { city: 'New York', country: 'USA', countryEmoji: '🇺🇸', airport: 'John F Kennedy International Airport', emoji: '🗽', heroDescription: 'New York City is incredible but a hire car lets you discover a very different side of America. Drive up the Hudson Valley, explore the Hamptons or head north along the stunning New England coastline.' },
  { city: 'Los Angeles', country: 'USA', countryEmoji: '🇺🇸', airport: 'Los Angeles International Airport', emoji: '🌴', heroDescription: 'Los Angeles and road trips go hand in hand. Cruise Pacific Coast Highway, drive up to Big Sur, explore Joshua Tree National Park or head east to Las Vegas. LA is the ultimate road trip starting point.' },
  { city: 'Miami', country: 'USA', countryEmoji: '🇺🇸', airport: 'Miami International Airport', emoji: '🌊', heroDescription: 'Miami is one of America\'s most vibrant and exciting cities. Hire a car and explore the stunning Florida Keys, the beautiful Everglades National Park and the charming Art Deco district of South Beach.' },
  { city: 'Las Vegas', country: 'USA', countryEmoji: '🇺🇸', airport: 'Harry Reid International Airport', emoji: '🎰', heroDescription: 'Las Vegas is unlike anywhere else on earth. Hire a car and you can escape the Strip to discover the stunning Grand Canyon, the dramatic Valley of Fire, the beautiful Lake Mead and the otherworldly landscape of Zion National Park.' },
  { city: 'Orlando', country: 'USA', countryEmoji: '🇺🇸', airport: 'Orlando International Airport', emoji: '🎢', heroDescription: 'Orlando is the theme park capital of the world but a hire car lets you explore so much more of Florida. The stunning Kennedy Space Center, the beautiful Gulf Coast beaches and the natural springs of the state parks are all within easy reach.' },
  { city: 'San Francisco', country: 'USA', countryEmoji: '🇺🇸', airport: 'San Francisco International Airport', emoji: '🌉', heroDescription: 'San Francisco is one of America\'s most iconic cities. Hire a car and drive across the Golden Gate Bridge, explore the stunning wine country of Napa Valley and Sonoma, or head south along the beautiful Big Sur coastline.' },
  { city: 'Chicago', country: 'USA', countryEmoji: '🇺🇸', airport: "O'Hare International Airport", emoji: '🌬️', heroDescription: 'Chicago is one of America\'s greatest cities. Hire a car and explore the stunning Indiana Dunes, the beautiful Wisconsin Dells, the Great Lakes shoreline and the charming university town of Ann Arbor.' },
  { city: 'Honolulu', country: 'USA', countryEmoji: '🇺🇸', airport: 'Daniel K Inouye International Airport', emoji: '🌺', heroDescription: 'Honolulu is the gateway to the beautiful Hawaiian Islands. Hire a car and explore the stunning North Shore surf beaches, the dramatic Pali Lookout, the beautiful Manoa Valley and the historic Pearl Harbor.' },
  { city: 'Denver', country: 'USA', countryEmoji: '🇺🇸', airport: 'Denver International Airport', emoji: '🏔️', heroDescription: 'Denver is the gateway to the Rocky Mountains. Hire a car and discover Rocky Mountain National Park, the stunning Mesa Verde cliff dwellings, the beautiful Colorado ski resorts and the dramatic Black Canyon of the Gunnison.' },
  { city: 'Seattle', country: 'USA', countryEmoji: '🇺🇸', airport: 'Seattle Tacoma International Airport', emoji: '☕', heroDescription: 'Seattle is one of America\'s most beautiful and dynamic cities. Hire a car and explore the stunning Mount Rainier, the beautiful Olympic Peninsula, the dramatic North Cascades and the charming San Juan Islands.' },
  // Canada
  { city: 'Toronto', country: 'Canada', countryEmoji: '🇨🇦', airport: 'Toronto Pearson International Airport', emoji: '🍁', heroDescription: 'Toronto is Canada\'s largest city and a brilliant base for road trips. Hire a car and discover the stunning Niagara Falls, the beautiful Prince Edward County wine region and the dramatic Georgian Bay.' },
  { city: 'Vancouver', country: 'Canada', countryEmoji: '🇨🇦', airport: 'Vancouver International Airport', emoji: '🏔️', heroDescription: 'Vancouver is one of the world\'s most beautiful cities. Hire a car and explore the stunning Sea to Sky Highway, the beautiful Okanagan wine country, the dramatic Whistler mountains and the stunning Gulf Islands.' },
  { city: 'Montreal', country: 'Canada', countryEmoji: '🇨🇦', airport: 'Montreal Pierre Elliott Trudeau International Airport', emoji: '🎭', heroDescription: 'Montreal is Canada\'s most European city and a vibrant cultural hub. Hire a car and explore the stunning Laurentian Mountains, the beautiful Eastern Townships and the charming city of Quebec.' },
  { city: 'Calgary', country: 'Canada', countryEmoji: '🇨🇦', airport: 'Calgary International Airport', emoji: '🤠', heroDescription: 'Calgary is the gateway to the Canadian Rockies. Hire a car and discover the stunning Banff and Jasper National Parks, the beautiful Columbia Icefield and the dramatic Icefields Parkway.' },
  // Australia
  { city: 'Sydney', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Sydney Kingsford Smith Airport', emoji: '🦘', heroDescription: 'Sydney is the perfect launchpad for an Australian road trip. The Blue Mountains, Hunter Valley wine region and the stunning Royal National Park are all just a short drive from the city centre.' },
  { city: 'Melbourne', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Melbourne Airport', emoji: '🏏', heroDescription: 'Melbourne is Australia\'s cultural capital and one of the world\'s most liveable cities. Hire a car and drive the stunning Great Ocean Road, explore the Yarra Valley wine region and discover the Grampians National Park.' },
  { city: 'Brisbane', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Brisbane Airport', emoji: '🌞', heroDescription: 'Brisbane is the gateway to Queensland\'s stunning natural wonders. Hire a car and explore the beautiful Gold Coast, the stunning Sunshine Coast hinterland and the incredible Glass House Mountains.' },
  { city: 'Perth', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Perth Airport', emoji: '🌊', heroDescription: 'Perth is one of the world\'s most remote yet beautiful cities. Hire a car and discover the stunning Margaret River wine region, the incredible Pinnacles Desert, the beautiful Rottnest Island and the dramatic Kimberley coast.' },
  { city: 'Adelaide', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Adelaide Airport', emoji: '🍷', heroDescription: 'Adelaide is Australia\'s festival city and the gateway to some of the country\'s finest wine regions. Hire a car and explore the Barossa Valley, the Clare Valley, the stunning Flinders Ranges and the beautiful Kangaroo Island.' },
  { city: 'Cairns', country: 'Australia', countryEmoji: '🇦🇺', airport: 'Cairns Airport', emoji: '🐠', heroDescription: 'Cairns is the gateway to the Great Barrier Reef and the stunning Daintree Rainforest. Hire a car and explore the beautiful Atherton Tablelands, the dramatic Cape Tribulation and the charming villages of the Cairns hinterland.' },
  // New Zealand
  { city: 'Auckland', country: 'New Zealand', countryEmoji: '🇳🇿', airport: 'Auckland Airport', emoji: '🌋', heroDescription: 'Auckland is New Zealand\'s largest city and a brilliant base for road trips. Hire a car and explore the stunning Coromandel Peninsula, the beautiful Bay of Islands, the dramatic Northland coastline and the volcanic Tongariro National Park.' },
  { city: 'Queenstown', country: 'New Zealand', countryEmoji: '🇳🇿', airport: 'Queenstown Airport', emoji: '🏔️', heroDescription: 'Queenstown is the adventure capital of the world and one of the most beautiful places on earth. Hire a car and explore the stunning Fiordland National Park, the beautiful Otago Peninsula and the dramatic Crown Range.' },
  { city: 'Christchurch', country: 'New Zealand', countryEmoji: '🇳🇿', airport: 'Christchurch Airport', emoji: '🌿', heroDescription: 'Christchurch is the gateway to the South Island and one of New Zealand\'s most fascinating cities. Hire a car and explore the stunning Arthur\'s Pass, the beautiful Akaroa Peninsula and the dramatic Banks Peninsula.' },
  // Japan
  { city: 'Tokyo', country: 'Japan', countryEmoji: '🇯🇵', airport: 'Tokyo Narita International Airport', emoji: '🗼', heroDescription: 'Tokyo is one of the world\'s most extraordinary cities. Hire a car and explore the beautiful temples of Nikko, the stunning Mount Fuji, the charming city of Hakone and the beautiful Izu Peninsula.' },
  { city: 'Osaka', country: 'Japan', countryEmoji: '🇯🇵', airport: 'Osaka Kansai International Airport', emoji: '🏯', heroDescription: 'Osaka is Japan\'s foodie capital and a brilliant base for exploring the Kansai region. Hire a car and discover the ancient temples of Kyoto, the beautiful deer park of Nara and the stunning Kii Peninsula.' },
  { city: 'Sapporo', country: 'Japan', countryEmoji: '🇯🇵', airport: 'New Chitose Airport', emoji: '❄️', heroDescription: 'Sapporo is the capital of Hokkaido and a brilliant base for exploring Japan\'s northernmost island. Hire a car and discover the stunning Shikotsu Toya National Park, the beautiful lavender fields of Furano and the dramatic Daisetsuzan mountains.' },
  // Thailand
  { city: 'Bangkok', country: 'Thailand', countryEmoji: '🇹🇭', airport: 'Suvarnabhumi Airport', emoji: '🛕', heroDescription: 'Bangkok is one of Asia\'s most exciting and vibrant cities. Hire a car and explore the beautiful ancient capital of Ayutthaya, the stunning Khao Yai National Park and the charming river towns of the central plains.' },
  { city: 'Chiang Mai', country: 'Thailand', countryEmoji: '🇹🇭', airport: 'Chiang Mai International Airport', emoji: '🌿', heroDescription: 'Chiang Mai is the cultural capital of northern Thailand. Hire a car and explore the stunning Doi Inthanon National Park, the beautiful golden triangle, the charming hill tribe villages and the dramatic Mae Hong Son loop.' },
  { city: 'Phuket', country: 'Thailand', countryEmoji: '🇹🇭', airport: 'Phuket International Airport', emoji: '🏖️', heroDescription: 'Phuket is Thailand\'s most famous island and a brilliant base for exploring the Andaman coast. Hire a car and discover the stunning Phang Nga Bay, the beautiful Khao Sok National Park and the charming old town of Phuket.' },
  // Indonesia
  { city: 'Bali', country: 'Indonesia', countryEmoji: '🇮🇩', airport: 'Ngurah Rai International Airport', emoji: '🌺', heroDescription: 'Bali is one of the world\'s most magical destinations. Hire a car and explore the stunning rice terraces of Tegalalang, the beautiful temples of Tanah Lot and Uluwatu, the dramatic volcano of Mount Batur and the charming town of Ubud.' },
  // Singapore
  { city: 'Singapore', country: 'Singapore', countryEmoji: '🇸🇬', airport: 'Singapore Changi Airport', emoji: '🌿', heroDescription: 'Singapore is one of Asia\'s most extraordinary cities. Hire a car and explore the beautiful botanic gardens, the stunning Sentosa Island and use the city as a base for day trips to the beautiful islands of Indonesia and the stunning Cameron Highlands of Malaysia.' },
  // South Africa
  { city: 'Cape Town', country: 'South Africa', countryEmoji: '🇿🇦', airport: 'Cape Town International Airport', emoji: '🏔️', heroDescription: 'Cape Town is one of the world\'s most beautiful cities. Hire a car and drive the stunning Cape Peninsula, explore the beautiful winelands of Stellenbosch and Franschhoek, and discover the dramatic Garden Route.' },
  { city: 'Johannesburg', country: 'South Africa', countryEmoji: '🇿🇦', airport: 'OR Tambo International Airport', emoji: '🦁', heroDescription: 'Johannesburg is the gateway to the best of South Africa. Hire a car and explore the magnificent Kruger National Park, the stunning Drakensberg mountains, the beautiful Sun City resort and the historic Apartheid Museum.' },
  // Morocco
  { city: 'Marrakech', country: 'Morocco', countryEmoji: '🇲🇦', airport: 'Marrakech Menara Airport', emoji: '🕌', heroDescription: 'Marrakech is one of the world\'s most vibrant and exotic cities. Hire a car and explore the stunning Atlas Mountains, the beautiful Ourika Valley, the dramatic Ait Benhaddou kasbah and the vast Sahara Desert.' },
  { city: 'Casablanca', country: 'Morocco', countryEmoji: '🇲🇦', airport: 'Mohammed V International Airport', emoji: '🌊', heroDescription: 'Casablanca is Morocco\'s economic capital and a fascinating blend of old and new. Hire a car and explore the stunning Hassan II Mosque, the beautiful coastal town of Essaouira and the ancient imperial city of Fes.' },
  // Mexico
  { city: 'Cancun', country: 'Mexico', countryEmoji: '🇲🇽', airport: 'Cancun International Airport', emoji: '🏖️', heroDescription: 'Cancun is much more than its famous hotel strip. Hire a car and you can explore ancient Mayan ruins at Chichen Itza, swim in crystal clear cenotes and discover the hidden beaches of the Riviera Maya.' },
  { city: 'Mexico City', country: 'Mexico', countryEmoji: '🇲🇽', airport: 'Mexico City International Airport', emoji: '🏙️', heroDescription: 'Mexico City is one of the world\'s great metropolises. Hire a car and explore the stunning pyramids of Teotihuacan, the beautiful colonial city of Puebla, the floating gardens of Xochimilco and the charming town of Cuernavaca.' },
  { city: 'Los Cabos', country: 'Mexico', countryEmoji: '🇲🇽', airport: 'Los Cabos International Airport', emoji: '🌵', heroDescription: 'Los Cabos is one of Mexico\'s most glamorous destinations. Hire a car and explore the stunning arch of El Arco, the beautiful Todos Santos, the dramatic Sierra de la Laguna mountains and the wild Pacific coastline.' },
  // Brazil
  { city: 'Rio de Janeiro', country: 'Brazil', countryEmoji: '🇧🇷', airport: 'Rio de Janeiro Galeao International Airport', emoji: '🏖️', heroDescription: 'Rio de Janeiro is one of the world\'s most spectacular cities. Hire a car and explore the stunning Costa Verde, the beautiful historic town of Petropolis, the dramatic Serra dos Orgaos National Park and the charming colonial city of Paraty.' },
  { city: 'Sao Paulo', country: 'Brazil', countryEmoji: '🇧🇷', airport: 'Sao Paulo Guarulhos International Airport', emoji: '🏙️', heroDescription: 'Sao Paulo is one of the world\'s great cities. Hire a car and explore the stunning Atlantic Forest, the beautiful coastal town of Ubatuba, the charming colonial city of Embu das Artes and the breathtaking Iguazu Falls.' },
  // Argentina
  { city: 'Buenos Aires', country: 'Argentina', countryEmoji: '🇦🇷', airport: 'Buenos Aires Ezeiza International Airport', emoji: '💃', heroDescription: 'Buenos Aires is one of South America\'s most sophisticated and vibrant cities. Hire a car and explore the beautiful pampas, the stunning wine region of Mendoza, the dramatic Iguazu Falls and the enchanting Uruguayan capital Montevideo.' },
  // Colombia
  { city: 'Bogota', country: 'Colombia', countryEmoji: '🇨🇴', airport: 'El Dorado International Airport', emoji: '🌿', heroDescription: 'Bogota is one of South America\'s most dynamic and surprising capitals. Hire a car and explore the stunning Salt Cathedral of Zipaquira, the beautiful Villa de Leyva, the dramatic Chicamocha Canyon and the beautiful coffee region of Salento.' },
  { city: 'Medellin', country: 'Colombia', countryEmoji: '🇨🇴', airport: 'Jose Maria Cordova International Airport', emoji: '🌸', heroDescription: 'Medellin is Colombia\'s most innovative city and a brilliant base for exploring the Andes. Hire a car and discover the beautiful Guatape reservoir, the stunning Paramo de Belmira and the charming colonial town of Santa Fe de Antioquia.' },
  // Peru
  { city: 'Lima', country: 'Peru', countryEmoji: '🇵🇪', airport: 'Jorge Chavez International Airport', emoji: '🦙', heroDescription: 'Lima is one of South America\'s great cities. Hire a car and explore the stunning Paracas National Reserve, the mysterious Nazca Lines, the beautiful Ica desert and the charming colonial city of Arequipa.' },
  // India
  { city: 'Delhi', country: 'India', countryEmoji: '🇮🇳', airport: 'Indira Gandhi International Airport', emoji: '🕌', heroDescription: 'Delhi is one of the world\'s great historic cities. Hire a car and explore the stunning Taj Mahal in Agra, the beautiful pink city of Jaipur, the sacred ghats of Varanasi and the magnificent temples of Khajuraho.' },
  { city: 'Mumbai', country: 'India', countryEmoji: '🇮🇳', airport: 'Chhatrapati Shivaji Maharaj International Airport', emoji: '🎬', heroDescription: 'Mumbai is India\'s most vibrant and cosmopolitan city. Hire a car and explore the beautiful hill stations of Lonavala and Mahabaleshwar, the stunning Elephanta Caves, the dramatic Sahyadri mountains and the charming town of Pune.' },
  { city: 'Goa', country: 'India', countryEmoji: '🇮🇳', airport: 'Goa International Airport', emoji: '🏖️', heroDescription: 'Goa is India\'s most popular beach destination. Hire a car and explore the beautiful spice plantations, the stunning waterfalls of Dudhsagar, the historic Portuguese forts and the charming villages of the hinterland.' },
]

async function seedLocations() {
  console.log('Starting to seed locations...')

  for (const location of locations) {
    const citySlug = location.city.toLowerCase().replace(/ /g, '-')
    const countrySlug = location.country.toLowerCase().replace(/ /g, '-')

    const existing = await client.fetch(
      `*[_type == "location" && slug.current == $citySlug][0]`,
      { citySlug }
    )

    if (existing) {
      console.log(`Skipping ${location.city} - already exists`)
      continue
    }

    const doc = {
      _type: 'location',
      city: location.city,
      country: location.country,
      countryEmoji: location.countryEmoji,
      airport: location.airport,
      emoji: location.emoji,
      heroDescription: location.heroDescription,
      slug: {
        _type: 'slug',
        current: citySlug,
      },
      countrySlug: {
        _type: 'slug',
        current: countrySlug,
      },
    }

    try {
      await client.create(doc)
      console.log(`Created: ${location.city}, ${location.country}`)
    } catch (error) {
      console.error(`Failed to create ${location.city}:`, error)
    }
  }

  console.log('Done!')
}

seedLocations()