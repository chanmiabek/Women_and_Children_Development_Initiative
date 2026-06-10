import React from 'react';
import { AboutSection, BlogSection, EventsSection, GallerySection, GetInvolved, PolicyContent, ProgramsSection } from '../components/sections.jsx';
import { PageHero } from '../components/ui.jsx';

export function GenericPage({ type, navigate }) {
  const config = {
    about: ['About WCDI', 'Making a difference since 2010 through sustainable women and children development programs.', 'fa-hands-helping'],
    programs: ['Our Programs', 'Explore the core initiatives creating lasting community change.', 'fa-layer-group'],
    'get-involved': ['Get Involved', 'Support through donations, volunteering, partnerships, advocacy, and events.', 'fa-people-carry'],
    events: ['Events', 'Join upcoming trainings, drives, summits, and community health days.', 'fa-calendar-alt'],
    blog: ['News & Stories', 'Read updates, field notes, and volunteer stories from WCDI programs.', 'fa-newspaper'],
    'success-stories': ['Success Stories', 'Real stories from women, children, volunteers, and partner communities.', 'fa-star'],
    'annual-report': ['Annual Report 2026', 'A transparent overview of impact, finance, and program outcomes.', 'fa-file-alt'],
    'blog-single': ['Volunteer Spotlight', 'A closer look at community members helping WCDI programs thrive.', 'fa-user-friends'],
    'privacy-policy': ['Privacy Policy', 'How WCDI handles essential browser storage and submitted demo data.', 'fa-lock'],
    terms: ['Terms of Use', 'Guidelines for using the WCDI website and demo tools.', 'fa-file-contract']
  }[type] || ['WCDI', 'Women and Children Development Initiative', 'fa-hands-helping'];

  return (
    <>
      <PageHero title={config[0]} text={config[1]} icon={config[2]} />
      {type === 'programs' && <ProgramsSection navigate={navigate} />}
      {type === 'events' && <EventsSection />}
      {type === 'blog' && <><BlogSection navigate={navigate} /><GallerySection /></>}
      {type === 'about' && <><AboutSection /><GallerySection /></>}
      {type === 'get-involved' && <GetInvolved navigate={navigate} />}
      {!['programs', 'events', 'blog', 'about', 'get-involved'].includes(type) && <PolicyContent type={type} />}
    </>
  );
}
