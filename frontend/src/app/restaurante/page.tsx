import Navbar from "@/components/restaurant/Navbar";
import Hero from "@/components/restaurant/Hero";
import About from "@/components/restaurant/About";
import Menu from "@/components/restaurant/Menu";
import Gallery from "@/components/restaurant/Gallery";
import Reservation from "@/components/restaurant/Reservation";
import Footer from "@/components/restaurant/Footer";

export default function RestaurantePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Reservation />
      <Footer />
    </main>
  );
}
