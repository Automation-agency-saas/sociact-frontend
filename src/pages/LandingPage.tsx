import {Navbar, Hero, Sponsors, About, Features, HowItWorks, Services, Cta, Testimonials, Pricing, FAQ, Newsletter, Footer, ScrollToTop, BentoDemo, WavyBackgroundDemo} from "./index";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />


      {/* About Section with right-side glow */}
      <div className="relative mt-6">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <About />
      </div>

            <BentoDemo />

      {/* Features Section with left-side glow */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <Features />
      </div>

      {/* HowItWorks Section with right-side glow */}
      <div className="relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <HowItWorks />
      </div>

      {/* Services Section with left-side glow */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <Services />
      </div>

      {/* Testimonials Section with right-side glow */}
      <div className="relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <Testimonials />
      </div>

      {/* Pricing Section with left-side glow */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <Pricing />
      </div>

      {/* FAQ Section with right-side glow */}
      <div className="relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <FAQ />
      </div>

      {/* Newsletter Section with left-side glow */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[600px] -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,51,255,0.15)_0%,rgba(139,51,255,0.1)_45%,transparent_80%)] blur-[60px] sm:blur-[90px] lg:blur-[120px]" />
        </div>
        <Newsletter />
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}