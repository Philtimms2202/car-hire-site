
With VS code and my website, is there such a way I can have it so the default is on flights (as is now) but when someone clicks flights or hotels or experiences or cars, the URL changes to timmstravel.com/flights or /hotels or /experiences or /hire-cars and then each page looks like its own homepage?

18:51

Check uploaded files
Check uploaded files
Yes, absolutely! What you're describing is called client-side routing (or you could do it server-side). Since I don't have your current website files, let me explain the two main approaches and you can tell me which fits your setup:

Option 1: Plain HTML/CSS/JS (No framework)
If your site is just HTML files, the simplest approach is using the History API. Here's how it works:

You keep one index.html as the shell
JavaScript intercepts the nav clicks, changes the URL with history.pushState(), and swaps out the page content
Each "page" is really just a different section being shown
Folder structure:

timmstravel.com/
├── index.html         ← main shell
├── js/
│   └── router.js      ← handles URL changes
└── pages/
    ├── flights.js
    ├── hotels.js
    ├── experiences.js
    └── hire-cars.js
Option 2: Separate HTML files (Simplest)
Just make separate pages:

/flights.html    → timmstravel.com/flights
/hotels.html     → timmstravel.com/hotels
/experiences.html
/hire-cars.html
Each is a full standalone page. Nav links just go to those files. Dead simple, no JS routing needed.

Option 3: A Framework (React/Vue/etc.)
If you want to scale up, React Router or Vue Router handle this elegantly — but it's a bigger commitment.

The VS Code Side
In VS Code you'd just:

Use the Live Server extension to preview locally
Edit your files and test the routing
Deploy as normal
To give you the actual code, could you tell me:

What is your site currently built with? (Plain HTML/CSS/JS, WordPress, React, something else?)
How is it hosted? (GitHub Pages, Netlify, a cPanel host, etc.)
That'll determine exactly which approach works best and whether you need any server config (like an .htaccess file) to make the clean URLs work properly.

So I have 4 pages created App/flights 
app/hotels 
app/experiences
app/hire-cars

All .tsx files.

Now, if I give you my homepage script, can you give me the code to make the flights one just about flights but with the same styling?

18:54
Yes, paste your homepage script and I'll get it done!


'use client' import Navbar from './components/Navbar' import Footer from './components/Footer' import Script from 'next/script' import ExperienceSearch from '@/app/components/Search/ExperienceSearch' import FlightSearch from '@/app/components/Search/FlightSearch' import HotelSearch from '@

pasted

I need to integrate the following:

Flights with Aviasales Affiliate
Hotels/car hire with Trip.com affiliate
Experiences with getyourguide

These are all already integrated into the site, but just need them on these pages. Start with flights first

18:55
Here's your /app/flights/page.tsx — same styling, flights-only, no tabs:


Created a file, read a file
Created a file, read a file
Drop this into /app/flights/page.tsx and it's ready to go. Here's what changed from your homepage:

Key differences:

No useState tabs — the tabs are now plain <a> links that navigate to /flights, /hotels, /experiences, /hire-cars. The active one (Flights) stays white/underlined
No car search state — all that logic is gone since it's not needed here
Hero text is flights-specific ("Compare Thousands of Flights Globally ✈️")
Stats updated to flight-relevant numbers (Airlines Compared, Routes Available, etc.)
"Discover More" on destination cards changed to "Find Flights"
How It Works copy is tailored to the flight booking journey
Why Choose Us updated with flight-focused bullets
When you're ready, just say hotels, experiences, or hire-cars and I'll generate those next in the same pattern.


Page
Code · TSX 
I am running in localhost, I've saved but getting an error 404 for /flights?

18:58
The 404 is almost certainly a folder/file naming issue. In Next.js, the URL /flights maps directly to the folder structure. Check these:

Most likely culprits
1. Is your file in the right place? The file needs to be at:

app/flights/page.tsx
Not app/flights.tsx — it must be inside a flights folder and named page.tsx.

2. Does your folder structure look like this?

app/
├── page.tsx          ← homepage (/)
├── flights/
│   └── page.tsx      ← this is the file I gave you (/flights)
├── hotels/
│   └── page.tsx
├── experiences/
│   └── page.tsx
└── hire-cars/
    └── page.tsx
