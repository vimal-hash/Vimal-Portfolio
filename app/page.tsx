import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { Work } from '@/components/work';
import { Marquee } from '@/components/marquee';
import { Stack } from '@/components/stack';
import { About } from '@/components/about';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Cursor } from '@/components/cursor';

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero />
        <Work />
        <Marquee />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
