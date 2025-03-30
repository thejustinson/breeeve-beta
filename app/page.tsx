import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
// import Features from '@/components/Features'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        {/* <Features /> */}
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
