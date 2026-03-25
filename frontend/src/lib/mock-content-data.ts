import type {
  ContentRecord,
  ContentQueueStats,
} from "@/types/content-review";

export const MOCK_CONTENT_STATS: ContentQueueStats = {
  pending: 8,
  assignedToMe: 3,
  inReview: 2,
  completedToday: 15,
};

export const MOCK_CONTENT_RECORDS: ContentRecord[] = [
  {
    id: "cnt-001",
    productName: "Desert Safari with BBQ Dinner",
    destination: "Dubai",
    category: "attractions",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "desert safari dubai",
    contentFields: {
      shortDesc:
        "Experience the thrill of Dubai's Arabian desert with an unforgettable desert safari adventure. Enjoy exhilarating dune bashing, camel riding, sandboarding, and a traditional BBQ dinner under the stars with live entertainment.",
      longDesc:
        "Embark on the ultimate Dubai desert experience with our premium Desert Safari with BBQ Dinner package. Your adventure begins with a hotel pickup in a comfortable 4x4 vehicle, taking you deep into the Dubai Desert Conservation Reserve.\n\nFeel the adrenaline rush as your expert driver navigates the golden sand dunes during an exciting dune bashing session. Try your hand at sandboarding down steep dunes, or enjoy a peaceful camel ride across the desert landscape as the sun begins to set.\n\nAs evening falls, arrive at our traditional Bedouin-style camp where a feast of flavors awaits. Enjoy a lavish BBQ dinner featuring grilled meats, fresh salads, and Middle Eastern specialties while watching mesmerizing belly dance and tanoura performances. Capture stunning desert sunset photos, get a henna tattoo, or simply relax with shisha under the starlit Arabian sky.\n\nThis 6-hour experience includes hotel pickup and drop-off, making it a hassle-free way to discover the magic of the Dubai desert.",
      metaTitle: "Desert Safari Dubai with BBQ Dinner | Book Online - RaynaTours",
      metaDescription:
        "Book the best desert safari in Dubai with BBQ dinner, dune bashing, camel riding & live entertainment. 6-hour experience with hotel pickup. Book now!",
      faq: [
        {
          question: "What is included in the desert safari package?",
          answer:
            "The package includes hotel pickup and drop-off, dune bashing in a 4x4, camel riding, sandboarding, BBQ dinner, live entertainment (belly dance & tanoura show), henna painting, and shisha.",
        },
        {
          question: "How long is the desert safari experience?",
          answer:
            "The entire experience lasts approximately 6 hours, including hotel transfers. The camp activities and dinner typically take 3-4 hours.",
        },
        {
          question: "Is the desert safari suitable for children?",
          answer:
            "Yes, children aged 3 and above can join the safari. Children under 3 are not recommended for dune bashing. Special child-friendly activities are available at the camp.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Desert Safari with BBQ Dinner",
  "description": "Experience Dubai's Arabian desert with dune bashing, camel riding, and BBQ dinner",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 24.9872,
    "longitude": 55.6497
  }
}`,
      tags: [
        "desert safari",
        "dubai",
        "dune bashing",
        "bbq dinner",
        "camel riding",
        "outdoor adventure",
        "evening tour",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-25T08:00:00Z",
    updatedAt: "2026-03-25T08:00:00Z",
  },
  {
    id: "cnt-002",
    productName: "Atlantis The Palm",
    destination: "Dubai",
    category: "hotels",
    generationAttempt: 2,
    maxAttempts: 3,
    primaryKeyword: "atlantis the palm dubai",
    contentFields: {
      shortDesc:
        "Stay at the iconic Atlantis The Palm, Dubai's most recognizable luxury resort on the crescent of Palm Jumeirah. Featuring world-class dining, Aquaventure Waterpark, and The Lost Chambers Aquarium.",
      longDesc:
        "Welcome to Atlantis The Palm, an architectural marvel and one of Dubai's most beloved landmarks perched at the apex of the Palm Jumeirah. This magnificent 5-star resort offers an unparalleled luxury experience with 1,548 elegantly appointed rooms and suites, each offering stunning views of the Arabian Gulf or the Palm.\n\nIndulge in culinary excellence at over 30 restaurants and bars, including Nobu, Ossiano (underwater dining), and Gordon Ramsay's Bread Street Kitchen. Thrill-seekers will love Aquaventure Waterpark, the Middle East's largest waterpark, featuring record-breaking slides and a private beach.\n\nExplore The Lost Chambers Aquarium, home to 65,000 marine animals, or pamper yourself at ShuiQi Spa. For an exclusive experience, upgrade to a Neptune or Poseidon suite with floor-to-ceiling views of the Ambassador Lagoon.\n\nWith direct beach access, a kids' club, and world-class entertainment, Atlantis The Palm is the ultimate destination for families, couples, and luxury travelers visiting Dubai.",
      metaTitle:
        "Atlantis The Palm Dubai - Luxury Resort | Book Best Rates - RaynaTours",
      metaDescription:
        "Book Atlantis The Palm Dubai - iconic 5-star resort on Palm Jumeirah with Aquaventure Waterpark, 30+ restaurants & stunning ocean views. Best rates guaranteed!",
      faq: [
        {
          question: "Does Atlantis The Palm include Aquaventure access?",
          answer:
            "Yes, all hotel guests receive complimentary unlimited access to Aquaventure Waterpark and The Lost Chambers Aquarium throughout their stay.",
        },
        {
          question: "What dining options are available?",
          answer:
            "Atlantis features over 30 restaurants and bars including Nobu, Ossiano (underwater dining), Bread Street Kitchen by Gordon Ramsay, Hakkasan, and Seafire Steakhouse.",
        },
        {
          question: "How far is Atlantis from Dubai Airport?",
          answer:
            "Atlantis The Palm is approximately 40 minutes from Dubai International Airport (DXB) by car. The resort can arrange private transfers upon request.",
        },
        {
          question: "Is there a private beach?",
          answer:
            "Yes, Atlantis has a 700-meter private beach exclusively for hotel guests, with complimentary sun loungers, towels, and beach service.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Atlantis The Palm",
  "starRating": { "@type": "Rating", "ratingValue": "5" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Crescent Rd, The Palm Jumeirah",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Private Beach" },
    { "@type": "LocationFeatureSpecification", "name": "Waterpark" },
    { "@type": "LocationFeatureSpecification", "name": "Spa" }
  ]
}`,
      tags: [
        "atlantis",
        "palm jumeirah",
        "luxury hotel",
        "dubai resort",
        "aquaventure",
        "5-star",
        "beachfront",
        "family resort",
      ],
    },
    assignedTo: "Sarah K.",
    status: "in_review",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T14:00:00Z",
    updatedAt: "2026-03-25T09:30:00Z",
  },
  {
    id: "cnt-003",
    productName: "Dubai Airport Private Transfer",
    destination: "Dubai",
    category: "transfers",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "dubai airport transfer",
    contentFields: {
      shortDesc:
        "Book a hassle-free private car transfer from Dubai International Airport to your hotel. Meet and greet service with name board, flight tracking, and 24/7 availability for a comfortable arrival.",
      longDesc:
        "Start your Dubai holiday stress-free with our premium Dubai Airport Private Transfer service. A professional, English-speaking chauffeur will meet you at the arrivals hall holding a name board, ready to assist with your luggage and escort you to a clean, air-conditioned vehicle.\n\nOur service includes real-time flight tracking, so your driver will be there even if your flight is delayed. Enjoy complimentary bottled water and WiFi during your comfortable ride to any hotel in Dubai, including Palm Jumeirah, Downtown, Dubai Marina, and JBR.\n\nAvailable 24 hours a day, 7 days a week, with sedan options for up to 3 passengers or luxury SUVs for families and groups. Child seats are available upon request at no extra charge.\n\nBooking is instant with free cancellation up to 24 hours before arrival. Simply provide your flight details and hotel address, and we'll handle the rest.",
      metaTitle: "Dubai Airport Transfer - Private Car Service | Book Online - RaynaTours",
      metaDescription:
        "Book private Dubai airport transfer with meet & greet, flight tracking & 24/7 service. Sedan & SUV options. Instant confirmation, free cancellation!",
      faq: [
        {
          question: "Where will the driver meet me?",
          answer:
            "Your driver will meet you at the arrivals hall exit with a name board. You'll receive the driver's contact details via SMS/WhatsApp before arrival.",
        },
        {
          question: "What happens if my flight is delayed?",
          answer:
            "We track all flights in real-time. Your driver will adjust their arrival time automatically. There is no extra charge for flight delays.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dubai Airport Private Transfer",
  "serviceType": "Airport Transfer",
  "areaServed": {
    "@type": "City",
    "name": "Dubai"
  },
  "provider": {
    "@type": "Organization",
    "name": "RaynaTours"
  }
}`,
      tags: [
        "airport transfer",
        "dubai airport",
        "private car",
        "meet and greet",
        "hotel transfer",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-25T06:00:00Z",
    updatedAt: "2026-03-25T06:00:00Z",
  },
  {
    id: "cnt-004",
    productName: "Pierchic Restaurant",
    destination: "Dubai",
    category: "restaurants",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "pierchic restaurant dubai",
    contentFields: {
      shortDesc:
        "Dine at Pierchic, Dubai's most romantic seafood restaurant set at the end of a private pier at Madinat Jumeirah. Award-winning Mediterranean cuisine with stunning Arabian Gulf views.",
      longDesc:
        "Perched at the end of a private pier extending into the Arabian Gulf, Pierchic is Dubai's premier seafood destination and one of the city's most iconic dining experiences. Located at the Al Qasr hotel within the Madinat Jumeirah resort, this award-winning restaurant offers an unrivaled combination of exceptional cuisine and breathtaking ocean views.\n\nThe menu showcases the finest Mediterranean-inspired seafood, crafted from sustainably sourced ingredients flown in daily. Signature dishes include the Alaskan king crab, grilled Mediterranean sea bass, and the legendary Pierchic seafood platter. The extensive wine list features over 200 labels curated to complement every dish.\n\nWhether you're celebrating a special occasion or seeking a memorable evening, Pierchic delivers an intimate atmosphere with its overwater setting, soft lighting, and impeccable service. Sunset dining is particularly magical, with the Burj Al Arab providing a stunning backdrop.\n\nSmart casual dress code applies. Reservations are highly recommended, especially for weekend evenings and outdoor terrace seating.",
      metaTitle: "Pierchic Restaurant Dubai - Seafood Fine Dining | Reserve - RaynaTours",
      metaDescription:
        "Reserve a table at Pierchic Dubai - award-winning overwater seafood restaurant at Madinat Jumeirah. Stunning views, Mediterranean cuisine. Book now!",
      faq: [
        {
          question: "Do I need a reservation?",
          answer:
            "Yes, reservations are highly recommended as Pierchic is one of Dubai's most popular restaurants. Weekend evenings typically book up 2-3 weeks in advance.",
        },
        {
          question: "What is the dress code?",
          answer:
            "Smart casual attire is required. No beachwear, shorts, or flip-flops. Gentlemen are encouraged to wear collared shirts.",
        },
        {
          question: "Is there outdoor seating?",
          answer:
            "Yes, Pierchic offers both indoor and outdoor terrace seating. The outdoor terrace provides stunning views of the Arabian Gulf and Burj Al Arab.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Pierchic",
  "servesCuisine": "Mediterranean Seafood",
  "priceRange": "$$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Qasr Hotel, Madinat Jumeirah",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "2341"
  }
}`,
      tags: [
        "pierchic",
        "seafood restaurant",
        "fine dining",
        "madinat jumeirah",
        "romantic dinner",
        "dubai dining",
      ],
    },
    assignedTo: "Ahmed R.",
    status: "approved",
    publishFlag: true,
    reviewedBy: "Ahmed R.",
    createdAt: "2026-03-24T10:00:00Z",
    updatedAt: "2026-03-24T16:00:00Z",
  },
  {
    id: "cnt-005",
    productName: "Louvre Abu Dhabi Skip-the-Line Tickets",
    destination: "Abu Dhabi",
    category: "attractions",
    generationAttempt: 3,
    maxAttempts: 3,
    primaryKeyword: "louvre abu dhabi tickets",
    contentFields: {
      shortDesc:
        "Skip the queues at the magnificent Louvre Abu Dhabi with pre-booked tickets. Explore 12 stunning galleries showcasing art and artifacts from ancient civilizations to contemporary works, all beneath the iconic dome.",
      longDesc:
        "Discover the Louvre Abu Dhabi, a cultural masterpiece designed by Pritzker Prize-winning architect Jean Nouvel, located on Saadiyat Island's Cultural District. With skip-the-line tickets, bypass the queues and step directly into one of the world's most extraordinary museums.\n\nBeneath the stunning 180-meter dome — a 'rain of light' architectural wonder — explore 12 interconnected galleries arranged in chronological order. The permanent collection spans thousands of years of human creativity, from Neolithic tools to works by Picasso, Mondrian, and Ai Weiwei.\n\nHighlights include Leonardo da Vinci's 'La Belle Ferronnière', a rare Standing Bactrian Princess, and a leaf from the Blue Quran. The museum's unique concept presents art in a global context, revealing connections between civilizations rather than separating them.\n\nAudio guides are available in multiple languages (included with your ticket). The museum also features a children's museum, rotating exhibitions, a waterfront promenade, and the Art Lounge café with views of the Gulf.\n\nAllow 2-3 hours for a comprehensive visit. The museum is closed on Mondays.",
      metaTitle:
        "Louvre Abu Dhabi Tickets - Skip the Line | Book Online - RaynaTours",
      metaDescription:
        "Book Louvre Abu Dhabi skip-the-line tickets. Explore 12 galleries, iconic dome architecture & world-class art. Audio guide included. Book now!",
      faq: [
        {
          question: "How long should I plan for my visit?",
          answer:
            "We recommend allowing 2-3 hours for a comprehensive visit. Art enthusiasts may want to spend 4+ hours to fully appreciate all galleries and temporary exhibitions.",
        },
        {
          question: "Is an audio guide included?",
          answer:
            "Yes, a multimedia audio guide is included with your ticket. It's available in Arabic, English, French, German, Hindi, Japanese, Korean, Mandarin, and Russian.",
        },
        {
          question: "When is the museum open?",
          answer:
            "The Louvre Abu Dhabi is open Saturday to Wednesday from 10:00 AM to 6:30 PM, and Thursday to Friday from 10:00 AM to 8:30 PM. The museum is closed on Mondays.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Museum",
  "name": "Louvre Abu Dhabi",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Saadiyat Island Cultural District",
    "addressLocality": "Abu Dhabi",
    "addressCountry": "AE"
  },
  "openingHours": "Sa-We 10:00-18:30, Th-Fr 10:00-20:30"
}`,
      tags: [
        "louvre abu dhabi",
        "museum",
        "saadiyat island",
        "art gallery",
        "skip the line",
        "culture",
      ],
    },
    assignedTo: "Priya M.",
    status: "in_review",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-23T12:00:00Z",
    updatedAt: "2026-03-25T10:00:00Z",
  },
  {
    id: "cnt-006",
    productName: "Bosphorus Dinner Cruise",
    destination: "Istanbul",
    category: "attractions",
    generationAttempt: 2,
    maxAttempts: 3,
    primaryKeyword: "bosphorus dinner cruise istanbul",
    contentFields: {
      shortDesc:
        "Sail along Istanbul's legendary Bosphorus strait on an enchanting dinner cruise. Enjoy a 4-course Turkish feast with live music and belly dancing while admiring illuminated palaces and bridges.",
      longDesc:
        "Experience Istanbul from the water on our spectacular Bosphorus Dinner Cruise. As the sun sets over the city where East meets West, board a luxurious yacht and embark on a 3-hour journey along the world-famous Bosphorus strait.\n\nSavor a sumptuous 4-course Turkish dinner featuring mezes, grilled kebabs, fresh seafood, and traditional desserts, complemented by soft drinks and Turkish tea. Upgrade to an unlimited drinks package for wine, beer, and spirits.\n\nAs you cruise between Europe and Asia, marvel at Istanbul's most iconic landmarks beautifully illuminated against the night sky: the majestic Dolmabahce Palace, the towering Bosphorus Bridge, the historic Maiden's Tower, and the stunning Ortakoy Mosque.\n\nOnboard entertainment includes live Turkish music, a mesmerizing belly dance show, and a whirling dervish performance. VIP seating options offer prime deck positions for photography enthusiasts.\n\nHotel pickup and drop-off from Sultanahmet, Taksim, and Besiktas districts is included.",
      metaTitle:
        "Bosphorus Dinner Cruise Istanbul | Book Online - RaynaTours",
      metaDescription:
        "Book a magical Bosphorus dinner cruise in Istanbul. 4-course Turkish dinner, live music, belly dancing & illuminated city views. Hotel pickup included!",
      faq: [
        {
          question: "What time does the cruise depart?",
          answer:
            "The cruise departs at 8:00 PM and returns at approximately 11:00 PM. Hotel pickup begins at 6:30 PM depending on your location.",
        },
        {
          question: "Is alcohol served on the cruise?",
          answer:
            "Soft drinks and Turkish tea are included. An unlimited alcoholic drinks package (wine, beer, spirits) is available as an upgrade.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Bosphorus Dinner Cruise",
  "description": "Evening dinner cruise along the Bosphorus strait in Istanbul",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Istanbul",
    "addressCountry": "TR"
  }
}`,
      tags: [
        "bosphorus cruise",
        "istanbul",
        "dinner cruise",
        "turkish dinner",
        "night tour",
        "belly dancing",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-25T02:00:00Z",
    updatedAt: "2026-03-25T02:00:00Z",
  },
  {
    id: "cnt-007",
    productName: "Wat Pho Temple & Reclining Buddha Tour",
    destination: "Bangkok",
    category: "attractions",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "wat pho temple bangkok",
    contentFields: {
      shortDesc:
        "Discover the magnificent Wat Pho temple, home to Thailand's largest Reclining Buddha at 46 meters. A guided tour through one of Bangkok's oldest and most sacred temple complexes with optional Thai massage.",
      longDesc:
        "Visit Wat Pho, one of Bangkok's most revered and historically significant temples, home to the spectacular 46-meter-long gold-plated Reclining Buddha. This guided tour takes you through the sprawling temple complex that dates back to the 16th century.\n\nYour expert local guide will share the fascinating history and spiritual significance of this UNESCO-recognized temple. Marvel at the intricate mother-of-pearl inlay on the soles of the Buddha's feet, depicting 108 auspicious symbols from Buddhist cosmology.\n\nExplore the temple grounds featuring 91 chedis (stupas), 394 gilded Buddha images, and beautiful Chinese rock gardens. The temple is also the birthplace of traditional Thai massage, and you can optionally receive an authentic Thai massage at the temple's renowned Wat Pho Thai Traditional Medical and Massage School.\n\nThis 2-hour guided tour includes skip-the-line entry, bottled water, and detailed commentary in English. Comfortable walking shoes and modest clothing covering shoulders and knees are required.",
      metaTitle: "Wat Pho Temple Tour Bangkok - Reclining Buddha | Book - RaynaTours",
      metaDescription:
        "Book a guided tour of Wat Pho temple in Bangkok. See the 46m Reclining Buddha, explore ancient stupas & enjoy optional Thai massage. Skip-the-line!",
      faq: [
        {
          question: "What should I wear to the temple?",
          answer:
            "Modest clothing covering shoulders and knees is required. No sleeveless tops, shorts, or short skirts. Sarongs are available to borrow at the entrance if needed.",
        },
        {
          question: "Is the Thai massage included in the tour price?",
          answer:
            "The Thai massage is optional and not included in the base tour price. You can add a 30-minute or 60-minute traditional Thai massage at an additional cost.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Wat Pho (Temple of the Reclining Buddha)",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2 Sanam Chai Rd, Phra Nakhon",
    "addressLocality": "Bangkok",
    "addressCountry": "TH"
  }
}`,
      tags: [
        "wat pho",
        "reclining buddha",
        "bangkok temple",
        "thai culture",
        "guided tour",
        "UNESCO",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-25T01:00:00Z",
    updatedAt: "2026-03-25T01:00:00Z",
  },
  {
    id: "cnt-008",
    productName: "Shangri-La Bosphorus Hotel",
    destination: "Istanbul",
    category: "hotels",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "shangri-la bosphorus istanbul",
    contentFields: {
      shortDesc:
        "Experience luxury at the Shangri-La Bosphorus, a prestigious 5-star hotel on Istanbul's European shore with panoramic waterfront views, award-winning dining, and the renowned CHI Spa.",
      longDesc:
        "Nestled on the European shores of the Bosphorus in the prestigious Besiktas district, the Shangri-La Bosphorus Istanbul is a haven of refined luxury and Turkish hospitality. This magnificent 5-star hotel offers 186 elegantly designed rooms and suites, many featuring private balconies with sweeping views of the Bosphorus and the Asian shoreline.\n\nCulinary excellence is at the heart of the Shangri-La experience. Dine at the acclaimed Shang Palace, one of Istanbul's finest Chinese restaurants, or enjoy all-day dining at IST TOO with its live cooking stations and panoramic terrace. The Lobby Lounge serves traditional afternoon tea with views of the strait.\n\nRelax at CHI, The Spa, a tranquil sanctuary offering signature treatments inspired by Asian healing philosophies. The indoor swimming pool and state-of-the-art fitness center overlook the Bosphorus.\n\nThe hotel's prime location provides easy access to Istanbul's major attractions: Dolmabahce Palace is a 5-minute walk, while the Grand Bazaar and Hagia Sophia are 15 minutes by car. A complimentary shuttle service operates to Taksim Square.",
      metaTitle:
        "Shangri-La Bosphorus Istanbul - 5-Star Luxury Hotel | Book - RaynaTours",
      metaDescription:
        "Book Shangri-La Bosphorus Istanbul - luxury 5-star hotel with Bosphorus views, CHI Spa, Shang Palace restaurant. Prime Besiktas location. Best rates!",
      faq: [
        {
          question: "What views do the rooms offer?",
          answer:
            "Rooms are available with Bosphorus views, city views, or garden views. Bosphorus-view rooms and suites offer the most spectacular panoramas and can be requested during booking.",
        },
        {
          question: "Is there airport shuttle service?",
          answer:
            "The hotel offers private airport transfer service for an additional fee. A complimentary shuttle runs to Taksim Square at scheduled times throughout the day.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Shangri-La Bosphorus, Istanbul",
  "starRating": { "@type": "Rating", "ratingValue": "5" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sinanpasa Mah, Hayrettin Iskelesi Sok No. 1",
    "addressLocality": "Istanbul",
    "addressCountry": "TR"
  }
}`,
      tags: [
        "shangri-la",
        "bosphorus hotel",
        "istanbul luxury",
        "5-star",
        "waterfront",
        "spa hotel",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T20:00:00Z",
    updatedAt: "2026-03-24T20:00:00Z",
  },
  {
    id: "cnt-009",
    productName: "Abu Dhabi to Dubai Shared Shuttle",
    destination: "Abu Dhabi",
    category: "transfers",
    generationAttempt: 3,
    maxAttempts: 3,
    primaryKeyword: "abu dhabi dubai shuttle",
    contentFields: {
      shortDesc:
        "Affordable shared shuttle service between Abu Dhabi city center and Dubai Mall. Air-conditioned minivan with WiFi, departing every 2 hours from early morning to evening.",
      longDesc:
        "Travel comfortably between Abu Dhabi and Dubai with our reliable shared shuttle service. Our modern, air-conditioned minivans depart every 2 hours from Abu Dhabi's central bus station on Hamdan Street, arriving at Dubai Mall within approximately 90 minutes.\n\nEach vehicle is equipped with complimentary WiFi and USB charging ports, so you can stay connected during your journey. The service runs daily from 7:00 AM to 9:00 PM, giving you flexibility to plan your day.\n\nThe shuttle is perfect for day-trippers wanting to explore Dubai's attractions, shoppers heading to Dubai Mall, or travelers connecting between the two cities on a budget. One-way and return tickets are available.\n\nLuggage allowance includes one carry-on bag and one medium suitcase per passenger. Additional luggage can be accommodated based on availability.",
      metaTitle:
        "Abu Dhabi to Dubai Shuttle - Shared Transfer | Book - RaynaTours",
      metaDescription:
        "Book Abu Dhabi to Dubai shared shuttle. Air-conditioned minivan, WiFi, every 2 hours. From AED 55 per person. Book your seat now!",
      faq: [
        {
          question: "How often do shuttles depart?",
          answer:
            "Shuttles depart every 2 hours from 7:00 AM to 9:00 PM daily from both Abu Dhabi and Dubai.",
        },
        {
          question: "Where is the pickup point in Abu Dhabi?",
          answer:
            "The pickup point is at Abu Dhabi Central Bus Station on Hamdan Street, near the Al Wahda Mall. The exact meeting point details are sent via email after booking.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "BusTrip",
  "name": "Abu Dhabi to Dubai Shared Shuttle",
  "departureStation": "Abu Dhabi Bus Station",
  "arrivalStation": "Dubai Mall"
}`,
      tags: [
        "shuttle",
        "abu dhabi to dubai",
        "shared transfer",
        "intercity",
        "budget travel",
      ],
    },
    assignedTo: "Sarah K.",
    status: "rejected",
    publishFlag: false,
    reviewedBy: "Sarah K.",
    createdAt: "2026-03-23T08:00:00Z",
    updatedAt: "2026-03-25T07:00:00Z",
  },
  {
    id: "cnt-010",
    productName: "Grand Bazaar Guided Walking Tour",
    destination: "Istanbul",
    category: "attractions",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "grand bazaar tour istanbul",
    contentFields: {
      shortDesc:
        "Explore Istanbul's legendary Grand Bazaar with a local expert guide. Navigate 3,000+ shops across 61 covered streets, discover hidden gems, and learn the art of Turkish haggling.",
      longDesc:
        "Step into one of the world's oldest and largest covered markets on our Grand Bazaar Guided Walking Tour. With over 500 years of history and 3,000+ shops sprawled across 61 covered streets, the Grand Bazaar can be overwhelming — but with our expert local guide, you'll discover its best-kept secrets.\n\nYour 2.5-hour journey begins at the historic Beyazit Gate, where your guide sets the scene with stories of the bazaar's Ottoman origins. Wander through the jewelry quarter, textile lanes, and ceramic workshops, learning to distinguish authentic Turkish craftsmanship from mass-produced souvenirs.\n\nStop for a glass of traditional Turkish tea at a hidden caravanserai, a centuries-old resting place for Silk Road traders. Your guide will teach you the art of friendly haggling — an essential part of the Turkish shopping experience.\n\nDiscover the bazaar's architectural highlights including ornate painted ceilings, ancient fountains, and the original sandstone walls. The tour ends near the Spice Bazaar, where you can continue exploring independently.\n\nSmall group sizes (maximum 15) ensure a personal experience with plenty of time for questions.",
      metaTitle:
        "Grand Bazaar Walking Tour Istanbul - Guided | Book - RaynaTours",
      metaDescription:
        "Book a guided Grand Bazaar walking tour in Istanbul. Expert local guide, 3,000+ shops, Turkish tea, haggling tips. Small groups. Book now!",
      faq: [
        {
          question: "Is shopping time included?",
          answer:
            "Yes, there are designated stops where you can browse and purchase items. Your guide can help with price negotiations and identifying authentic products.",
        },
        {
          question: "What days is the Grand Bazaar open?",
          answer:
            "The Grand Bazaar is open Monday through Saturday, 8:30 AM to 7:00 PM. It is closed on Sundays and public holidays. Tours run on open days only.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Grand Bazaar",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Beyazit Mahallesi",
    "addressLocality": "Istanbul",
    "addressCountry": "TR"
  }
}`,
      tags: [
        "grand bazaar",
        "istanbul",
        "walking tour",
        "shopping",
        "guided tour",
        "culture",
        "ottoman history",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T18:00:00Z",
    updatedAt: "2026-03-24T18:00:00Z",
  },
  {
    id: "cnt-011",
    productName: "Muay Thai Boxing Experience",
    destination: "Bangkok",
    category: "attractions",
    generationAttempt: 2,
    maxAttempts: 3,
    primaryKeyword: "muay thai bangkok",
    contentFields: {
      shortDesc:
        "Witness the excitement of live Muay Thai boxing at Bangkok's legendary Rajadamnern Stadium. VIP ringside seats with drinks, plus optional training session with professional fighters.",
      longDesc:
        "Experience Thailand's national sport at its finest with our Muay Thai Boxing Experience at the historic Rajadamnern Stadium, Bangkok's most prestigious boxing venue since 1945.\n\nTake your VIP ringside seat and feel the electric atmosphere as skilled fighters showcase the ancient art of eight limbs. The evening features 8-10 bouts of increasing intensity, from rising amateurs to championship-level professionals.\n\nYour VIP package includes premium seating with unobstructed ring views, two complimentary drinks, and a program guide explaining the fighters' stats and styles. An English commentary option is available via headset.\n\nFor the ultimate experience, add an optional pre-show training session at the stadium's gym. Learn basic Muay Thai techniques — jabs, kicks, elbow strikes, and clinch work — from professional fighters and trainers. No experience necessary; all equipment is provided.\n\nHotel pickup is available from Sukhumvit, Silom, and Khao San Road areas. The event typically runs from 6:30 PM to 10:30 PM.",
      metaTitle: "Muay Thai Boxing Bangkok - Rajadamnern Stadium | Book - RaynaTours",
      metaDescription:
        "Book Muay Thai boxing experience at Bangkok's Rajadamnern Stadium. VIP ringside seats, drinks included. Optional training session. Book now!",
      faq: [
        {
          question: "Is the training session suitable for beginners?",
          answer:
            "Absolutely! The training session is designed for all fitness levels. Professional trainers guide you through basic techniques at your own pace. All equipment (gloves, wraps, pads) is provided.",
        },
        {
          question: "What is the minimum age for attendance?",
          answer:
            "Spectators of all ages are welcome. For the optional training session, participants must be at least 12 years old. Minors must be accompanied by an adult.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Muay Thai Boxing at Rajadamnern Stadium",
  "location": {
    "@type": "StadiumOrArena",
    "name": "Rajadamnern Stadium",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangkok",
      "addressCountry": "TH"
    }
  }
}`,
      tags: [
        "muay thai",
        "bangkok",
        "boxing",
        "rajadamnern stadium",
        "VIP experience",
        "thai culture",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T16:00:00Z",
    updatedAt: "2026-03-24T16:00:00Z",
  },
  {
    id: "cnt-012",
    productName: "Rixos Premium Saadiyat Island",
    destination: "Abu Dhabi",
    category: "hotels",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "rixos premium saadiyat island",
    contentFields: {
      shortDesc:
        "Indulge in all-inclusive luxury at Rixos Premium Saadiyat Island. A 5-star beach resort with pristine white sand, 6 restaurants, world-class spa, and direct access to Abu Dhabi's cultural district.",
      longDesc:
        "Escape to Rixos Premium Saadiyat Island, Abu Dhabi's premier all-inclusive beach resort set along a pristine stretch of white sand on the culturally rich Saadiyat Island. This magnificent 5-star property offers 378 elegantly appointed rooms and suites, each with balcony views of the turquoise Arabian Gulf.\n\nThe all-inclusive concept at Rixos Premium is truly premium. Enjoy six distinctive restaurants including Turkish, Asian, Italian, and seafood cuisines, plus multiple bars and lounges. The highlight is the beachfront grill where you can dine with your feet in the sand.\n\nRelax at Anjana Spa, an expansive wellness destination offering Turkish hammam, a full menu of massages and treatments, and a hydrotherapy pool. The resort also features a state-of-the-art gym, tennis courts, and a water sports center.\n\nFamilies love the Rixy Kids Club with supervised activities for children aged 4-12. The resort's location on Saadiyat Island puts you minutes from the Louvre Abu Dhabi, with complimentary shuttle service available.\n\nGreen turtles nest on the resort's beach between April and July — a unique wildlife experience that sets this property apart.",
      metaTitle:
        "Rixos Premium Saadiyat Island - All-Inclusive Resort | Book - RaynaTours",
      metaDescription:
        "Book Rixos Premium Saadiyat Island - luxury all-inclusive 5-star beach resort in Abu Dhabi. 6 restaurants, spa, kids club. Near Louvre Abu Dhabi!",
      faq: [
        {
          question: "What does all-inclusive cover?",
          answer:
            "The all-inclusive package covers all meals at 6 restaurants, snacks, selected alcoholic and non-alcoholic beverages, minibar replenishment, kids club access, non-motorized water sports, and gym/pool use.",
        },
        {
          question: "How far is the Louvre Abu Dhabi?",
          answer:
            "The Louvre Abu Dhabi is just 5 minutes away by car. The resort offers a complimentary shuttle service to the museum at scheduled times.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Rixos Premium Saadiyat Island",
  "starRating": { "@type": "Rating", "ratingValue": "5" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Saadiyat Island",
    "addressLocality": "Abu Dhabi",
    "addressCountry": "AE"
  }
}`,
      tags: [
        "rixos",
        "saadiyat island",
        "all-inclusive",
        "beach resort",
        "abu dhabi",
        "5-star",
        "family resort",
      ],
    },
    assignedTo: "Ahmed R.",
    status: "approved",
    publishFlag: true,
    reviewedBy: "Ahmed R.",
    createdAt: "2026-03-24T08:00:00Z",
    updatedAt: "2026-03-24T14:00:00Z",
  },
  {
    id: "cnt-013",
    productName: "Chatuchak Weekend Market Food Tour",
    destination: "Bangkok",
    category: "restaurants",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "chatuchak food tour bangkok",
    contentFields: {
      shortDesc:
        "Taste your way through Bangkok's famous Chatuchak Weekend Market on a guided food tour. Sample 10+ authentic Thai street food dishes including mango sticky rice, boat noodles, and coconut ice cream.",
      longDesc:
        "Embark on a delicious 3-hour food adventure through the legendary Chatuchak Weekend Market, one of the world's largest outdoor markets with over 15,000 stalls. Led by a passionate local foodie guide, you'll navigate the market's maze-like lanes to discover hidden food gems that most visitors miss.\n\nYour tasting journey includes 10+ carefully selected dishes representing the diversity of Thai cuisine: crispy pad thai from a family stall operating since the 1970s, creamy coconut ice cream served in a coconut shell, aromatic boat noodles, fresh mango sticky rice, and spicy som tam (papaya salad).\n\nBetween tastings, your guide shares insights into Thai food culture, ingredient secrets, and the stories behind each vendor. Learn to read a Thai menu, understand the balance of flavors (sweet, sour, salty, spicy), and discover which dishes to order at Bangkok's street stalls.\n\nThe tour operates on Saturday and Sunday mornings when the market is at its liveliest. Comfortable walking shoes are recommended. All food tastings, water, and a market orientation map are included.",
      metaTitle:
        "Chatuchak Market Food Tour Bangkok | Book Online - RaynaTours",
      metaDescription:
        "Book a Chatuchak food tour in Bangkok. 10+ Thai street food tastings, local guide, hidden gems. Saturdays & Sundays. Book your spot now!",
      faq: [
        {
          question: "Can dietary restrictions be accommodated?",
          answer:
            "Yes, please note any dietary restrictions when booking. Our guides can substitute dishes for vegetarian, halal, or nut-free alternatives at many stalls.",
        },
        {
          question: "When does the market operate?",
          answer:
            "Chatuchak Weekend Market is open Saturdays and Sundays from 9:00 AM to 6:00 PM. Our food tours run at 9:30 AM and 1:00 PM on both days.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "FoodEvent",
  "name": "Chatuchak Weekend Market Food Tour",
  "location": {
    "@type": "Place",
    "name": "Chatuchak Weekend Market",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangkok",
      "addressCountry": "TH"
    }
  }
}`,
      tags: [
        "chatuchak",
        "food tour",
        "bangkok",
        "street food",
        "thai cuisine",
        "weekend market",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T12:00:00Z",
    updatedAt: "2026-03-24T12:00:00Z",
  },
  {
    id: "cnt-014",
    productName: "Mikla Restaurant",
    destination: "Istanbul",
    category: "restaurants",
    generationAttempt: 1,
    maxAttempts: 3,
    primaryKeyword: "mikla restaurant istanbul",
    contentFields: {
      shortDesc:
        "Dine at Mikla, Istanbul's acclaimed rooftop restaurant atop The Marmara Pera hotel. Modern Turkish-Scandinavian fusion cuisine by Chef Mehmet Gurs with panoramic Golden Horn views.",
      longDesc:
        "Perched on the rooftop of The Marmara Pera hotel in Istanbul's vibrant Beyoglu district, Mikla is a culinary landmark that has redefined modern Turkish cuisine. Under the visionary leadership of Chef Mehmet Gurs — a pioneer of new Anatolian cooking — Mikla crafts dishes that bridge Turkish traditions with Scandinavian precision.\n\nThe tasting menu takes diners on a journey through Anatolia's diverse regions, using heritage ingredients sourced directly from small Turkish producers. Signature dishes include the famous lamb shank with yogurt, sea bass with pomegranate, and the deconstructed baklava that has become an Instagram sensation.\n\nThe restaurant's panoramic terrace offers one of Istanbul's most breathtaking views, sweeping across the Golden Horn to the historic peninsula with its mosques and minarets. The bar area serves innovative cocktails inspired by Turkish botanicals.\n\nMikla consistently ranks among the World's 50 Best Restaurants extended list and holds a Michelin star. Smart elegant dress code applies. Reservations are essential, ideally 2-4 weeks in advance for dinner service.\n\nDinner service: Tuesday to Saturday, 6:30 PM to 11:00 PM.",
      metaTitle: "Mikla Restaurant Istanbul - Rooftop Fine Dining | Reserve - RaynaTours",
      metaDescription:
        "Reserve at Mikla Istanbul - award-winning rooftop restaurant with panoramic views. Turkish-Scandinavian fusion by Chef Mehmet Gurs. Michelin-starred!",
      faq: [
        {
          question: "Does Mikla have a dress code?",
          answer:
            "Yes, smart elegant attire is required. No sportswear, shorts, or flip-flops. Jackets for gentlemen are appreciated but not mandatory.",
        },
        {
          question: "How far in advance should I book?",
          answer:
            "We recommend booking 2-4 weeks in advance for dinner, especially for terrace seating. Lunch reservations are generally easier to secure on shorter notice.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Mikla",
  "servesCuisine": "Turkish-Scandinavian Fusion",
  "priceRange": "$$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "The Marmara Pera, Mesrutiyet Cad No. 15",
    "addressLocality": "Istanbul",
    "addressCountry": "TR"
  }
}`,
      tags: [
        "mikla",
        "istanbul restaurant",
        "rooftop dining",
        "michelin star",
        "turkish fusion",
        "fine dining",
      ],
    },
    assignedTo: "Priya M.",
    status: "approved",
    publishFlag: true,
    reviewedBy: "Priya M.",
    createdAt: "2026-03-23T16:00:00Z",
    updatedAt: "2026-03-24T10:00:00Z",
  },
  {
    id: "cnt-015",
    productName: "Istanbul Airport IST to City Center",
    destination: "Istanbul",
    category: "transfers",
    generationAttempt: 2,
    maxAttempts: 3,
    primaryKeyword: "istanbul airport transfer",
    contentFields: {
      shortDesc:
        "Private sedan transfer from Istanbul Airport (IST) to your hotel in the city center. Professional English-speaking driver, flight monitoring, and 60 minutes of complimentary waiting time.",
      longDesc:
        "Arrive in Istanbul with ease using our private airport transfer service from Istanbul Airport (IST) to any hotel in the city center. Your professional, English-speaking driver will meet you at the arrivals hall with a name board after you've collected your luggage.\n\nThe service includes real-time flight monitoring, so even if your flight is delayed, your driver will be there when you land. Enjoy 60 minutes of complimentary waiting time from the actual landing time, giving you plenty of time to pass through immigration and collect bags.\n\nTravel in comfort in a clean, air-conditioned sedan with complimentary bottled water. The journey to Sultanahmet or Taksim takes approximately 45-60 minutes depending on traffic conditions.\n\nUpgrade options include luxury sedans (Mercedes E-Class), minivans for families (up to 7 passengers), and VIP vehicles (Mercedes V-Class). Child seats are available free of charge upon request.\n\nAvailable 24/7 with instant confirmation. Free cancellation up to 12 hours before your flight arrival.",
      metaTitle:
        "Istanbul Airport Transfer - Private Car to City | Book - RaynaTours",
      metaDescription:
        "Book Istanbul Airport (IST) private transfer to city center. English-speaking driver, flight tracking, 60 min free wait. Sedan & SUV options!",
      faq: [
        {
          question: "How long is the drive to the city center?",
          answer:
            "The drive from Istanbul Airport (IST) to Sultanahmet or Taksim is approximately 45-60 minutes, depending on traffic. Late night or early morning transfers can be as quick as 35 minutes.",
        },
        {
          question: "Can I book a return transfer as well?",
          answer:
            "Yes, return transfers from your hotel to Istanbul Airport are available. Your driver will pick you up from the hotel lobby at your requested time, typically 3-4 hours before your flight departure.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Istanbul Airport Transfer",
  "serviceType": "Airport Transfer",
  "areaServed": {
    "@type": "City",
    "name": "Istanbul"
  }
}`,
      tags: [
        "istanbul airport",
        "airport transfer",
        "private car",
        "IST transfer",
        "city center",
      ],
    },
    assignedTo: null,
    status: "pending",
    publishFlag: false,
    reviewedBy: null,
    createdAt: "2026-03-24T06:00:00Z",
    updatedAt: "2026-03-24T06:00:00Z",
  },
];
