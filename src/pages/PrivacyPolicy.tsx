import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  // Function to handle scroll and update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200; // Adjust for navbar height
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a specific section
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      // Calculate the offset position
      const offset = 100; // Same as the offset used in the scroll listener
      const sectionTop = section.offsetTop - offset;

      // Scroll to the adjusted position
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-card">
        {/* Sticky Sidebar */}
        <div className="hidden lg:flex sticky top-0 left-16 h-screen overflow-y-auto flex-col justify-center items-center">
          <div className="w-72 p-10 rounded-3xl bg-gradient-to-br from-background via-violet-400/10 to-background">
            <h2 className="text-lg font-semibold mb-4">Privacy Policy</h2>
            <ul className="space-y-2">
              {[
                "introduction",
                "information-we-collect",
                "how-we-use-your-information",
                "sharing-of-information",
                "data-security",
                "your-rights",
                "changes-to-this-policy",
                "contact-us",
              ].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className={`w-full text-left p-2 rounded-lg transition-all ${activeSection === section
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/30 hover:bg-card"
                      }`}
                  >
                    {section
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="mb-14">Last updated: {new Date().toLocaleDateString()}</p>

            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-500 leading-relaxed">
                Welcome to Social Automation. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-we-collect" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We collect information that you provide directly to us when you use our services, including:
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>Account information (e.g., name, email address)</li>
                <li>Profile information for connected social media accounts</li>
                <li>Content you create, upload, or generate using our tools</li>
                <li>Usage data and analytics related to your interaction with our services</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use-your-information" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Communicate with you about our services, updates, and promotional offers</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              </ul>
            </section>

            {/* Sharing of Information */}
            <section id="sharing-of-information" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">4. Sharing of Information</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>Service providers who perform services on our behalf</li>
                <li>Social media platforms when you choose to connect your accounts</li>
                <li>Other users when you choose to make your content public</li>
                <li>Law enforcement or other third parties when required by law or to protect our rights</li>
              </ul>
            </section>

            {/* Data Security */}
            <section id="data-security" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">5. Data Security</h2>
              <p className="text-gray-500 leading-relaxed">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-gray-500 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section id="changes-to-this-policy" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">7. Changes to This Privacy Policy</h2>
              <p className="text-gray-500 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact-us" className="mb-12">
              <h2 className="text-3xl font-bold mb-4">8. Contact Us</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-500 leading-relaxed">
                Email: <a href="mailto:privacy@Social Automation.com" className="text-blue-500 hover:underline">privacy@Social Automation.com</a>
              </p>
              <p className="text-gray-500 leading-relaxed">
                Address: Gujarat, IN
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};