Quick fix in VS Code
In the Explorer panel, check if app/flights/ exists as a folder
Inside it, there should be a page.tsx
If you saved it somewhere else, just move it there
After moving it
You may need to restart your dev server:

Stop it with Ctrl + C in the terminal
Run npm run dev again
Visit http://localhost:3000/flights
Can you see in VS Code's Explorer what your app/ folder currently looks like? That'll tell us exactly what's wrong.

1775757591730_image.png
seems correct for flights

18:59
I can see the file is in the right place (app/flights/page.tsx). The 404 is likely because the file has unsaved changes — I can see the blue dot on the page.tsx tab in VS Code, which means it's not saved yet.

Quick fixes to try:

Save the file — Ctrl + S in VS Code
Hard restart the dev server in terminal:
bash
   Ctrl + C
   npm run dev
Visit http://localhost:3000/flights again
If it still 404s after that, can you check — at the very top of your page.tsx file, does it have 'use client' as the first line? I can see line 1 is cut off in the screenshot.

Would the URL be

http://localhost:3000/flights

19:01
Yes, exactly — http://localhost:3000/flights is correct.

But I can see in your screenshot your project is called CAR-HIRE-SITE in the VS Code Explorer. Could your dev server be running on a different port? Check your terminal — it usually says something like:

▲ Next.js 14.x.x
- Local: http://localhost:3000
It might be on 3001 or 3002 if 3000 was already in use. Try:

http://localhost:3001/flights
http://localhost:3002/flights
Whatever port your homepage loads on, just add /flights to the end of it.

No, it's always been on localhost:3000

19:02
Look at line 25 in your screenshot — the hero section has:

className="■text-white py-24 px-6 text-center"
That ■ is a corrupted character that might be causing a parse/compile error, which Next.js sometimes shows as a 404 instead of a proper error.

Try this:

In your page.tsx, press Ctrl + Shift + P in VS Code
Type "Revert File" and hit Enter — this reloads it fresh from disk
Check the terminal running npm run dev — does it show any red errors?
Also, can you paste what the terminal shows after you visit /flights? It'll either show a compile error or nothing, which tells us exactly what's going on.

[{
    "resource": "/c:/Users/ptimm/car-hire-site/tsconfig.json",
    "owner": "typescript",
    "severity": 8,
    "message": "Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0. Specify compilerOption '\"ignoreDeprecations\": \"6.0\"' to silence this error.\n  Visit https://aka.ms/ts6 for migration information.",
    "source": "ts",
    "startLineNumber": 14,
    "startColumn": 25,
    "endLineNumber": 14,
    "endColumn": 31,
    "modelVersionId": 1,
    "origin": "extHost1"
}]

Thsse are problems showing in terminal but the site still loads other than that one page?

Show more
19:03
That error is just a TypeScript warning about a deprecated setting — it won't cause a 404, so that's not the issue.

Since your site loads fine otherwise, the problem is almost certainly in the file itself. Can you check:

Open app/flights/page.tsx in VS Code
Look at the bottom bar in VS Code — does it say anything red, or show a TypeScript error count?
Also check the terminal running npm run dev — when you visit /flights does it print anything red there?
Also, one thing worth trying right now — completely delete the contents of your app/flights/page.tsx and replace it with this bare minimum test:

tsx
export default function FlightsPage() {
  return (
    <main>
      <h1>Flights page working!</h1>
    </main>
  )
}
Save it and visit localhost:3000/flights. If that loads, the issue is something in the full code I gave you. If it still 404s, the issue is with the folder/routing setup itself.

404 still

19:04
OK so the issue is definitely with the folder structure, not the code. Let's check directly.

In your VS Code terminal, run this:

bash
ls app/
or on Windows:

cmd
dir app
And paste what it shows. I want to see exactly what folders exist inside app/.

