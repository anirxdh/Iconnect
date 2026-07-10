import Preloader from "@/components/Preloader";
import AssetWarmer from "@/components/AssetWarmer";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Journey from "@/components/Journey";
import Caretakers from "@/components/Caretakers";
import Programs from "@/components/Programs";
import Nourishment from "@/components/Nourishment";
import Gallery from "@/components/Gallery";
import Safety from "@/components/Safety";
import Toolkit from "@/components/Toolkit";
import AccessTiers from "@/components/AccessTiers";
import Houses from "@/components/Houses";
import Concierge from "@/components/Concierge";
import Closing from "@/components/Closing";

export default function Home() {
  return (
    <main>
      <Preloader />
      <AssetWarmer />
      <Cursor />
      <Nav />
      <Hero />
      <Manifesto />
      <Journey />
      <Caretakers />
      <Programs />
      <Nourishment />
      <Gallery />
      <Safety />
      <Toolkit />
      <AccessTiers />
      <Houses />
      <Closing />
      <Concierge />
    </main>
  );
}
