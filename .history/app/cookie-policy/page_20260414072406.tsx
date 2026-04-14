// ============================================
// COOKIE POLICY - app/cookie-policy/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: "Cookie Policy | Timms Travel",
  description: "How Timms Travel uses cookies.",
  icons: { icon: "/favicon.ico" },
}

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-gray-300">Last updated: April 2026</p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-gray-600 leading-8 mb-8">
            This Cookie Policy explains what cookies are, how Timms Travel uses them and what choices you have regarding their use. By continuing to use our website, you consent to our use of cookies as described in this policy.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>1. What Are Cookies?</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, to remember your preferences and to provide information to the owners of the site. Cookies do not contain any personally identifiable information on their own.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>2. How We Use Cookies</h2>
          <p className="text-gray-600 leading-8 mb-4">
            Timms Travel uses cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>To ensure our website functions correctly and pages load as expected</li>
            <li>To remember your preferences and settings during your visit</li>
            <li>To understand how visitors use our site so we can improve it</li>
            <li>To track referrals from affiliate partners for hotels, flights, experiences and other travel products</li>
            <li>To serve relevant content and improve your overall experience</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>3. Types of Cookies We Use</h2>

          <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: '#2f797c' }}>Essential Cookies</h3>
          <p className="text-gray-600 leading-8 mb-6">
            These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or filling in forms. Without these cookies, parts of the site may not work properly.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: '#2f797c' }}>Analytics Cookies</h3>
          <p className="text-gray-600 leading-8 mb-6">
            We use analytics cookies to understand how visitors interact with our website. This helps us identify which pages are most popular, how people navigate around the site and where we can make improvements. The data collected is aggregated and anonymous. We may use tools such as Google Analytics for this purpose.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: '#2f797c' }}>Affiliate and Tracking Cookies</h3>
          <p className="text-gray-600 leading-8 mb-6">
            When you click through to a travel partner via our website — including hotels, flights, car hire, experiences or other travel services — affiliate cookies may be set to track whether a booking was made. This allows us to receive a commission from the partner at no extra cost to you. These cookies do not store any personal payment information.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3" style={{ color: '#2f797c' }}>Preference Cookies</h3>
          <p className="text-gray-600 leading-8 mb-6">
            These cookies remember choices you make on our website, such as your preferred currency, language or region, so we can provide a more personalised experience on your return visits.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>4. Third Party Cookies</h2>
          <p className="text-gray-600 leading-8 mb-6">
            Some cookies on our site are set by third party services that appear on our pages. These may include analytics providers, affiliate networks and travel booking platforms such as hotel, flight and experience providers. We do not control these cookies and recommend you check the relevant third party privacy and cookie policies for more information.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>5. How to Control Cookies</h2>
          <p className="text-gray-600 leading-8 mb-6">
            You can control and manage cookies in several ways. Most web browsers allow you to view, manage, delete and block cookies through the browser settings. Please note that if you choose to block or delete cookies, some parts of our website may not function as intended and your experience may be affected.
          </p>
          <p className="text-gray-600 leading-8 mb-4">Here is how to manage cookies in the most common browsers:</p>
          <ul className="list-disc list-inside text-gray-600 leading-8 mb-6">
            <li>Google Chrome: Settings, Privacy and Security, Cookies and other site data</li>
            <li>Mozilla Firefox: Settings, Privacy and Security, Cookies and Site Data</li>
            <li>Safari: Preferences, Privacy, Manage Website Data</li>
            <li>Microsoft Edge: Settings, Cookies and Site Permissions</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>6. Changes to This Policy</h2>
          <p className="text-gray-600 leading-8 mb-6">
            We may update this Cookie Policy from time to time to reflect changes in technology, legislation or our business practices. Any updates will be posted on this page with a revised date. We encourage you to check back periodically.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: '#232e4e' }}>7. Contact Us</h2>
          <p className="text-gray-600 leading-8 mb-6">
            If you have any questions about how we use cookies, please contact us at hello@timmstravel.com or visit our <a href="/contact" style={{ color: '#2f797c' }} className="underline hover:opacity-75">Contact Us</a> page.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  )
}