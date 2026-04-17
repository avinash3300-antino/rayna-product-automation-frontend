import type { ReviewRecord, ReviewQueueStats } from "@/types/review";

export const MOCK_REVIEW_STATS: ReviewQueueStats = {
  pending: 6,
  assignedToMe: 3,
  inReview: 2,
  completedToday: 12,
};

export const MOCK_REVIEW_RECORDS: ReviewRecord[] = [
  {
    id: "rev-001",
    productName: "Desert Safari with BBQ Dinner",
    destination: "Dubai",
    category: "attractions",
    status: "pending",
    assignedTo: null,
    reviewedBy: null,
    createdAt: "2026-03-28T08:12:00Z",
    updatedAt: "2026-03-28T08:12:00Z",
    // Classification
    normalizedPayload: {
      id: "np-001",
      name: "Desert Safari with BBQ Dinner",
      description:
        "Experience the Arabian desert with dune bashing, camel riding, sandboarding, and a traditional BBQ dinner under the stars. Includes hotel pickup and drop-off.",
      source_url: "https://viator.com/tours/dubai/desert-safari",
      location: {
        address: "Dubai Desert Conservation Reserve",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 24.9872,
        longitude: 55.6497,
      },
      pricing: { currency: "AED", amount: 189, per: "person" },
      images: ["https://images.example.com/safari-1.jpg"],
      raw_category: "outdoor_activity",
      source_metadata: { duration_hours: 6, rating: 4.6, reviews: 8934 },
    },
    source: "Viator API",
    confidenceScore: 0.91,
    predictedCategory: "attractions",
    classifierRationale:
      "Activity-based listing with 'tours', 'experience', 'camel riding'. Priced per-person. Viator is a tours/activities platform. Duration indicates a day activity.",
    finalCategory: null,
    reviewNotes: null,
    // Content
    primaryKeyword: "desert safari dubai",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Experience the thrill of Dubai's Arabian desert with an unforgettable desert safari adventure. Enjoy exhilarating dune bashing, camel riding, sandboarding, and a traditional BBQ dinner under the stars with live entertainment.",
      longDesc:
        "Embark on the ultimate Dubai desert experience with our premium Desert Safari with BBQ Dinner package. Your adventure begins with a hotel pickup in a comfortable 4x4 vehicle, taking you deep into the Dubai Desert Conservation Reserve.\n\nFeel the adrenaline rush as your expert driver navigates the golden sand dunes during an exciting dune bashing session. Try your hand at sandboarding down steep dunes, or enjoy a peaceful camel ride across the desert landscape as the sun begins to set.\n\nAs evening falls, arrive at our traditional Bedouin-style camp where a feast of flavors awaits. Enjoy a lavish BBQ dinner featuring grilled meats, fresh salads, and Middle Eastern specialties while watching mesmerizing belly dance and tanoura performances.",
      metaTitle:
        "Desert Safari Dubai with BBQ Dinner | Book Online - RaynaTours",
      metaDescription:
        "Book the best desert safari in Dubai with BBQ dinner, dune bashing, camel riding & live entertainment. 6-hour experience with hotel pickup. Book now!",
      faq: [
        {
          question: "What is included in the desert safari package?",
          answer:
            "The package includes hotel pickup and drop-off, dune bashing in a 4x4, camel riding, sandboarding, BBQ dinner, live entertainment, henna painting, and shisha.",
        },
        {
          question: "How long is the desert safari experience?",
          answer:
            "The entire experience lasts approximately 6 hours, including hotel transfers.",
        },
        {
          question: "Is the desert safari suitable for children?",
          answer:
            "Yes, children aged 3 and above can join. Children under 3 are not recommended for dune bashing.",
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
  }
}`,
      tags: [
        "desert safari",
        "dubai",
        "dune bashing",
        "bbq dinner",
        "camel riding",
        "outdoor adventure",
      ],
      googleReviews: [
        {
          reviewer: "James M.",
          rating: 5,
          text: "Absolutely incredible experience! The dune bashing was thrilling and the BBQ dinner was delicious.",
          date: "2026-03-10T00:00:00Z",
        },
        {
          reviewer: "Sophie L.",
          rating: 4,
          text: "Great safari with beautiful sunset views. The camel ride was a highlight.",
          date: "2026-03-05T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
  {
    id: "rev-002",
    productName: "Atlantis The Palm",
    destination: "Dubai",
    category: "hotels",
    status: "in_review",
    assignedTo: "Sarah K.",
    reviewedBy: null,
    createdAt: "2026-03-27T14:30:00Z",
    updatedAt: "2026-03-28T09:15:00Z",
    normalizedPayload: {
      id: "np-002",
      name: "Atlantis The Palm",
      description:
        "Iconic 5-star resort on the crescent of Palm Jumeirah, offering luxury rooms, an aquapark, aquarium, and multiple dining options.",
      source_url: "https://booking.com/hotel/ae/atlantis-the-palm",
      location: {
        address: "Crescent Rd, The Palm Jumeirah",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.1304,
        longitude: 55.1172,
      },
      pricing: { currency: "AED", amount: 1850, per: "night" },
      images: [
        "https://images.example.com/atlantis-1.jpg",
        "https://images.example.com/atlantis-2.jpg",
      ],
      raw_category: "resort_hotel",
      source_metadata: { stars: 5, review_score: 8.7, review_count: 12453 },
    },
    source: "Booking.com",
    confidenceScore: 0.94,
    predictedCategory: "hotels",
    classifierRationale:
      "Strong hotel indicators: 'resort', 'rooms', 'check-in'. Source is a hotel booking platform. Pricing is per-night.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "atlantis the palm dubai",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Discover luxury at Atlantis The Palm, Dubai's iconic 5-star resort on Palm Jumeirah. Enjoy world-class dining, Aquaventure Waterpark, The Lost Chambers Aquarium, and breathtaking ocean views.",
      longDesc:
        "Welcome to Atlantis The Palm, one of Dubai's most prestigious resorts perched on the crescent of the iconic Palm Jumeirah. This 5-star destination offers 1,548 luxurious rooms and suites with stunning views of the Arabian Gulf.\n\nIndulge in culinary excellence at over 30 restaurants and bars, including Nobu and Ossiano. Thrill-seekers will love Aquaventure Waterpark, while marine enthusiasts can explore The Lost Chambers Aquarium.",
      metaTitle:
        "Atlantis The Palm Dubai | 5-Star Luxury Resort - RaynaTours",
      metaDescription:
        "Book Atlantis The Palm in Dubai. 5-star luxury resort on Palm Jumeirah with Aquaventure Waterpark, dining & ocean views. Best rates guaranteed!",
      faq: [
        {
          question: "What facilities does Atlantis The Palm offer?",
          answer:
            "Atlantis offers Aquaventure Waterpark, The Lost Chambers Aquarium, over 30 restaurants, a luxury spa, private beach, kids club, and water sports.",
        },
        {
          question: "How far is Atlantis from Dubai Mall?",
          answer:
            "Atlantis is approximately 25 km from Dubai Mall, about 25-30 minutes by car.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Atlantis The Palm",
  "starRating": { "@type": "Rating", "ratingValue": "5" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  }
}`,
      tags: [
        "atlantis",
        "palm jumeirah",
        "luxury resort",
        "5-star hotel",
        "dubai",
        "aquaventure",
      ],
      googleReviews: [
        {
          reviewer: "Mark T.",
          rating: 5,
          text: "Stunning resort with incredible amenities. The waterpark alone is worth the visit!",
          date: "2026-03-12T00:00:00Z",
        },
        {
          reviewer: "Lisa R.",
          rating: 4,
          text: "Beautiful property but quite expensive for dining. Rooms were immaculate though.",
          date: "2026-03-08T00:00:00Z",
        },
        {
          reviewer: "Omar H.",
          rating: 5,
          text: "Best hotel in Dubai hands down. The underwater suites are magical!",
          date: "2026-02-25T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
  {
    id: "rev-003",
    productName: "Dubai Airport Private Transfer",
    destination: "Dubai",
    category: "transfers",
    status: "pending",
    assignedTo: null,
    reviewedBy: null,
    createdAt: "2026-03-27T06:20:00Z",
    updatedAt: "2026-03-27T06:20:00Z",
    normalizedPayload: {
      id: "np-003",
      name: "Dubai Airport Private Transfer",
      description:
        "Private car transfer from Dubai International Airport (DXB) to any hotel in Dubai. Meet & greet service with name board. Available 24/7.",
      source_url: "https://getyourguide.com/dubai/airport-transfer",
      location: {
        address: "Dubai International Airport, Terminal 3",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.2528,
        longitude: 55.3644,
      },
      pricing: { currency: "AED", amount: 145, per: "vehicle" },
      images: ["https://images.example.com/transfer-1.jpg"],
      raw_category: "ground_transport",
      source_metadata: {
        vehicle_type: "sedan",
        max_passengers: 3,
        luggage_pieces: 2,
      },
    },
    source: "GetYourGuide",
    confidenceScore: 0.87,
    predictedCategory: "transfers",
    classifierRationale:
      "Clear transfer indicators: 'airport', 'private car transfer', 'meet & greet'. Vehicle-based pricing. Airport pickup/dropoff service.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "dubai airport transfer",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Enjoy a hassle-free private transfer from Dubai International Airport to your hotel. Professional meet & greet service with 24/7 availability and flight tracking.",
      longDesc:
        "Start your Dubai trip stress-free with our premium private airport transfer service. A professional, English-speaking driver will meet you at the arrivals hall with a name board, assist with your luggage, and drive you directly to your hotel in a comfortable air-conditioned sedan.\n\nOur service includes real-time flight tracking, so your driver will be there even if your flight is delayed. Available around the clock for all terminals at Dubai International Airport (DXB).",
      metaTitle:
        "Dubai Airport Private Transfer | 24/7 Meet & Greet - RaynaTours",
      metaDescription:
        "Book a private airport transfer in Dubai. Meet & greet service, flight tracking, 24/7 availability. Comfortable sedan from DXB to your hotel.",
      faq: [
        {
          question: "How do I find my driver at the airport?",
          answer:
            "Your driver will be waiting in the arrivals hall holding a name board with your name. You'll also receive driver contact details via SMS.",
        },
        {
          question: "What if my flight is delayed?",
          answer:
            "We track all flights in real-time. Your driver will adjust pickup time automatically at no extra charge.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dubai Airport Private Transfer",
  "serviceType": "Airport Transfer",
  "areaServed": "Dubai"
}`,
      tags: [
        "airport transfer",
        "dubai",
        "private car",
        "meet and greet",
        "dxb",
      ],
      googleReviews: [],
    },
    publishFlag: false,
  },
  {
    id: "rev-004",
    productName: "Pierchic Restaurant",
    destination: "Dubai",
    category: "restaurants",
    status: "pending",
    assignedTo: null,
    reviewedBy: null,
    createdAt: "2026-03-26T11:00:00Z",
    updatedAt: "2026-03-26T11:00:00Z",
    normalizedPayload: {
      id: "np-004",
      name: "Pierchic Restaurant",
      description:
        "Award-winning seafood restaurant at the end of a pier at Al Qasr hotel, offering panoramic views of the Arabian Gulf.",
      source_url: "https://tripadvisor.com/Restaurant_Review-pierchic",
      location: {
        address: "Al Qasr Hotel, Madinat Jumeirah",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.1345,
        longitude: 55.1856,
      },
      pricing: { currency: "AED", amount: 450, per: "person_avg" },
      images: ["https://images.example.com/pierchic-1.jpg"],
      raw_category: "fine_dining",
      source_metadata: {
        cuisine: "seafood",
        price_level: 4,
        tripadvisor_rating: 4.5,
      },
    },
    source: "TripAdvisor",
    confidenceScore: 0.78,
    predictedCategory: "restaurants",
    classifierRationale:
      "Restaurant indicators: 'dining', 'seafood', 'cuisine'. TripAdvisor restaurant listing. Per-person average pricing typical of restaurants.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "pierchic restaurant dubai",
    generationAttempt: 2,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Dine at Pierchic, Dubai's iconic overwater seafood restaurant at Madinat Jumeirah. Enjoy award-winning Mediterranean-inspired cuisine with panoramic Arabian Gulf views.",
      longDesc:
        "Pierchic is Dubai's most celebrated seafood destination, dramatically positioned at the end of a private pier extending into the Arabian Gulf at Al Qasr Hotel, Madinat Jumeirah.\n\nThe award-winning kitchen delivers exquisite Mediterranean-inspired seafood dishes crafted from the freshest catches. From the oyster bar to the signature lobster thermidor, every dish is a masterpiece. The romantic setting — with waves gently lapping beneath you and Burj Al Arab glowing in the distance — makes it perfect for special occasions.",
      metaTitle:
        "Pierchic Restaurant Dubai | Overwater Fine Dining - RaynaTours",
      metaDescription:
        "Book Pierchic Restaurant in Dubai. Award-winning overwater seafood dining at Madinat Jumeirah with stunning Arabian Gulf views. Reserve your table!",
      faq: [
        {
          question: "Is a dress code required at Pierchic?",
          answer:
            "Yes, smart casual to elegant attire is required. No beachwear or sportswear.",
        },
        {
          question: "Does Pierchic accommodate dietary restrictions?",
          answer:
            "Yes, the kitchen can accommodate most dietary requirements including gluten-free and vegetarian options. Please inform the team when booking.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Pierchic",
  "servesCuisine": "Seafood",
  "priceRange": "$$$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  }
}`,
      tags: [
        "pierchic",
        "seafood",
        "fine dining",
        "dubai",
        "madinat jumeirah",
        "romantic dinner",
      ],
      googleReviews: [
        {
          reviewer: "Elena V.",
          rating: 5,
          text: "The most romantic restaurant in Dubai. The sunset views are unbeatable and the lobster was divine!",
          date: "2026-03-15T00:00:00Z",
        },
        {
          reviewer: "David C.",
          rating: 4,
          text: "Excellent seafood and stunning location. Service was impeccable. A bit pricey but worth it for a special occasion.",
          date: "2026-03-01T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
  {
    id: "rev-005",
    productName: "Burj Khalifa At The Top",
    destination: "Dubai",
    category: "attractions",
    status: "in_review",
    assignedTo: "Sarah K.",
    reviewedBy: null,
    createdAt: "2026-03-26T09:45:00Z",
    updatedAt: "2026-03-27T10:00:00Z",
    normalizedPayload: {
      id: "np-005",
      name: "Burj Khalifa At The Top Observation Deck",
      description:
        "Visit the observation deck of the world's tallest building at levels 124 and 125. Enjoy 360-degree views of Dubai's skyline.",
      source_url: "https://viator.com/tours/dubai/burj-khalifa",
      location: {
        address: "1 Sheikh Mohammed bin Rashid Blvd",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.1972,
        longitude: 55.2744,
      },
      pricing: { currency: "AED", amount: 169, per: "person" },
      images: ["https://images.example.com/burj-khalifa-1.jpg"],
      raw_category: "observation_deck",
      source_metadata: { height_meters: 555, floors: 163, rating: 4.7 },
    },
    source: "Viator API",
    confidenceScore: 0.96,
    predictedCategory: "attractions",
    classifierRationale:
      "Clear attraction: 'observation deck', 'world's tallest building'. Tourist activity priced per-person. Famous landmark.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "burj khalifa tickets",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Ascend to the top of the world's tallest building! Visit the Burj Khalifa At The Top observation deck at levels 124-125 for breathtaking 360-degree views of Dubai.",
      longDesc:
        "Stand atop the world at Burj Khalifa's At The Top observation deck, located on levels 124 and 125 of this architectural marvel standing at 828 meters. Your journey begins with a multimedia presentation in the lower lounge before a high-speed elevator whisks you up in just 60 seconds.\n\nStep onto the outdoor terrace and take in panoramic views stretching across the Arabian Gulf, the desert, and Dubai's glittering skyline. Interactive screens help you identify landmarks, and telescopes provide close-up views.",
      metaTitle:
        "Burj Khalifa At The Top Tickets | Skip the Line - RaynaTours",
      metaDescription:
        "Book Burj Khalifa At The Top tickets. Visit levels 124-125 observation deck with 360° views of Dubai. Skip-the-line entry available!",
      faq: [
        {
          question: "How long can I stay at the observation deck?",
          answer:
            "There is no time limit for general admission. Most visitors spend 60-90 minutes enjoying the views.",
        },
        {
          question: "What is the best time to visit?",
          answer:
            "Sunset visits are the most popular for stunning views. Early morning offers the clearest visibility.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Burj Khalifa At The Top",
  "description": "Observation deck at the world's tallest building"
}`,
      tags: [
        "burj khalifa",
        "observation deck",
        "dubai",
        "tallest building",
        "skyline views",
      ],
      googleReviews: [
        {
          reviewer: "Tom W.",
          rating: 5,
          text: "Absolutely breathtaking views! A must-do when in Dubai.",
          date: "2026-03-18T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
  {
    id: "rev-006",
    productName: "Jumeirah Beach Hotel",
    destination: "Dubai",
    category: "hotels",
    status: "approved",
    assignedTo: "Mike R.",
    reviewedBy: "Mike R.",
    createdAt: "2026-03-24T10:00:00Z",
    updatedAt: "2026-03-26T14:20:00Z",
    normalizedPayload: {
      id: "np-006",
      name: "Jumeirah Beach Hotel",
      description:
        "Wave-shaped 5-star beachfront hotel with views of Burj Al Arab. Features multiple pools, a private beach, and direct access to Wild Wadi Waterpark.",
      source_url: "https://booking.com/hotel/ae/jumeirah-beach-hotel",
      location: {
        address: "Jumeirah Beach Rd",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.1411,
        longitude: 55.1875,
      },
      pricing: { currency: "AED", amount: 1200, per: "night" },
      images: ["https://images.example.com/jbh-1.jpg"],
      raw_category: "beach_hotel",
      source_metadata: { stars: 5, review_score: 8.9, review_count: 8720 },
    },
    source: "Booking.com",
    confidenceScore: 0.95,
    predictedCategory: "hotels",
    classifierRationale:
      "Strong hotel signals: '5-star', 'beachfront hotel', 'rooms', 'pools'. Per-night pricing on hotel booking platform.",
    finalCategory: "hotels",
    reviewNotes: "Content quality excellent. Approved as-is.",
    primaryKeyword: "jumeirah beach hotel",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Stay at the iconic wave-shaped Jumeirah Beach Hotel, a 5-star beachfront resort with stunning Burj Al Arab views, multiple pools, and complimentary Wild Wadi Waterpark access.",
      longDesc:
        "The Jumeirah Beach Hotel is one of Dubai's most recognizable landmarks, its distinctive wave-shaped silhouette creating a stunning contrast with the nearby Burj Al Arab. This 5-star beachfront resort offers 618 rooms and suites with panoramic views of the Arabian Gulf.\n\nGuests enjoy complimentary unlimited access to Wild Wadi Waterpark, a private beach, multiple swimming pools, and over 20 restaurants and bars.",
      metaTitle:
        "Jumeirah Beach Hotel Dubai | 5-Star Beachfront - RaynaTours",
      metaDescription:
        "Book Jumeirah Beach Hotel in Dubai. Iconic wave-shaped 5-star resort with Burj Al Arab views, private beach & Wild Wadi access. Best rates!",
      faq: [
        {
          question: "Is Wild Wadi Waterpark access included?",
          answer:
            "Yes, all hotel guests enjoy unlimited complimentary access to Wild Wadi Waterpark throughout their stay.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Jumeirah Beach Hotel",
  "starRating": { "@type": "Rating", "ratingValue": "5" }
}`,
      tags: [
        "jumeirah beach hotel",
        "5-star",
        "beachfront",
        "dubai",
        "wild wadi",
      ],
      googleReviews: [],
    },
    publishFlag: true,
  },
  {
    id: "rev-007",
    productName: "Dubai Marina Dhow Cruise",
    destination: "Dubai",
    category: "attractions",
    status: "pending",
    assignedTo: null,
    reviewedBy: null,
    createdAt: "2026-03-28T05:30:00Z",
    updatedAt: "2026-03-28T05:30:00Z",
    normalizedPayload: {
      id: "np-007",
      name: "Dubai Marina Dhow Cruise Dinner",
      description:
        "2-hour dinner cruise on a traditional wooden dhow through Dubai Marina. Includes international buffet dinner, soft drinks, and entertainment.",
      source_url: "https://viator.com/tours/dubai/marina-dhow-cruise",
      location: {
        address: "Dubai Marina Promenade",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.0762,
        longitude: 55.1405,
      },
      pricing: { currency: "AED", amount: 159, per: "person" },
      images: ["https://images.example.com/dhow-1.jpg"],
      raw_category: "boat_tour",
      source_metadata: { duration_hours: 2, rating: 4.4, reviews: 5210 },
    },
    source: "Viator API",
    confidenceScore: 0.89,
    predictedCategory: "attractions",
    classifierRationale:
      "Activity-based: 'cruise', 'dinner cruise', 'entertainment'. Per-person pricing. Tours platform. Duration-based experience.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "dubai marina dhow cruise",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Sail through the glittering Dubai Marina on a traditional wooden dhow. Enjoy a 2-hour dinner cruise with international buffet, live entertainment, and stunning skyline views.",
      longDesc:
        "Experience the magic of Dubai Marina from the water on our enchanting Dhow Cruise Dinner. Board a beautifully decorated traditional Arabian wooden dhow and set sail through the sparkling waters of Dubai Marina.\n\nAs you cruise past the iconic skyscrapers and luxury yachts, indulge in a sumptuous international buffet dinner featuring Arabic and Western cuisine. Live music and entertainment add to the magical atmosphere.",
      metaTitle:
        "Dubai Marina Dhow Cruise Dinner | Book Online - RaynaTours",
      metaDescription:
        "Book a Dubai Marina Dhow Cruise dinner. 2-hour cruise with buffet, live entertainment & stunning marina views. Best prices guaranteed!",
      faq: [
        {
          question: "What time does the dhow cruise depart?",
          answer:
            "The dinner cruise departs at 8:30 PM and returns at 10:30 PM. Boarding starts at 8:00 PM.",
        },
        {
          question: "Is the dhow cruise suitable for families?",
          answer:
            "Absolutely! The dhow cruise is family-friendly with activities for all ages. Children under 4 ride free.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Dubai Marina Dhow Cruise Dinner"
}`,
      tags: [
        "dhow cruise",
        "dubai marina",
        "dinner cruise",
        "dubai",
        "boat tour",
      ],
      googleReviews: [
        {
          reviewer: "Maria G.",
          rating: 4,
          text: "Lovely evening on the water. Food was decent and the views were spectacular.",
          date: "2026-03-20T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
  {
    id: "rev-008",
    productName: "Abu Dhabi City Tour",
    destination: "Abu Dhabi",
    category: "attractions",
    status: "pending",
    assignedTo: "Sarah K.",
    reviewedBy: null,
    createdAt: "2026-03-27T13:00:00Z",
    updatedAt: "2026-03-27T13:00:00Z",
    normalizedPayload: {
      id: "np-008",
      name: "Abu Dhabi Full Day City Tour from Dubai",
      description:
        "Full-day guided tour from Dubai to Abu Dhabi. Visit Sheikh Zayed Grand Mosque, Emirates Palace, Louvre Abu Dhabi, and Yas Island.",
      source_url: "https://viator.com/tours/abu-dhabi/city-tour",
      location: {
        address: "Sheikh Zayed Grand Mosque",
        city: "Abu Dhabi",
        country: "United Arab Emirates",
        latitude: 24.4128,
        longitude: 54.4742,
      },
      pricing: { currency: "AED", amount: 249, per: "person" },
      images: ["https://images.example.com/abu-dhabi-1.jpg"],
      raw_category: "day_tour",
      source_metadata: { duration_hours: 10, rating: 4.8, reviews: 3200 },
    },
    source: "Viator API",
    confidenceScore: 0.93,
    predictedCategory: "attractions",
    classifierRationale:
      "Day tour with multiple landmarks. Per-person pricing. 'Guided tour' is a clear activity indicator.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "abu dhabi city tour from dubai",
    generationAttempt: 3,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Explore the best of Abu Dhabi on a full-day guided tour from Dubai. Visit the stunning Sheikh Zayed Grand Mosque, Emirates Palace, Louvre Abu Dhabi, and Yas Island.",
      longDesc:
        "Discover the cultural splendor of the UAE capital on our comprehensive Abu Dhabi City Tour. Your expert English-speaking guide will pick you up from your Dubai hotel and take you on a 10-hour journey through Abu Dhabi's most iconic landmarks.\n\nMarvel at the magnificent Sheikh Zayed Grand Mosque, one of the world's largest mosques with 82 domes and 1,000 columns. Photo stop at the Emirates Palace, then explore the architectural wonder of Louvre Abu Dhabi.",
      metaTitle:
        "Abu Dhabi City Tour from Dubai | Full Day Guide - RaynaTours",
      metaDescription:
        "Book Abu Dhabi city tour from Dubai. Visit Sheikh Zayed Mosque, Louvre, Emirates Palace & Yas Island. Full-day guided tour with hotel pickup!",
      faq: [
        {
          question: "Does the tour include hotel pickup from Dubai?",
          answer:
            "Yes, complimentary hotel pickup and drop-off from any Dubai hotel is included.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Abu Dhabi City Tour from Dubai"
}`,
      tags: [
        "abu dhabi",
        "city tour",
        "sheikh zayed mosque",
        "louvre",
        "day trip from dubai",
      ],
      googleReviews: [],
    },
    publishFlag: false,
  },
  {
    id: "rev-009",
    productName: "Dubai Intercity Transfer",
    destination: "Dubai",
    category: "transfers",
    status: "rejected",
    assignedTo: "John D.",
    reviewedBy: "John D.",
    createdAt: "2026-03-23T08:00:00Z",
    updatedAt: "2026-03-25T16:30:00Z",
    normalizedPayload: {
      id: "np-009",
      name: "Dubai to Abu Dhabi Private Transfer",
      description:
        "Comfortable private sedan transfer from any Dubai location to Abu Dhabi hotels or attractions.",
      source_url: "https://getyourguide.com/dubai/intercity-transfer",
      location: {
        address: "Dubai City Center",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.2048,
        longitude: 55.2708,
      },
      pricing: { currency: "AED", amount: 350, per: "vehicle" },
      images: ["https://images.example.com/intercity-1.jpg"],
      raw_category: "private_transfer",
      source_metadata: {
        vehicle_type: "sedan",
        max_passengers: 3,
        distance_km: 140,
      },
    },
    source: "GetYourGuide",
    confidenceScore: 0.82,
    predictedCategory: "transfers",
    classifierRationale:
      "Transfer service: 'private sedan transfer', city-to-city. Per-vehicle pricing. Transport service metadata.",
    finalCategory: "transfers",
    reviewNotes: "Content needs improvement in meta description. Rejected for regeneration.",
    primaryKeyword: "dubai to abu dhabi transfer",
    generationAttempt: 2,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Travel comfortably between Dubai and Abu Dhabi with our private sedan transfer service. Door-to-door pickup with professional drivers.",
      longDesc:
        "Our Dubai to Abu Dhabi private transfer offers a comfortable and convenient way to travel between the two emirates. A professional driver will pick you up from any Dubai location and drive you directly to your Abu Dhabi destination.",
      metaTitle:
        "Dubai to Abu Dhabi Private Transfer | Book Now - RaynaTours",
      metaDescription:
        "Book private transfer from Dubai to Abu Dhabi. Comfortable sedan, professional driver, door-to-door service.",
      faq: [
        {
          question: "How long is the drive from Dubai to Abu Dhabi?",
          answer:
            "The drive takes approximately 1.5 to 2 hours depending on traffic conditions.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dubai to Abu Dhabi Private Transfer",
  "serviceType": "Intercity Transfer"
}`,
      tags: [
        "dubai to abu dhabi",
        "private transfer",
        "intercity",
        "sedan",
      ],
      googleReviews: [],
    },
    publishFlag: false,
  },
  {
    id: "rev-010",
    productName: "Nobu Restaurant Dubai",
    destination: "Dubai",
    category: "restaurants",
    status: "pending",
    assignedTo: null,
    reviewedBy: null,
    createdAt: "2026-03-28T07:00:00Z",
    updatedAt: "2026-03-28T07:00:00Z",
    normalizedPayload: {
      id: "np-010",
      name: "Nobu Restaurant Dubai",
      description:
        "World-famous Japanese-Peruvian fusion restaurant by Chef Nobu Matsuhisa, located at Atlantis The Palm.",
      source_url: "https://tripadvisor.com/Restaurant_Review-nobu-dubai",
      location: {
        address: "Atlantis The Palm, Crescent Rd",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.1304,
        longitude: 55.1172,
      },
      pricing: { currency: "AED", amount: 500, per: "person_avg" },
      images: ["https://images.example.com/nobu-1.jpg"],
      raw_category: "fine_dining",
      source_metadata: {
        cuisine: "japanese_peruvian",
        price_level: 4,
        tripadvisor_rating: 4.6,
      },
    },
    source: "TripAdvisor",
    confidenceScore: 0.85,
    predictedCategory: "restaurants",
    classifierRationale:
      "Restaurant indicators: 'Chef', 'cuisine', 'restaurant'. TripAdvisor restaurant listing. Per-person average pricing.",
    finalCategory: null,
    reviewNotes: null,
    primaryKeyword: "nobu restaurant dubai",
    generationAttempt: 1,
    maxAttempts: 3,
    contentFields: {
      shortDesc:
        "Experience the world-famous Nobu at Atlantis The Palm, Dubai. Savor Chef Nobu Matsuhisa's signature Japanese-Peruvian fusion cuisine in an elegant waterfront setting.",
      longDesc:
        "Nobu Dubai, located within the iconic Atlantis The Palm resort, brings the legendary culinary vision of Chef Nobu Matsuhisa to the shores of the Arabian Gulf. This is one of the world's most celebrated dining concepts, blending traditional Japanese techniques with bold Peruvian flavors.\n\nSignature dishes include the famous Black Cod Miso, Yellowtail Jalapeño, and the indulgent Nobu-style Wagyu. The sleek, contemporary interior creates the perfect backdrop for an unforgettable dining experience.",
      metaTitle:
        "Nobu Restaurant Dubai at Atlantis | Reserve Now - RaynaTours",
      metaDescription:
        "Book Nobu Dubai at Atlantis The Palm. World-famous Japanese-Peruvian fusion by Chef Nobu Matsuhisa. Signature dishes & waterfront dining!",
      faq: [
        {
          question: "Do I need a reservation at Nobu Dubai?",
          answer:
            "Reservations are highly recommended, especially for dinner and weekends. Walk-ins are accepted subject to availability.",
        },
      ],
      schemaMarkup: `{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Nobu Dubai",
  "servesCuisine": "Japanese-Peruvian Fusion",
  "priceRange": "$$$$"
}`,
      tags: [
        "nobu",
        "japanese",
        "fine dining",
        "dubai",
        "atlantis",
        "fusion cuisine",
      ],
      googleReviews: [
        {
          reviewer: "Yuki S.",
          rating: 5,
          text: "The Black Cod Miso is absolutely divine! One of the best Nobu locations worldwide.",
          date: "2026-03-22T00:00:00Z",
        },
      ],
    },
    publishFlag: false,
  },
];