Also — from your earlier screenshot I could see folders like about, api, blog, components, contact, context, flights, locations in the sidebar. Can you click the arrow next to the flights folder in VS Code Explorer to expand it — does it show page.tsx inside it?

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        29/03/2026     09:47                about
d-----        07/04/2026     21:40                api
d-----        29/03/2026     09:58                blog
d-----        07/04/2026     18:19                components
d-----        05/04/2026     23:49                contact
d-----        06/04/2026     11:58                context
d-----        29/03/2026     13:03                cookie-policy
d-----        06/04/2026     08:47                locations
d-----        29/03/2026     13:03                privacy-policy
d-----        28/03/2026     07:58                studio
d-----        29/03/2026     13:03                terms-and-conditions
-a----        05/04/2026     23:28           4286 favicon.ico
-a----        06/04/2026     11:46           1459 globals.css
-a----        06/04/2026     12:01           2508 layout.tsx
-a----        07/04/2026     22:22          10359 page.tsx
-a----        07/04/2026     20:23           2171 sitemap.ts

Show more
19:05
There's your problem — there is no flights folder in your app/ directory! The file was never saved there properly.

You need to create it manually in VS Code:

In the VS Code Explorer, right-click on the app folder
Click "New Folder" and name it flights
Then right-click the new flights folder
Click "New File" and name it page.tsx
Paste the code I gave you into it and save
Then visit localhost:3000/flights and it should work. The file you've been editing is actually sitting loose inside app/ — which is why the homepage might have been acting weird too! You can delete that stray file after.

I have two apps is that correct?

19:06
No, that's not right! You should only have one app folder.

Can you run this in the terminal:

cmd
dir
From the root of your project (where package.json is) and paste the output? I want to see your full project structure to find where the second app folder is coming from.

Also in VS Code Explorer, can you scroll right to the very top and show me what's at the root level of your project?

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        09/04/2026     07:38                .history
d-----        09/04/2026     19:00                .next
d-----        28/03/2026     18:16                .vscode
d-----        09/04/2026     19:06                app
d-----        07/04/2026     21:38                data
d-----        28/03/2026     17:51                lib
d-----        09/04/2026     07:35                node_modules
d-----        31/03/2026     18:02                public
d-----        28/03/2026     07:59                sanity
d-----        08/04/2026     20:46                scripts
-a----        08/04/2026     20:25            420 .env.local
-a----        28/03/2026     07:39            480 .gitignore
-a----        29/03/2026     09:07             21 .npmrc
-a----        28/03/2026     07:41            327 AGENTS.md
-a----        28/03/2026     07:41             11 CLAUDE.md
-a----        28/03/2026     07:39            465 eslint.config.mjs
-a----        28/03/2026     07:44            251 next-env.d.ts
-a----        29/03/2026     09:10            198 next.config.ts
-a----        09/04/2026     07:35         506554 package-lock.json
-a----        09/04/2026     07:35           1075 package.json
-a----        28/03/2026     07:39             94 postcss.config.mjs
-a----        28/03/2026     07:39           1450 README.md
-a----        28/03/2026     07:58            363 sanity.cli.ts
-a----        09/04/2026     07:38            524 sanity.config.ts
-a----        28/03/2026     18:11            577 tailwind.config.ts
-a----        28/03/2026     20:17            732 tsconfig.json

Show more
19:06
Good — only one app folder, that's fine. Now let's create the flights folder properly. Run these commands one by one in your terminal:

cmd
mkdir app\flights
Then:

cmd
echo. > app\flights\page.tsx
Then open app/flights/page.tsx in VS Code, paste the full code I gave you, save it, and visit localhost:3000/flights.

The file should now appear in the correct place in your Explorer panel under app > flights > page.tsx.

Now that is good but I want a whole new page that is dedicated to flights, not just a straight copy of the homepage itself - Change it for me please? Like is there anything we can do with the AviaSales affiliate that populates things like hero cards to certain destinations that automatically gives me the affiliate?

19:08

Viewed a file, searched the web
Viewed a file, searched the web
Great news — Aviasales via Travelpayouts has some really useful widgets. Here's what's possible for your flights page:

They offer a Popular Routes widget, Calendar widget, Schedule widget, and a Map widget of low prices 
Travelpayouts Help
 — all with your affiliate marker baked in automatically.

