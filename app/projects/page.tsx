import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ProjectsCatalogue } from '@/components/projects-catalogue';

export const metadata = {
  title: 'Projects — Full Catalogue',
  description:
    'A complete archive of shipped projects across AI, commerce, SaaS, and editorial.',
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
