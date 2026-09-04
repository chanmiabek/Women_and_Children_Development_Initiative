import ceoImage from '../../assets/images/ceo.jpeg';
import ceoTestimonialImage from '../../assets/images/ceo-testimonial.jpeg';
import childrenImage from '../../assets/images/children.jpeg';
import childrenActivitiesImage from '../../assets/images/children-activaties.jpeg';
import communityImage from '../../assets/images/community.jpeg';
import communityActivitiesImage from '../../assets/images/community-acivaties.jpeg';
import communityProblemImage from '../../assets/images/community-problem.jpeg';
import gatherImage from '../../assets/images/gather.jpeg';
import problemChildrenImage from '../../assets/images/problem-children.jpeg';
import schoolImage from '../../assets/images/school.jpeg';
import trainingImage from '../../assets/images/WhatsApp Image 2026-06-05 at 09.22.55.jpeg';
import womenImage from '../../assets/images/women.jpeg';
import youthImage from '../../assets/images/youth.jpeg';

export const navLinks = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/programs', 'Programs'],
  ['/get-involved', 'Get Involved'],
  ['/events', 'Events'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact']
];

export const programs = [
  {
    title: 'Education for All',
    icon: 'fa-graduation-cap',
    colors: 'from-blue-500 to-blue-600',
    image: schoolImage,
    text: 'Providing quality education, scholarships, and school supplies to underprivileged children.',
    goal: '$500,000',
    raised: '$425,000',
    progress: 85,
    beneficiaries: '5,234 beneficiaries'
  },
  {
    title: "Women's Healthcare",
    icon: 'fa-heartbeat',
    colors: 'from-pink-500 to-pink-600',
    image: womenImage,
    text: 'Access to maternal health services, medical care, and health education for women.',
    goal: '$350,000',
    raised: '$245,000',
    progress: 70,
    beneficiaries: '3,872 beneficiaries'
  },
  {
    title: 'Economic Empowerment',
    icon: 'fa-briefcase',
    colors: 'from-green-500 to-green-600',
    image: communityActivitiesImage,
    text: 'Skills training, microfinance, and entrepreneurship support for sustainable livelihoods.',
    goal: '$400,000',
    raised: '$320,000',
    progress: 80,
    beneficiaries: '2,156 beneficiaries'
  },
  {
    title: 'Clean Water Access',
    icon: 'fa-tint',
    colors: 'from-cyan-500 to-cyan-600',
    image: communityProblemImage,
    text: 'Safe water systems, sanitation training, and hygiene support for families.',
    goal: '$250,000',
    raised: '$195,000',
    progress: 78,
    beneficiaries: '8,450 beneficiaries'
  },
  {
    title: 'Nutrition Support',
    icon: 'fa-apple-alt',
    colors: 'from-yellow-500 to-orange-500',
    image: childrenActivitiesImage,
    text: 'Meals, nutrition education, and community gardens for children and mothers.',
    goal: '$300,000',
    raised: '$210,000',
    progress: 70,
    beneficiaries: '6,108 beneficiaries'
  },
  {
    title: 'Child Protection',
    icon: 'fa-shield-alt',
    colors: 'from-purple-500 to-purple-600',
    image: problemChildrenImage,
    text: 'Advocacy, counseling, and safe spaces that protect vulnerable children.',
    goal: '$280,000',
    raised: '$224,000',
    progress: 80,
    beneficiaries: '1,948 beneficiaries'
  }
];

export const events = [
  ['15', 'JUN', 'Women Leadership Summit', 'Training, mentorship, and networking for emerging community leaders.'],
  ['22', 'JUL', 'Back-to-School Drive', 'Collecting school supplies and scholarships for children in need.'],
  ['09', 'AUG', 'Community Health Camp', 'Free screenings, maternal health education, and referral support.']
];

export const posts = [
  ['Education', 'How Scholarships Changed 500 Lives', 'Stories from girls whose futures opened through school access.', childrenImage],
  ['Healthcare', 'Mobile Clinics Reach Remote Mothers', 'Our health teams are connecting families with vital care.', gatherImage],
  ['Volunteer', 'Volunteer Spotlight: Making a Difference', 'Meet our dedicated volunteers changing lives in their communities.', ceoTestimonialImage]
];

export const featuredImages = {
  hero: communityImage,
  about: childrenImage ,
  impact: youthImage,
  training: trainingImage
};

export const galleryImages = [
  ['Founder speaking at a community event', ceoImage],
  ['Leadership remarks during outreach', ceoTestimonialImage],
  ['Children learning together in class', childrenImage],
  ['Outdoor session with school children', childrenActivitiesImage],
  ['Community members gathered for support', communityImage],
  ['Community training under the trees', communityActivitiesImage],
  ['Families gathered by the water point', communityProblemImage],
  ['Village meeting and local engagement', gatherImage],
  ['Young children in the community', problemChildrenImage],
  ['School children with WCDI support', schoolImage],
  ['Workshop and stakeholder training', trainingImage],
  ['Women participating in community dialogue', womenImage],
  ['Youth leadership and advocacy moment', youthImage]
];
