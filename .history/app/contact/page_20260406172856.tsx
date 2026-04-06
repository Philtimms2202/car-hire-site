// ============================================
// CONTACT PAGE - app/contact/page.tsx
// URL: hirecarhub.com/contact
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: "Timms Travel | Contact Us",
    template: "Timms Travel |",
  },
  description: "Discover amazing experiences around the world.",
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
      answer: "No — we don’t add any hidden fees. The price you see is the price set by the travel provider. We aim to be fully transparent so you can book with confidence."
    },
    {
      question: "How do you make money?",
      answer: "We earn a small commission from our partners when you make a booking through our site. This doesn’t cost you anything extra — it simply helps us keep the site running and continue finding the best travel deals."
    },
    {
      question: "Are the prices shown accurate?",
      answer: "We work hard to display the latest prices, but final prices are confirmed on our partner’s website. Travel prices can change quickly depending on availability and demand."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes — all payments are handled directly by our trusted partners using secure, encrypted payment systems. We never store or process your payment details ourselves."
    },
    {
      question: "What if something goes wrong with my booking?",
      answer: "Since your booking is made with the travel provider, they’ll be your first point of contact for support. However, if you need help finding the right contact details, we’re always here to point you in the right direction."
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
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Got a question about a booking or just want to know more about what we do? We'd love to hear from you - we're a friendly bunch and always happy to help.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{color: '#232e4e'}}>Send Us a Message</h2>
            <p className="text-gray-500 mb-6">Fill in the form below and we'll get back to you as soon as we can, usually within 24 hours.</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" placeholder="John Smith" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" placeholder="How can we help?" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us a bit more about your query..."
                  className="input-field resize-none"
                />
              </div>
              <button className="btn-primary w-full">Send Message</button>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{color: '#232e4e'}}>Other Ways to Reach Us</h2>
            <p className="text-gray-500 mb-8">Email us directly.</p>

            <div className="flex flex-col gap-6">
              <div className="card flex gap-4 items-start">
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Email Us</h3>
                  <p className="text-gray-500 text-sm mb-1">For general enquiries and booking support</p>
                  <a href="mailto:info@traveltimms.com" style={{color: '#2f797c'}} className="font-semibold hover:opacity-75 transition">
                    info@traveltimms.com
                  </a>
                </div>
              </div>

              <div className="card flex gap-4 items-start">
                <div className="text-3xl">⏱️</div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{color: '#232e4e'}}>Response Times</h3>
                  <p className="text-gray-500 text-sm">We aim to respond to all enquiries within 24 hours during business days.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{color: '#232e4e'}}>Frequently Asked Questions</h2>
          <p className="text-center text-gray-500 mb-10">Before you get in touch, it's worth checking if we've already answered your question below.</p>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="font-bold text-lg mb-2" style={{color: '#232e4e'}}>{faq.question}</h3>
                <p className="text-gray-500 leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}