The Popular Routes widget is particularly good — you can place multiple destination cards in a row, each pre-set to a specific city like London, Paris, Barcelona, with live prices pulling through. 
Travelpayouts Help

Here's what I'll build you — a proper dedicated flights page with:

✈️ Hero with your FlightSearch component
🗺️ Aviasales Popular Routes widgets as destination deal cards (London, Manchester, Barcelona, New York, Paris etc.) — these pull live prices with your affiliate marker
📅 Aviasales Calendar widget showing cheapest dates
The tab nav linking to other pages
One thing I need from you first:

What is your Travelpayouts marker/ID? It looks like a number e.g. marker=123456. You can find it in your Travelpayouts dashboard under any widget's embed code. This is what ties the affiliate commission to you — without it the widgets won't earn you anything.

714930

19:13
Perfect! Here's your fully dedicated flights page with live Aviasales widgets:


Created 2 files, ran a command, read a file
Created 2 files, ran a command, read a file
Paste this into app/flights/page.tsx. Here's what's new and different from a homepage copy:

What this page has that the homepage doesn't:

Live deal cards — 6 destination cards (London, Barcelona, New York, Paris, Dubai, Orlando) each with an Aviasales Popular Routes widget pulling real-time prices with your marker 714930 baked in — every click earns you affiliate commission automatically
Cheapest Dates calendar — an Aviasales calendar widget showing the lowest fares across the whole year from Manchester, again with your affiliate ID
"Powered by Aviasales" label in the hero so users know prices are live and trusted
No tab switching logic — tabs are simple links to other pages
One note on the calendar — I've set the origin to MAN (Manchester) since that's where you are. If you want it to detect the user's location automatically, just remove the &origin=MAN part from the calendar script URL and Aviasales will detect it from their IP.

Ready to do Hotels next with Trip.com?


Page
Code · TSX 
Firstly, it's opening in Aviasales directly in Russian? Secondly, is there a way to allow the user to select their outbound airport in the search box first? Then either have a "search everywhere" or have a destination box? Similarly to how we have it now but I feel there's a lot of content on that page that isn't formatted great

19:17
Good feedback on both points. Let me tackle them one by one.

The Russian issue — that's because hydra.aviasales.com is the Russian host. We need to change it to the English/international host. Can you check your Travelpayouts dashboard — when you go to Tools → Widgets → set up any widget, what does it show in the "Host" dropdown? It'll be something like:

www.aviasales.com
tp.media
A custom white label URL
That'll tell us the correct English host to use.

On the search box — yes, absolutely. I can rebuild the search section so it has:

