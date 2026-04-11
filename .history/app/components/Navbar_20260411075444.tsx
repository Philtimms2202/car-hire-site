{/* Mobile Menu */}
{menuOpen ? (
  <div
    className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t pt-4"
    style={{ borderColor: '#e5e7eb' }}
  >
    <a
      href="/locations"
      style={{ color: '#232e4e' }}
      className="font-medium hover:opacity-75 transition"
    >
      Locations
    </a>

    <a
      href="/flights"
      style={{ color: '#232e4e' }}
      className="font-medium hover:opacity-75 transition"
    >
      Flights
    </a>

    <a
      href="/blog"
      style={{ color: '#232e4e' }}
      className="font-medium hover:opacity-75 transition"
    >
      Blog
    </a>

    <a
      href="/about"
      style={{ color: '#232e4e' }}
      className="font-medium hover:opacity-75 transition"
    >
      About
    </a>
  </div>
) : null}
