// ============================================
// PRIVACY POLICY - app/privacy-policy/page.tsx
// URL: hirecarhub.com/privacy-policy
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-300">Last updated: March 2026</p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-gray-600 leading-8 mb-8">
            At Hire Car Hub, we take your privacy seriously. This Privacy Policy explains how we collect, use and protect your personal information when you visit our website at hirecarhub.com. Please read this policy carefully, by using our site, you agree to the practices described here.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>1. Who We Are</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Hire Car Hub is a car hire comparison website. Our registered address is: [PLACEHOLDER — add your address here]. If you have any questions about this policy or how we handle your data, you can contact us at hello@hirecarhub.com.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>2. What Information We Collect</h2>
          <p className="text-gray-600 leading-8 mb-4">We may collect the following types of information when you use our site:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>Information you provide directly, such as your name and email address if you contact us via our contact form</li>
            <li>Search information such as pick-up location, dates and car preferences when you use our search tool</li>
            <li>Technical information such as your IP address, browser type and device, collected automatically when you visit our site</li>
            <li>Usage data such as which pages you visit, how long you spend on them and how you navigate around the site</li>
            <li>Cookie data - please see our Cookie Policy for full details</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-8 mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>Provide and improve our car hire comparison service</li>
            <li>Respond to your enquiries and provide customer support</li>
            <li>Analyse how our website is used so we can make it better</li>
            <li>Send you relevant communications if you have opted in to receive them</li>
            <li>Comply with our legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>4. Third Party Services</h2>
          <p className="text-gray-600 leading-8 mb-6">
            When you click through to book a car hire deal, you will be redirected to a third party supplier's website. We are not responsible for the privacy practices of those websites and we encourage you to read their privacy policies before providing any personal information. Our third party partners may include car hire suppliers, booking platforms and affiliate networks.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>5. Cookies</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We use cookies and similar technologies to improve your experience on our site, analyse traffic and serve relevant content. You can control your cookie preferences at any time. Please see our <a href="/cookie-policy" style={{color: '#2f797c'}} className="underline hover:opacity-75">Cookie Policy</a> for full details.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>6. How We Store and Protect Your Data</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We take reasonable steps to protect your personal information from unauthorised access, loss or misuse. Our website is hosted on secure servers and we use industry-standard security measures. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>7. How Long We Keep Your Data</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We only keep your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Contact form submissions are typically retained for up to 12 months.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>8. Your Rights</h2>
          <p className="text-gray-600 leading-8 mb-4">Under UK GDPR, you have the following rights in relation to your personal data:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>The right to access the personal data we hold about you</li>
            <li>The right to correct any inaccurate or incomplete data</li>
            <li>The right to request that we delete your data</li>
            <li>The right to restrict or object to how we process your data</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p className="text-gray-600 leading-8 mb-6">
            To exercise any of these rights, please contact us at hello@hirecarhub.com. We will respond to your request within 30 days.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>9. Changes to This Policy</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date at the top. We encourage you to check this page periodically to stay informed about how we protect your information.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{color: '#232e4e'}}>10. Contact Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            If you have any questions or concerns about this Privacy Policy or how we handle your data, please get in touch at hello@hirecarhub.com or use the contact form on our <a href="/contact" style={{color: '#2f797c'}} className="underline hover:opacity-75">Contact Us</a> page.
          </p>

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </main>
  )
}