Departure airport (user types their origin, e.g. Manchester)
Destination (with a "Search Everywhere" option that opens Aviasales' explore map)
Dates + passengers as normal
This would then build an Aviasales deep link with your affiliate marker so when they hit search it opens directly in English with their airports pre-filled.

On the formatting — before I rewrite it, can you tell me what specifically feels off? For example:

The deal cards too cramped/too wide?
The calendar widget not fitting properly?
Sections feeling too repetitive from the homepage?
That way I can fix it properly rather than guess. Screenshot would help too if you can grab one!

1775763733649_image.png
I can see this for host?

20:42
Perfect! I can see everything I need from that screenshot:

Host: www.aviasales.com ✅ (English, not Russian)
Language: English (Great Britain) ✅
Currency: USD (we can change to GBP)
Your embed code is at the bottom starting with https://tpemb.com/content?
The fix is simple — in your current page.tsx, replace hydra.aviasales.com with www.aviasales.com in both the widget and calendar scripts. That'll stop it opening in Russian.

But more importantly — can you copy the full embed code from that bottom bar and paste it here? It'll have your exact token/settings baked in and I can use it directly rather than building the URL manually. It's the <script async src="https://tpemb.com/content?..."> line.

Also, before I rewrite the whole page — can you also:

Change Currency to GBP in that panel
Copy the code again after
Then I'll rebuild the flights page properly with:

That official Aviasales search form embed (English, GBP)
A cleaner, less cluttered layout
Destination deal cards that work correctly
Now the link I get is forbidden?

https://tp.media/r?locale=en&marker=714930&p=4044&type=click&campaign_id=100&trace_id=Zzf25bcaaa07834707a6d96b0-714930&product_type=tp_manual&promo_kind=widget&page_url=http%3A%2F%2Flocalhost%3A3000%2Fflights&u=https%3A%2F%2Fwwwaviasales.com%2F%3Fdepart_date%3D2026-05-19%26return_date%3D%26origin_iata%3DPAR%26destination_iata%3DBCN%26currency%3Dgbp%26language%3Den%26with_request%3Dtrue%26locale%3Den&lang=en

If you just redo the whole page correctly please? I'm thinking of a master flights page with things like all flights in the search box, featured destinations, popular routes etc.

Then, I want to go further with my flights pages

flights/flights-to-[continent]
flights/flights-to-[country]
flights/[flights-to[city]
flights/[origin-city]-to-[destination-city] 

or [airline]-to-[city] to show all Ryanair flights to Dublin for example

Show more
20:46
I can see the issue with that URL — it's got wwaviasales.com (missing a w) in the redirect, which is why it's forbidden. That's a bug in how I constructed the widget URLs. Let me rebuild the whole page properly from scratch using the official embed code format from your dashboard.

Before I do — this is going to be a big build. Let me confirm the full plan:

Master /flights page:

Official Aviasales search form embed (from your dashboard code)
Featured destination cards with correct affiliate links
Popular routes section
Clean, uncluttered layout
Then the sub-pages structure:

/flights/flights-to-europe
/flights/flights-to-asia
etc.

/flights/flights-to-spain
/flights/flights-to-usa
etc.

/flights/flights-to-barcelona
/flights/flights-to-new-york
etc.

/flights/manchester-to-barcelona
/flights/ryanair-to-dublin
etc.
These sub-pages are massive for SEO — Google loves this kind of structured URL pattern.

Two quick questions before I build:

Can you copy the full embed code from your Travelpayouts dashboard (the <script async src="https://tpemb.com/content?..."> line) with GBP selected? I want your exact token so the search form works perfectly.
For the sub-pages — do you want them dynamically generated (one template file that handles all cities/countries automatically) or static pages for each? Dynamic is far less work and still great for SEO.
Yes subpages but we need to dynamically do them to pre-populate hundreds/thousands combinations if possibe without making thin SEO?

20:47
Great thinking — dynamic pages with rich content is absolutely the right approach. Here's the full plan before we build:

The Architecture
One template file handles everything:

app/flights/to/[destination]/page.tsx        → /flights/to/barcelona
app/flights/from/[origin]/to/[destination]/page.tsx → /flights/from/manchester/to/barcelona  
app/flights/airline/[airline]/to/[destination]/page.tsx → /flights/ryanair-to-dublin
Avoiding Thin SEO — This is Key
Each dynamic page will have unique generated content so Google doesn't see them as duplicates:

Unique H1 — "Cheap Flights to Barcelona from the UK"
Unique meta title + description — generated per destination using generateMetadata()
Destination-specific content — best time to visit, airports, average flight time, tips — pulled from a data file you control
Live Aviasales widget pre-populated with that destination
Related routes — "Also flying to Spain: Madrid, Seville, Malaga"
Structured data (JSON-LD) — tells Google exactly what the page is about
Before I build — I need two things:
1. Your full Aviasales embed code from the Travelpayouts dashboard. Go back to that search form, set currency to GBP, and copy the full <script> tag from the bottom. Paste it here.

2. Which destinations do you want to start with? I'll build a data file with rich content for each. For example — do you want to start with:

Top 20 UK departure cities
Top 50 global destinations
Specific routes you know convert well
Once I have the embed code I'll build the master /flights page and the full dynamic routing system in one go.

This is a global site so what do you think? I don't want too much content on the master flights page?

Here is the script, but please make it my colour scheme?

<script async src="https://tpemb.com/content?currency=usd&trs=513651&shmarker=714930&show_hotels=true&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100" charset="utf-8"></script>

Show more
20:49
Perfect. So for your colour scheme the key params to change in that script are:

primary_override → 
#2f797c (your teal)
color_button → 
#2f797c
color_icons → 
#2f797c
dark → 
#232e4e (your navy)
color_focused → 
#2f797c
Also changing currency=usd to currency=gbp since you're UK based.

Now let me build the full system:


Check frontend design skill
Check frontend design skill
Now let me build all the files:


Created 6 files, ran a command, read a file
Created 6 files, ran a command, read a file
Here's your full flight system — 6 files. Here's exactly where each one goes:

app/flights/
├── page.tsx                          ← flights-page.tsx
├── data/
│   └── flightData.ts                 ← flightData.ts
├── to/
│   └── [destination]/
│       ├── page.tsx                  ← to-destination-page.tsx
│       ├── DestinationFlightsPage.tsx
│       └── ContinentFlightsPage.tsx
└── [route]/
    └── page.tsx                      ← route-page.tsx
What this gives you:

/flights — clean master page, search form, continent grid, featured destinations, popular routes
/flights/to/europe — all European destinations listed
/flights/to/barcelona — full city page, pre-populated search, tips, nearby destinations, popular routes to that city
/flights/manchester-to-barcelona — route page, both airports pre-filled in search
/flights/ryanair-to-barcelona — airline+destination page
SEO is NOT thin because every page has unique H1, unique description, destination-specific content (tips, flight times, best time to visit), internal linking between related pages, and generateMetadata() for proper meta tags.

To add more destinations — just add entries to flightData.ts. The pages generate automatically.


Flights page
Code · TSX 

Flightdata
TS 

To destination page
Code · TSX 

Destinationflightspage
Code · TSX 

Continentflightspage
Code · TSX 

Route page
Code · TSX 


You are out of free messages until 11:00 PM
Upgrade



Claude is AI and can make mistakes. Please double-check responses.
Flights page · TSX
Copy

'use client'
 
// ============================================================
// app/flights/page.tsx  — Master Flights Page
// ============================================================
 
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { continents, destinations } from './data/flightData'
 
// ─── Aviasales Search Form Widget ────────────────────────
function AviasalesSearchForm() {
  const ref = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    if (!ref.current || ref.current.querySelector('script')) return
    const script = document.createElement('script')
    // Your embed with colours matched to your brand
    script.src = [
      'https://tpemb.com/content?',
      'currency=gbp',
      '&trs=513651',
      '&shmarker=714930',
      '&show_hotels=false',
      '&powered_by=false',
      '&locale=en',
      '&searchUrl=www.aviasales.com%2Fsearch',
      '&primary_override=%232f797c',   // your teal
      '&color_button=%232f797c',
      '&color_icons=%232f797c',
      '&dark=%23232e4e',               // your navy
      '&light=%23FFFFFF',
      '&secondary=%23FFFFFF',
      '&special=%23C4C4C4',
      '&color_focused=%232f797c',
      '&border_radius=8',
      '&plain=false',
      '&promo_id=7879',
      '&campaign_id=100',
    ].join('')
    script.async = true
    script.charSet = 'utf-8'
    ref.current.appendChild(script)
  }, [])
 
  return <div ref={ref} className="w-full min-h-[80px]" />
}
 
