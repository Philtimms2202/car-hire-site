// ============================================
// CONTACT PAGE - app/contact/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: "Timms Travel | Contact Us",
    template: "Timms Travel |",
  },
  description: "Get in touch with the Timms Travel team. We're here to help with any questions about travel, bookings or anything else.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Contact() {
  const faqs = [
    {
      question: "How do I book travel through your site?",
      answer: "We help you compare and find the best deals across flights, hotels, car hire and experiences. When you select an option, you'll be securely redirected to one of our trusted travel partners to complete your booking."
    },
    {
      question: "Who do I book with?",
      answer: "All bookings are made directly with our carefully selected partners, including well-known travel brands and providers. We only work with companies that meet strict quality and reliability standards."
    },
    {
      question: "Can I change or cancel my booking?",
      answer: "Any changes or cancellations are handled by the provider you booked with. Once you complete your booking, you'll receive confirmation details with instructions on how to manage your trip directly with them."
    },
    {
      question: "Do you charge any extra fees?",
      answer: "No — we don't add any hidden fees. The price you see is the price set by the travel provider. We aim to be fully transparent so you can book with confidence."
    },
    {
      question: "How do you make money?",
      answer: "We earn a small commission from our partners when you make a booking through our site. This doesn't cost you anything extra — it simply helps us keep the site running and continue finding the best travel deals."
    },
    {
      question: "Are the prices shown accurate?",
      answer: "We work hard to display the latest prices, but final prices are confirmed on our partner's website. Travel prices can change quickly depending on availability and demand."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes — all payments are handled directly by our trusted partners using secure, encrypted payment systems. We never store or process your payment details ourselves."
    },
    {
      question: "What if something goes wrong with my booking?",
      answer: "Since your booking is made with the travel provider, they'll be your first point of contact for support. However, if you need help finding the right contact details, we're always here to point you in the right direction."
    },
    {
      question: "Why should I trust your recommendations?",
      answer: "We focus on working with reputable travel brands, highlighting genuine deals, and being transparent about how we operate. Our goal is to make it easier for you to compare options and book with confidence."
    },
    {
      question: "Do you cover flights, hotels, and experiences?",
      answer: "Yes — we bring together a wide range of travel options including flights, hotels, car hire, airport transfers, and experiences, so you can plan your entire trip in one place."
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-5xl font-bold mb-6">We'd Love to Hear From You</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Got a question, a suggestion, or just want to say hello? Drop us an email and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:info@traveltimms.com"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: '#2f797c', color: '#fff' }}
          >
            <span>📧</span>
            info@traveltimms.com
          </a>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#232e4e' }}>
            How We Can Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Booking Questions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Need help understanding how a booking works or which partner to use? We're happy to guide you.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>Travel Advice</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Planning a trip and not sure where to start? Get in touch and we'll point you in the right direction.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>General Enquiries</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Feedback, partnerships, press enquiries or anything else — we read every email and reply to all of them.
              </p>
            </div>

          </div>

          {/* CTA */}
          <div
            className="mt-12 rounded-2xl p-10 text-center text-white"
            style={{ backgroundColor: '#232e4e' }}
          >
            <h3 className="text-2xl font-bold mb-3">Ready to get in touch?</h3>
            <p className="text-gray-300 mb-6">
              We aim to respond to all enquiries within 24 hours on business days.
            </p>
            <a
              href="mailto:info@traveltimms.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#2f797c' }}
            >
              Send Us an Email
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: '#232e4e' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Before you get in touch, it's worth checking if we've already answered your question below.
          </p>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>
                  {faq.question}
                </h3>
                <p className="text-gray-500 leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Still have a question we haven't answered?</p>
            <a
              href="mailto:info@traveltimms.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#2f797c' }}
            >
              📧 Email Us Directly
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}