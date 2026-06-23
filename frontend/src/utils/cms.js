import { events, featuredImages, posts, programs } from '../data/siteData.js';
import ceoImage from '../../assets/images/ceo.jpeg';
import ceoTestimonialImage from '../../assets/images/ceo-testimonial.jpeg';
import womenImage from '../../assets/images/women.jpeg';
import youthImage from '../../assets/images/youth.jpeg';

export const CMS_STORAGE_KEY = 'wcdi_cms_content';

export const editablePages = [
  ['home', 'Home'],
  ['about', 'About'],
  ['programs', 'Programs'],
  ['get-involved', 'Get Involved'],
  ['events', 'Events'],
  ['blog', 'Blog']
];

export function getDefaultCmsContent() {
  return {
    pages: {
      home: {
        title: 'Empowering Voices, Transforming Lives',
        text: 'Join us in creating lasting change for women and children through education, healthcare, and economic empowerment programs worldwide.',
        eyebrow: 'Women & Children Development Initiative',
        icon: 'fa-hands-helping',
        backgroundImage: featuredImages.hero
      },
      about: {
        title: 'About WCDI',
        text: 'Making a difference since 2010 through sustainable women and children development programs.',
        eyebrow: 'About Us',
        icon: 'fa-hands-helping'
      },
      programs: {
        title: 'Our Programs',
        text: 'Explore the core initiatives creating lasting community change.',
        eyebrow: 'What We Do',
        icon: 'fa-layer-group'
      },
      'get-involved': {
        title: 'Get Involved',
        text: 'Support through donations, volunteering, partnerships, advocacy, and events.',
        eyebrow: 'Join the Mission',
        icon: 'fa-people-carry'
      },
      events: {
        title: 'Events',
        text: 'Join upcoming trainings, drives, summits, and community health days.',
        eyebrow: 'Community Calendar',
        icon: 'fa-calendar-alt'
      },
      blog: {
        title: 'News & Stories',
        text: 'Read updates, field notes, and volunteer stories from WCDI programs.',
        eyebrow: 'Latest Updates',
        icon: 'fa-newspaper'
      }
    },
    about: {
      sectionTitle: 'Making a Difference Since 2010',
      sectionText: 'We are a non-profit organization dedicated to empowering women and children through sustainable development programs.',
      missionTitle: 'Our Mission & Vision',
      missionText: 'To create a world where every woman and child has access to quality education, healthcare, and economic opportunities, enabling them to reach their full potential and break the cycle of poverty.',
      bullets: ['15+ Years of dedicated service', '50,000+ Lives transformed globally', '90% of donations go directly to programs']
    },
    programs: programs.map((program) => ({ ...program })),
    events: events.map(([day, month, title, text]) => ({ day, month, title, text })),
    posts: posts.map(([category, title, text, image]) => ({ category, title, text, image })),
    team: [
      { name: 'Grace Wanjiku', role: 'Founder & Executive Director', bio: 'Leads WCDI strategy, partnerships, and community-centered program growth.', image: ceoImage, linkedin: 'https://www.linkedin.com/' },
      { name: 'Amina Odhiambo', role: 'Programs Coordinator', bio: 'Coordinates education, health, and outreach initiatives with local partners.', image: womenImage, linkedin: 'https://www.linkedin.com/' },
      { name: 'Brian Mwangi', role: 'Youth Engagement Lead', bio: 'Supports youth mentorship, volunteer mobilization, and field activities.', image: youthImage, linkedin: 'https://www.linkedin.com/' }
    ],
    testimonials: [
      { name: 'Mary Achieng', role: 'Parent Beneficiary', quote: 'WCDI helped my children return to school with confidence and the supplies they needed.', image: ceoTestimonialImage, linkedin: 'https://www.linkedin.com/' },
      { name: 'Sarah Njeri', role: 'Volunteer Mentor', quote: 'The programs are practical, caring, and built around what families truly need.', image: womenImage, linkedin: 'https://www.linkedin.com/' },
      { name: 'James Otieno', role: 'Community Partner', quote: 'Working with WCDI has strengthened our community outreach and support systems.', image: youthImage, linkedin: 'https://www.linkedin.com/' }
    ],
    involvement: [
      { icon: 'fa-heart', title: 'Donate', text: 'Fund programs that improve education, healthcare, and economic opportunity.', href: '/donate' },
      { icon: 'fa-user-plus', title: 'Volunteer', text: 'Offer your skills locally or remotely through WCDI projects.', href: '/volunteer' },
      { icon: 'fa-handshake', title: 'Partner', text: 'Collaborate on programs, events, advocacy, and community outreach.', href: '/contact' }
    ]
  };
}

export function readCmsContent() {
  try {
    const stored = JSON.parse(localStorage.getItem(CMS_STORAGE_KEY) || 'null');
    return mergeCmsContent(getDefaultCmsContent(), stored);
  } catch {
    return getDefaultCmsContent();
  }
}

export function writeCmsContent(content) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event('wcdi-cms-updated'));
}

export function resetCmsContent() {
  const defaults = getDefaultCmsContent();
  writeCmsContent(defaults);
  return defaults;
}

function mergeCmsContent(defaults, stored) {
  if (!stored || typeof stored !== 'object') return defaults;
  return {
    ...defaults,
    ...stored,
    pages: { ...defaults.pages, ...(stored.pages || {}) },
    about: { ...defaults.about, ...(stored.about || {}) },
    programs: Array.isArray(stored.programs) ? stored.programs : defaults.programs,
    events: Array.isArray(stored.events) ? stored.events : defaults.events,
    posts: Array.isArray(stored.posts) ? stored.posts : defaults.posts,
    team: Array.isArray(stored.team) ? stored.team : defaults.team,
    testimonials: Array.isArray(stored.testimonials) ? stored.testimonials : defaults.testimonials,
    involvement: Array.isArray(stored.involvement) ? stored.involvement : defaults.involvement
  };
}