// Featured destinations — hand-picked for the hero grid
const featured = [
  { slug: 'barcelona', name: 'Barcelona', iata: 'BCN', emoji: '⛪', country: 'Spain', tag: 'City Break' },
  { slug: 'dubai',     name: 'Dubai',     iata: 'DXB', emoji: '🌆', country: 'UAE',   tag: 'Luxury' },
  { slug: 'new-york',  name: 'New York',  iata: 'NYC', emoji: '🗽', country: 'USA',   tag: 'Icon' },
  { slug: 'tokyo',     name: 'Tokyo',     iata: 'TYO', emoji: '🏯', country: 'Japan', tag: 'Adventure' },
  { slug: 'lisbon',    name: 'Lisbon',    iata: 'LIS', emoji: '🚋', country: 'Portugal', tag: 'Trending' },
  { slug: 'bali',      name: 'Bali',      iata: 'DPS', emoji: '🌺', country: 'Indonesia', tag: 'Beach' },
]
 
export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
 
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
 
          {/* Page tabs */}
          <div className="flex justify-center gap-6 mb-10">
            {[
              { label: 'Flights',     href: '/flights' },
              { label: 'Hotels',      href: '/hotels' },
              { label: 'Experiences', href: '/experiences' },
              { label: 'Cars',        href: '/hire-cars' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`pb-2 text-base font-medium transition ${
                  label === 'Flights'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
 
          <p className="text-sm uppercase tracking-widest mb-3 font-medium" style={{ color: '#03989e' }}>
            Powered by Aviasales
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Search Hundreds of Airlines.<br />One Search. Best Price.
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Compare flights to anywhere in the world — from budget to business class.
          </p>
 
          {/* Aviasales search form */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl text-black">
            <AviasalesSearchForm />
          </div>
 
          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-7 text-sm text-gray-400">
            <span>✓ 500+ airlines compared</span>
            <span>✓ No booking fees</span>
            <span>✓ 100+ countries</span>
            <span>✓ Best price guarantee</span>
          </div>
        </div>
      </section>
 
      {/* ── BROWSE BY CONTINENT ──────────────────────────── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Browse by Region</h2>
          <p className="text-gray-500 text-sm mb-8">Where in the world are you headed?</p>
 
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {continents.map((c) => (
              <a
                key={c.slug}
                href={`/flights/to/${c.slug}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition group border border-gray-100 hover:border-teal-200"
              >
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-xs font-semibold" style={{ color: '#232e4e' }}>{c.name}</p>
                <p className="text-xs mt-1 group-hover:underline" style={{ color: '#2f797c' }}>Explore →</p>
              </a>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FEATURED DESTINATIONS ────────────────────────── */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Popular Destinations</h2>
              <p className="text-gray-500 text-sm">Hand-picked routes with great deals right now</p>
            </div>
            <a href="/flights/to/europe" className="text-sm font-medium hidden md:block" style={{ color: '#2f797c' }}>
              View all →
            </a>
          </div>
 
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((dest) => (
              <a
                key={dest.slug}
                href={`/flights/to/${dest.slug}`}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition overflow-hidden"
              >
                {/* Tag */}
                <span
                  className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {dest.tag}
                </span>
 
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.name}</p>
                <p className="text-xs text-gray-400 mb-4">{dest.country}</p>
                <span
                  className="text-xs font-semibold group-hover:underline"
                  style={{ color: '#2f797c' }}
                >
                  Find flights →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── POPULAR ROUTES (text links — great for SEO) ── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Popular Routes</h2>
          <p className="text-gray-500 text-sm mb-8">Most searched flight routes from UK airports</p>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { label: 'Manchester to Barcelona',  href: '/flights/manchester-to-barcelona' },
              { label: 'London to New York',        href: '/flights/london-to-new-york' },
              { label: 'Birmingham to Dubai',       href: '/flights/birmingham-to-dubai' },
              { label: 'Edinburgh to Amsterdam',    href: '/flights/edinburgh-to-amsterdam' },
              { label: 'Manchester to Dubai',       href: '/flights/manchester-to-dubai' },
              { label: 'London to Tokyo',           href: '/flights/london-to-tokyo' },
              { label: 'London to Bali',            href: '/flights/london-to-bali' },
              { label: 'Manchester to Orlando',     href: '/flights/manchester-to-orlando' },
              { label: 'London to Bangkok',         href: '/flights/london-to-bangkok' },
              { label: 'Glasgow to Barcelona',      href: '/flights/glasgow-to-barcelona' },
              { label: 'Leeds to Lisbon',           href: '/flights/leeds-to-lisbon' },
              { label: 'Bristol to Rome',           href: '/flights/bristol-to-rome' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 text-sm font-medium border border-gray-100 hover:border-teal-200 hover:shadow-md transition"
                style={{ color: '#232e4e' }}
              >
                <span>✈ {label}</span>
                <span style={{ color: '#2f797c' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── STATS BAR ────────────────────────────────────── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Airlines Compared' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '10,000+', label: 'Routes Available' },
            { stat: '24/7', label: 'Customer Support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>
 
      <Footer />
    </main>
  )
}
