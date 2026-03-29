// ============================================
// TERMS AND CONDITIONS - app/terms-and-conditions/page.tsx
// URL: hirecarhub.com/terms-and-conditions
// ============================================

import Navbar from '../components/Navbar'

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-gray-300">Last updated: March 2026</p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-gray-600 leading-8 mb-8">
            Please read these Terms and Conditions carefully before using the Hire Car Hub website. By accessing or using our site, you agree to be bound by these terms. If you do not agree, please do not use our website.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>1. About Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Hire Car Hub is a car hire comparison website. Our registered address is: [PLACEHOLDER - add your address here]. You can contact us at hello@hirecarhub.com.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>2. Our Service</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Hire Car Hub is a comparison platform. We do not own, operate or rent any vehicles ourselves. When you click through to book a car hire deal, you are entering into a contract directly with the car hire supplier, not with Hire Car Hub. We act as an introducer only and are not responsible for the products, services or actions of any third party supplier.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>3. Accuracy of Information</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We make every effort to ensure that the information on our website is accurate and up to date. However, prices, availability and deal details are provided by third party suppliers and may change at any time. We cannot guarantee that all information displayed on our site is completely accurate at the time of your visit and we accept no liability for any errors or omissions.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>4. Third Party Websites</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Our website contains links to third party websites and booking platforms. These links are provided for your convenience and do not constitute an endorsement of those sites. We have no control over the content of third party websites and accept no responsibility for them. Please read the terms and conditions of any third party site before making a booking or providing personal information.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>5. Affiliate Relationships</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Hire Car Hub may earn a commission when you click through to a car hire supplier and make a booking. This does not affect the price you pay. Our editorial content and recommendations are not influenced by these commercial relationships.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>6. Intellectual Property</h2>
          <p className="text-gray-600 leading-8 mb-6">
            All content on this website, including text, images, logos and design, is the property of Hire Car Hub or its content suppliers and is protected by copyright. You may not reproduce, distribute or use any content from this site without our prior written permission.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>7. Limitation of Liability</h2>
          <p className="text-gray-600 leading-8 mb-6">
            To the fullest extent permitted by law, Hire Car Hub shall not be liable for any direct, indirect, incidental or consequential loss or damage arising from your use of this website or any third party site linked from it. This includes but is not limited to loss of data, loss of revenue or any damage caused by viruses or other harmful components.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>8. Use of Our Website</h2>
          <p className="text-gray-600 leading-8 mb-4">When using our website, you agree that you will not:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>Use the site for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the site</li>
            <li>Transmit any harmful, offensive or disruptive content</li>
            <li>Use automated tools to scrape or copy content from the site without permission</li>
            <li>Impersonate any person or organisation</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>9. Privacy</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Your use of our website is also governed by our <a href="/privacy-policy" style={{color: '#2f797c'}} className="underline hover:opacity-75">privacy policy</a> page.  and Cookie Policy, which are incorporated into these Terms and Conditions by reference. Please read both policies carefully.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>10. Changes to These Terms</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We reserve the right to update these Terms and Conditions at any time. Any changes will be posted on this page with an updated date. Your continued use of the website after any changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>11. Governing Law</h2>
          <p className="text-gray-600 leading-8 mb-6">
            These Terms and Conditions are governed by the laws of England and Wales. Any disputes arising from your use of this website shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>12. Contact Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            If you have any questions about these Terms and Conditions, please contact us at hello@hirecarhub.com or visit our <a href="/contact" style={{color: '#2f797c'}} className="underline hover:opacity-75">Contact Us</a> page.
          </p>

        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#232e4e'}} className="text-gray-400 text-center py-8 px-6 border-t border-gray-700">
        <p className="text-white font-bold text-lg mb-2">Hire Car Hub</p>
        <div className="flex justify-center gap-6 text-sm mb-4">
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms-and-conditions" className="hover:text-white transition">Terms</a>
          <a href="/cookie-policy" className="hover:text-white transition">Cookie Policy</a>
        </div>
        <p className="text-sm">© 2026 Hire Car Hub. All rights reserved.</p>
      </footer>

    </main>
  )
}