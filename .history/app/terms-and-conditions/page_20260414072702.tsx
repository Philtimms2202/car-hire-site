// ============================================
// TERMS AND CONDITIONS - app/terms-and-conditions/page.tsx
// URL: timmstravel.com/terms-and-conditions
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: "Terms and Conditions | Timms Travel",
  description: "The terms and conditions governing your use of Timms Travel.",
  icons: { icon: "/favicon.ico" },
}

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-gray-300">Last updated: April 2026</p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-gray-600 leading-8 mb-8">
            Please read these Terms and Conditions carefully before using the Timms Travel website. By accessing or using our site, you agree to be bound by these terms. If you do not agree, please do not use our website.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>1. About Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Timms Travel is an affiliate travel website helping people discover and book hotels, flights, experiences, car hire and more. If you have any questions about these terms, please get in touch at hello@timmstravel.com.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>2. Our Service</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Timms Travel is a travel comparison and recommendations platform. We do not own, operate or sell any travel products directly. When you click through to book a hotel, flight, experience, car hire or any other travel product, you are entering into a contract directly with that supplier or booking platform — not with Timms Travel. We act as an introducer only and are not responsible for the products, services or actions of any third party.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>3. Accuracy of Information</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We make every effort to ensure that the information on our website is accurate and up to date. However, prices, availability and product details are provided by third party partners and may change at any time. We cannot guarantee that all information displayed on our site is completely accurate at the time of your visit and we accept no liability for any errors or omissions.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>4. Third Party Websites</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Our website contains links to third party websites and booking platforms. These links are provided for your convenience and do not constitute an endorsement of those sites. We have no control over the content of third party websites and accept no responsibility for them. Please read the terms and conditions of any third party site before making a booking or providing personal information.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>5. Affiliate Relationships</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Timms Travel earns commission through affiliate links to travel partners. When you click through to a partner and make a booking — whether that is a hotel, flight, experience or other travel product — we may receive a small payment from that partner. This does not affect the price you pay. Our editorial content, guides and recommendations are not influenced by these commercial relationships, and we only recommend products and services we genuinely believe offer good value.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>6. Intellectual Property</h2>
          <p className="text-gray-600 leading-8 mb-6">
            All content on this website, including text, images, logos and design, is the property of Timms Travel or its content suppliers and is protected by copyright. You may not reproduce, distribute or use any content from this site without our prior written permission.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-8 mb-6">
            To the fullest extent permitted by law, Timms Travel shall not be liable for any direct, indirect, incidental or consequential loss or damage arising from your use of this website or any third party site linked from it. This includes but is not limited to loss of data, loss of revenue, any issues arising from a travel booking made via a third party, or any damage caused by viruses or other harmful components.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>8. Use of Our Website</h2>
          <p className="text-gray-600 leading-8 mb-4">When using our website, you agree that you will not:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>Use the site for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the site</li>
            <li>Transmit any harmful, offensive or disruptive content</li>
            <li>Use automated tools to scrape or copy content from the site without permission</li>
            <li>Impersonate any person or organisation</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>9. Privacy and Cookies</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Your use of our website is also governed by our <a href="/privacy-policy" style={{ color: '#2f797c' }} className="underline hover:opacity-75">Privacy Policy</a> and <a href="/cookie-policy" style={{ color: '#2f797c' }} className="underline hover:opacity-75">Cookie Policy</a>, both of which are incorporated into these Terms and Conditions by reference. Please read them carefully.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>10. Changes to These Terms</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We reserve the right to update these Terms and Conditions at any time. Any changes will be posted on this page with an updated date. Your continued use of the website after any changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>11. Governing Law</h2>
          <p className="text-gray-600 leading-8 mb-6">
            These Terms and Conditions are governed by the laws of England and Wales. Any disputes arising from your use of this website shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>12. Contact Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            If you have any questions about these Terms and Conditions, please contact us at hello@timmstravel.com or visit our <a href="/contact" style={{ color: '#2f797c' }} className="underline hover:opacity-75">Contact Us</a> page.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  )
}