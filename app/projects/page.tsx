import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ProjectsCatalogue } from '@/components/projects-catalogue';

export const metadata = {
  title: 'Projects',
  description:
    'Every project I can show, from a voice AI interface to brand websites.',
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="pt-24">
        <ProjectsCatalogue />
      </main>
      <Footer />
    </>
  );
}
