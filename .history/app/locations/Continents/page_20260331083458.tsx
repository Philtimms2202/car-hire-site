import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ContinentsPage() {
  const continents = [
    { name: 'Europe', slug: 'europe', emoji: '🌍' },
    { name: 'Asia', slug: 'asia', emoji: '🌏' },
    { name: 'North America', slug: 'north-america', emoji: '🌎' },
    { name: 'South America', slug: 'south-america', emoji: '🗺️' },
    { name: 'Africa', slug: 'africa', emoji: '🌍' },
    { name: 'Oceania', slug: 'australia', emoji: '🌊' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Choose a Continent</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Start your journey by selecting the continent you're travelling to.
        </p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {continents.map((c) => (
              <a
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="card text-center hover:shadow-xl transition cursor-pointer py-10"
              >
                <div className="text-5xl mb-3">{c.emoji}</div>
                <h3 className="font-bold text-xl" style={{ color: '#232e4e' }}>
                  {c.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
                  View countries →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}