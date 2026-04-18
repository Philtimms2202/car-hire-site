export default function NotFound() {
  return (
    <main className="w-full">

      {/* Hero Section */}
      <section className="w-full bg-[#0a2540] py-24 text-center px-6">
        <h1 className="text-white text-4xl md:text-5xl font-serif mb-4">
          This page took a wrong turn.
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
          We couldn’t find the page you were looking for — but your next adventure is still waiting.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="/flights"
            className="bg-[#03989e] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#027d82] transition"
          >
            Search flights
          </a>

          <a
            href="/flights/popular-routes"
            className="text-[#03989e] font-medium hover:underline"
          >
            View popular routes
          </a>
        </div>
      </section>

      {/* Optional: Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-serif text-[#232e4e] mb-4">
          Popular destinations
        </h2>
        <p className="text-gray-600 mb-8">
          Explore some of our most travelled routes.
        </p>

        {/* Simple 4‑item grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <a href="/flights/london-to-new-york" className="p-4 border rounded-xl hover:shadow-md transition">
            <div className="font-medium text-[#232e4e]">London → New York</div>
          </a>
          <a href="/flights/manchester-to-dubai" className="p-4 border rounded-xl hover:shadow-md transition">
            <div className="font-medium text-[#232e4e]">Manchester → Dubai</div>
          </a>
          <a href="/flights/edinburgh-to-paris" className="p-4 border rounded-xl hover:shadow-md transition">
            <div className="font-medium text-[#232e4e]">Edinburgh → Paris</div>
          </a>
          <a href="/flights/birmingham-to-tenerife" className="p-4 border rounded-xl hover:shadow-md transition">
            <div className="font-medium text-[#232e4e]">Birmingham → Tenerife</div>
          </a>
        </div>
      </section>

    </main>
  )
}
