import React from 'react';
import { DonationSection } from '../components/sections.jsx';
import { PageHero } from '../components/ui.jsx';
import childrenActivitiesImage from '../../assets/images/children-activaties.jpeg';

export function DonationPage() {
  return (
    <>
      <PageHero title="Donate" text="Make a secure donation and receive a receipt." icon="fa-heart" backgroundImage={childrenActivitiesImage} />
      <DonationSection />
    </>
  );
}
