export const WEDDING_DATA = {
  couple: {
    groom: 'Pratyush',
    bride: 'Sayanee',
    monogram: 'P · S',
    // ✏️ Please confirm the Bengali spellings with the families.
    bengaliNames: 'প্রত্যূষ ও সায়নী',
    hashtag: '#PratyushWedsSayanee',
    tagline: 'Together in Kolkata',
    dateRange: '16 February 2027',
    weddingDateLabel: '16 February 2027',
    city: 'Kolkata',
    ceremonyISO: '2027-02-16T19:00:00+05:30',
    whatsappNumber: '919876543210',
    // Self-hosted in /public — relative so it works under the GitHub Pages sub-path.
    musicUrl: './kudmayi.mp3',
    musicLabel: 'Kudmayi',
    shankhaUrl: './shankha.mp3',
  },
  poem: {
    eyebrow: 'Together with their families',
    title: 'Shubho Bibaho',
    quote:
      '“With the blessings of our elders, we invite you to Kolkata to join us for an evening of sacred vows, music, and warm hospitality.”',
  },
  events: [
    {
      id: 'wedding',
      startISO: '2027-02-16T19:00:00+05:30',
      endISO: '2027-02-17T00:00:00+05:30',
      number: 'শুভ বিবাহ',
      eyebrow: 'শুভদৃষ্টি ও সাতপাক · The Sacred Vows',
      title: 'Shubho Biye',
      date: 'Tuesday, 16 February 2027',
      time: '7:00 PM onwards (Shubh Muhurat)',
      venue: 'The Heritage Courtyard',
      city: 'Kolkata',
      description:
        'A spirited Bor Jatri arrival, Shubho Drishti behind betel leaves, seven circles of Saat Paak, Mala Bodol, sacred Sindoor Daan, and a celebratory Pritibhoj feast.',
      dressCode: 'Royal Crimson & Antique Gold',
      dressColor: '#A61C24',
      revealType: 'saptapadi',
      mapsUrl: 'https://maps.google.com/?q=Kolkata,+West+Bengal',
    },
  ],
  ceremonyTimeline: [
    {
      time: '6:30 PM',
      title: 'Bor Jatri & Boron',
      bengali: 'বরযাত্রী ও বরণ',
      detail: 'Welcoming the groom with Shankha, Uludhwani & traditional Aarti.',
    },
    {
      time: '7:15 PM',
      title: 'Shubho Drishti & Saat Paak',
      bengali: 'শুভদৃষ্টি ও সাতপাক',
      detail: 'Seven circles around the groom & the first glance behind betel leaves.',
    },
    {
      time: '8:15 PM',
      title: 'Mala Bodol & Sindoor Daan',
      bengali: 'মালাবদল ও সিঁদুরদান',
      detail: 'Exchange of floral garlands, Saptapadi vows & sacred blessings.',
    },
    {
      time: '9:00 PM',
      title: 'Pritibhoj Feast',
      bengali: 'প্রীতিভোজ',
      detail: 'A candlelit Bengali & pure-veg celebratory dinner under starlight.',
    },
  ],
  gallery: [
    {
      id: '01',
      location: 'The Beginning',
      title: 'Where It Started',
      subtitle: 'Unscripted Afternoons',
      variant: 'palace-courtyard',
      story:
        'What began as an easy conversation turned into long walks, shared playlists, and a quiet certainty neither of us wanted to rush.',
    },
    {
      id: '02',
      location: 'The Proposal',
      title: 'A Quiet Promise',
      subtitle: 'By the Water at Dusk',
      variant: 'lakeside-vows',
      story:
        'As evening lamps flickered against the twilight sky, we promised each other a lifetime of patience, curiosity, and home.',
    },
    {
      id: '03',
      location: 'Heritage',
      title: 'Sacred Traditions',
      subtitle: 'Alpona, Shankha & Sindoor',
      variant: 'floral-kalash',
      story:
        'From brass kalash blessings to fresh marigold garlands, every ritual carries the warmth of the families who shaped us.',
    },
    {
      id: '04',
      location: '16 Feb 2027 · Kolkata',
      title: 'Pratyush & Sayanee',
      subtitle: 'One Sacred Evening',
      variant: 'starlit-terrace',
      story:
        'Your presence in Kolkata is the greatest blessing of all. We cannot wait to celebrate with you.',
    },
  ],
  quiz: [
    {
      q: 'On which evening do Pratyush & Sayanee take their seven sacred vows?',
      options: ['14 February', '16 February', '17 February'],
      answer: 1,
      yes: 'Spot on! The Shubh Muhurat is 7:00 PM on Tuesday, 16 February.',
      no: 'So close! The wedding is on Tuesday, 16 February at 7:00 PM.',
    },
    {
      q: 'What is the suggested colour palette for Shubho Biye?',
      options: ['Emerald & Pistachio', 'Marigold & Ivory', 'Royal Crimson & Gold'],
      answer: 2,
      yes: 'Yes! Classic crimson, heirloom gold & warm ivory.',
      no: 'Not quite — Shubho Biye calls for Royal Crimson & Antique Gold.',
    },
    {
      q: 'How many steps do the couple walk together in the Saptapadi?',
      options: ['Five', 'Seven', 'Nine'],
      answer: 1,
      yes: 'Seven steps, seven vows, one forever.',
      no: 'It’s seven — one vow for every sacred step.',
    },
  ],
  concierge: [
    {
      label: 'Wedding Hashtag',
      value: '#PratyushWedsSayanee',
      detail: 'Share your favourite candid moments & memories with our wedding hashtag.',
    },
    {
      label: 'Travel to Kolkata',
      value: 'Air, Rail & Metro',
      detail: 'Netaji Subhas Chandra Bose International Airport (CCU) & Howrah / Sealdah stations connect Kolkata seamlessly.',
    },
    {
      label: 'February Weather',
      value: '25°C Days · 13°C Nights',
      detail: 'Crisp winter evenings and pleasant weather—carry a light shawl for the outdoor courtyard.',
    },
    {
      label: 'Culinary Note',
      value: 'Bengali & Vegetarian Feasts',
      detail: 'Traditional Bengali delicacies alongside dedicated Vegetarian, Jain & vegan counters at the Pritibhoj.',
    },
  ],
};
