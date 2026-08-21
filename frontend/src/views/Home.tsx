import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}

export default Home
