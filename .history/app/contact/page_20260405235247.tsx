// ============================================
// CONTACT PAGE - app/contact/page.tsx
// URL: timmstravel.com/contact
// ============================================

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { sendEmail } from "./sendEmail"

// -----------------------------
// SEO Metadata
// -----------------------------
export const metadata = {
  title: "Timms Travel | Contact Us",
  description:
    "Have a question about a booking or need support? Contact Timms Travel and our friendly team will get back to you within 24 hours.",
  icons: {
    icon: "/favicon.ico",
  },
}

// -----------------------------
// Page Component
// -----------------------------
export default function Contact() {
  const faqs = [
    {
      question: "How do I modify or cancel my booking?",
      answer:
        "Most of our car hire deals come with free cancellation. Simply get in touch using the form above and we'll help you make any changes to your booking.",
    },
    {
      question: "What documents do I need to hire a car?",
      answer:
        "You'll typically need a full valid driving licence, a credit or debit card in the driver's name, and a passport or photo ID. Some countries may have additional requirements — we'll let you know at the time of booking.",
    },
    {
      question: "Is insurance included in the price?",
      answer:
        "Basic insurance is included with all of our car hire deals. We always recommend checking the excess amount and considering additional cover for complete peace of mind.",
    },
    {
      question: "Can I add an additional driver?",
      answer:
        "Yes! Most suppliers allow you to add additional drivers for a small daily fee. You can request this at the time of booking or when you pick up your car.",
    },
    {
      question: "What happens if I return the car late?",
      answer:
        "Late returns are charged at an hourly rate by most suppliers. If you think you're going to be late, give us a call and we'll do our best to help.",
    },
    {
      question: "Do I need to fill up the car before returning it?",
      answer:
        "Most car hire deals operate on a full-to-full fuel policy — you'll collect the car with a full tank and return it full. We'll always make this clear before you book.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: "#232e4e" }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Got a question about a booking or want to know more about what we do?
          We'd love to hear from you — our friendly team is always happy to help.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#232e4e" }}
            >
              Send Us a Message
            </h2>
            <p className="text-gray-500 mb-6">
              Fill in the form below and we'll get back to you within 24 hours.
            </p>

            <form action={sendEmail} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Smith"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us a bit more about your query..."
                  className="input-field resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#232e4e" }}
            >
              Other Ways to Reach Us
            </h2>
            <p className="text-gray-500 mb-8">
              Prefer to email us directly? No problem at all.
            </p>

            <div className="flex flex-col gap-6">
              <div className="card flex gap-4 items-start">
                <div className="text-3xl">📧</div>
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#232e4e" }}
                  >
                    Email Us
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">
                    For general enquiries and booking support
                  </p>
                  <a
                    href="mailto:info@timmstravel.com"
                    style={{ color: "#2f797c" }}
                    className="font-semibold hover:opacity-75 transition"
                  >
                    info@timmstravel.com
                  </a>
                </div>
              </div>

              <div className="card flex gap-4 items-start">
                <div className="text-3xl">⏱️</div>
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#232e4e" }}
                  >
                    Response Times
                  </h3>
                  <p className="text-gray-500 text-sm">
                    We aim to respond to all enquiries within 24 hours during
                    business days. For urgent booking issues, please email us
                    directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "#232e4e" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Before you get in touch, check if we've already answered your
            question below.
          </p>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "#232e4e" }}
                >
                  {faq.question}
                </h3>
                <p className="text-gray-500 leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}