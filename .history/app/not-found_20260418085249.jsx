export default function NotFound() {
  return (
    <main className="w-full font-sans bg-brand-dark text-white">

      {/* Hero Section */}
      <section className="w-full bg-brand-primary py-24 text-center px-6">

        {/* Logo */}
        <a href="/" className="inline-block mb-10">
          <img
            src="/timms-travel-logo.png"
            alt="Timms Travel Logo"
            className="h-16 w-auto mx-auto"
          />
        </a>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Whoops, wrong turn.
        </h1>

        <p className="text-brand-light/90 text-lg max-w-xl mx-auto leading-relaxed">
          The page you’re looking for doesn’t seem to exist — but your next adventure definitely does.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="/flights"
            className="bg-brand-secondary text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-dark transition"
          >
            Search flights
          </a>

          <a
            href="/flights/popular-routes"
            className="text-brand-light font-medium hover:underline"
          >
            View popular routes
          </a>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Popular destinations
        </h2>

        <p className="text-brand-light/80 mb-8">
          Explore some of our most travelled routes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <a href="/flights/london-to-new-york" className="p-4 border border-white/20 rounded-xl hover:bg-white/10 transition">
            <div className="font-medium">London → New York</div>
          </a>

          <a href="/flights/manchester-to-dubai" className="p-4 border border-white/20 rounded-xl hover:bg-white/10 transition">
            <div className="font-medium">Manchester → Dubai</div>
          </a>

          <a href="/flights/edinburgh-to-paris" className="p-4 border border-white/20 rounded-xl hover:bg-white/10 transition">
            <div className="font-medium">Edinburgh → Paris</div>
          </a>

          <a href="/flights/birmingham-to-tenerife" className="p-4 border border-white/20 rounded-xl hover:bg-white/10 transition">
            <div className="font-medium">Birmingham → Tenerife</div>
          </a>
        </div>
      </section>

    </main>
  )
}
