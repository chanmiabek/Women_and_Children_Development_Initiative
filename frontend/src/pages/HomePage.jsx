import React from 'react';
import { AboutSection, BlogSection, DonationSection, EventsSection, GallerySection, Hero, ImpactSection, Partners, ProgramsSection, Stats, TeamSection, TestimonialsSection } from '../components/sections.jsx';

export function HomePage({ navigate }) {
  return (
    <>
      <Hero navigate={navigate} />
      <Stats />
      <AboutSection />
      <ProgramsSection navigate={navigate} />
      <ImpactSection />
      <GallerySection />
      <TeamSection />
      <TestimonialsSection />
      <EventsSection />
      <BlogSection navigate={navigate} />
      <Partners />
      <DonationSection />
    </>
  );
}
