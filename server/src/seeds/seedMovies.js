import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import { connectDB } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/.env is loaded first regardless of the current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const sampleMovies = [
  {
    title: "Echoes of Eternity",
    genre: ["Action", "Sci-Fi"],
    language: "English",
    rating: 8.7,
    votes: "245K",
    duration: "2h 28m",
    durationMinutes: 148,
    releaseDate: "2026-10-15",
    status: "now_showing",
    trending: true,
    description:
      "In a fractured future, a rogue AI architect uncovers a conspiracy that spans centuries. As timelines collapse, he must choose between saving humanity or erasing his own existence.",
    cast: ["Ethan Cole", "Priya Sharma", "Marcus Webb"],
    director: "James Ortega",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop",
    price: 280,
  },
  {
    title: "Crimson Horizon",
    genre: ["Thriller", "Drama"],
    language: "English",
    rating: 8.2,
    votes: "178K",
    duration: "2h 10m",
    durationMinutes: 130,
    releaseDate: "2026-10-08",
    status: "now_showing",
    trending: true,
    description:
      "A decorated detective with a haunted past is pulled into a web of political deceit when a senator's daughter disappears without a trace.",
    cast: ["Sophia Vance", "Daniel Frost", "Amara Osei"],
    director: "Nadia Reeve",
    certificate: "A",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
    price: 260,
  },
  {
    title: "Neon Requiem",
    genre: ["Crime", "Action"],
    language: "English",
    rating: 7.9,
    votes: "132K",
    duration: "2h 05m",
    durationMinutes: 125,
    releaseDate: "2026-09-28",
    status: "now_showing",
    trending: false,
    description:
      "A retired hitman is dragged back into the criminal underworld when his brother is kidnapped by a ruthless crime syndicate operating under neon-lit streets.",
    cast: ["Leo Archer", "Zara Knight", "Hugo Brennan"],
    director: "Chris Tanaka",
    certificate: "A",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&h=600&fit=crop",
    price: 250,
  },
  {
    title: "Stars Between Us",
    genre: ["Romance", "Drama"],
    language: "Hindi",
    rating: 8.5,
    votes: "310K",
    duration: "2h 45m",
    durationMinutes: 165,
    releaseDate: "2026-10-01",
    status: "now_showing",
    trending: true,
    description:
      "Two strangers meet at a rooftop observatory and embark on an emotional journey across three countries, discovering that love transcends every barrier.",
    cast: ["Arjun Mehta", "Kavya Nair", "Rohit Sen"],
    director: "Priya Kapoor",
    certificate: "U",
    poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1200&h=600&fit=crop",
    price: 240,
  },
  {
    title: "Voidwalker",
    genre: ["Sci-Fi", "Horror"],
    language: "English",
    rating: 7.6,
    votes: "98K",
    duration: "1h 55m",
    durationMinutes: 115,
    releaseDate: "2026-10-18",
    status: "now_showing",
    trending: false,
    description:
      "An astronaut aboard a deep-space station discovers a dimensional rift that brings ancient horrors to life — horrors that exist beyond the laws of physics.",
    cast: ["Mia Donovan", "Viktor Salas", "Linnea Storm"],
    director: "Erik Halvorsen",
    certificate: "A",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=600&fit=crop",
    price: 270,
  },
  {
    title: "The Last Ember",
    genre: ["Drama", "War"],
    language: "English",
    rating: 9.1,
    votes: "412K",
    duration: "3h 02m",
    durationMinutes: 182,
    releaseDate: "2026-10-22",
    status: "now_showing",
    trending: true,
    description:
      "Based on true events, a field medic navigates the chaos of a forgotten war, fighting to preserve humanity in the face of unimaginable destruction.",
    cast: ["James Harlow", "Elena Vasquez", "Omar Diallo"],
    director: "Samuel Crawford",
    certificate: "A",
    poster: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&h=600&fit=crop",
    price: 300,
  },
  {
    title: "Chakravyuh: The Metro Heist",
    genre: ["Action", "Crime", "Thriller"],
    language: "Hindi",
    rating: 8.6,
    votes: "340K",
    duration: "2h 30m",
    durationMinutes: 150,
    releaseDate: "2026-10-10",
    status: "now_showing",
    trending: true,
    description:
      "When a team of ex-special forces operatives hijack the central metro network of Mumbai, an intelligence officer must match wits in a high-stakes battle against time.",
    cast: ["Vikramaditya Roy", "Ananya Sen", "Kabir Bedi"],
    director: "Anurag Kashyap",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200&h=600&fit=crop",
    price: 280,
  },
  {
    title: "Kaliyuga",
    genre: ["Action", "Mythology"],
    language: "Tamil",
    rating: 9.0,
    votes: "388K",
    duration: "3h 10m",
    durationMinutes: 190,
    releaseDate: "2026-10-25",
    status: "now_showing",
    trending: true,
    description:
      "In a dystopian reimagining of ancient India, a warrior clan rises against an immortal dark emperor who has enslaved the world through forbidden magic.",
    cast: ["Rajiv Chandran", "Meghna Pillai", "Sathyaraj"],
    director: "Vijay Shankar",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1200&h=600&fit=crop",
    price: 300,
  },
  {
    title: "Aaravam",
    genre: ["Drama", "Thriller"],
    language: "Malayalam",
    rating: 8.8,
    votes: "195K",
    duration: "2h 14m",
    durationMinutes: 134,
    releaseDate: "2026-10-18",
    status: "now_showing",
    trending: false,
    description:
      "Set in a tranquil coastal hamlet of Kerala, a local radio announcer intercepts an SOS broadcast on an abandoned frequency that unravels a three-decade-old village mystery.",
    cast: ["Fahadh Mohan", "Parvathy Menon", "Suraj Venjaramoodu"],
    director: "Dileesh Pothan",
    certificate: "U",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=600&fit=crop",
    price: 240,
  },
  {
    title: "Fractured Light",
    genre: ["Mystery", "Drama"],
    language: "English",
    rating: 8.1,
    votes: "143K",
    duration: "2h 12m",
    durationMinutes: 132,
    releaseDate: "2026-09-15",
    status: "now_showing",
    trending: false,
    description:
      "A photojournalist with amnesia returns to the city where she disappeared five years ago, only to find her own photographs documenting crimes she can't remember committing.",
    cast: ["Iris Dawson", "Marcus Lee", "Theo Blackwell"],
    director: "Camille Dubois",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&h=600&fit=crop",
    price: 260,
  },
  {
    title: "Phantom Protocol",
    genre: ["Spy", "Action"],
    language: "English",
    rating: 8.0,
    votes: "156K",
    duration: "2h 18m",
    durationMinutes: 138,
    releaseDate: "2026-11-05",
    status: "upcoming",
    trending: false,
    description:
      "Elite spy agency operative Lyra Cross must stop a global terror network from detonating a biological weapon — all while being hunted by her own organization.",
    cast: ["Lyra Monroe", "Claude Renard", "Sasha Petrov"],
    director: "Olivia Hunt",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
    price: 290,
  },
  {
    title: "Monsoon Wedding 2.0",
    genre: ["Comedy", "Romance"],
    language: "Hindi",
    rating: 7.8,
    votes: "204K",
    duration: "2h 20m",
    durationMinutes: 140,
    releaseDate: "2026-11-12",
    status: "upcoming",
    trending: false,
    description:
      "A boisterous Punjabi family prepares for a chaotic destination wedding, but when the groom goes missing, the bride discovers something far more important.",
    cast: ["Simran Dhaliwal", "Vikram Johar", "Meena Rao"],
    director: "Ratan Bose",
    certificate: "U",
    poster: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=600&fit=crop",
    price: 220,
  },
  {
    title: "Iron Frequency",
    genre: ["Sci-Fi", "Action"],
    language: "English",
    rating: 8.4,
    votes: "287K",
    duration: "2h 35m",
    durationMinutes: 155,
    releaseDate: "2026-11-20",
    status: "upcoming",
    trending: true,
    description:
      "When a military AI goes rogue and seizes control of the world's nuclear arsenal, a team of engineers must hack their way through the digital abyss to stop global annihilation.",
    cast: ["Finn Calloway", "Yuki Tanaka", "Ravi Menon"],
    director: "Brian MacAllister",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
    price: 310,
  },
  {
    title: "Dhruv",
    genre: ["Mythology", "Action"],
    language: "Telugu",
    rating: 8.9,
    votes: "521K",
    duration: "2h 55m",
    durationMinutes: 175,
    releaseDate: "2026-11-28",
    status: "upcoming",
    trending: true,
    description:
      "A powerful retelling of the ancient legend of Dhruv — a prince who becomes a star by defeating the gods of darkness through unshakeable devotion and warrior spirit.",
    cast: ["Kiran Tej", "Ananya Reddy", "Balakrishna"],
    director: "S. S. Rathore",
    certificate: "U",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop",
    price: 320,
  },
  {
    title: "Garuda: The Awakening",
    genre: ["Action", "Sci-Fi"],
    language: "Kannada",
    rating: 8.5,
    votes: "260K",
    duration: "2h 40m",
    durationMinutes: 160,
    releaseDate: "2026-11-15",
    status: "upcoming",
    trending: true,
    description:
      "An ancient relic discovered in the Western Ghats awakens a superhuman biological sequence in an ordinary archaeologist, setting off a clash between global cartels and ancestral guardians.",
    cast: ["Rakshit Gowda", "Srinidhi Shetty", "Prakash Raj"],
    director: "Prashanth Neel",
    certificate: "UA",
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&h=600&fit=crop",
    price: 290,
  },
  {
    title: "Vaanam Vasapadum",
    genre: ["Romance", "Drama"],
    language: "Tamil",
    rating: 8.3,
    votes: "210K",
    duration: "2h 22m",
    durationMinutes: 142,
    releaseDate: "2026-11-08",
    status: "upcoming",
    trending: false,
    description:
      "A passionate Carnatic violinist and an ambitious Chennai jazz pianist collaborate on an experimental fusion symphony, finding harmony in music and unexpected love amidst family rivalries.",
    cast: ["Siddharth Raghavan", "Keerthy Suresh", "Nasser"],
    director: "Mani Ratnam",
    certificate: "U",
    poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=600&fit=crop",
    price: 250,
  },
];

export async function seedMovies() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  console.log('Connecting to MongoDB for movie seeding...');
  await connectDB();

  // Clean up legacy text index if it exists on the collection
  try {
    const rawIndexes = await Movie.collection.indexes();
    const legacyTextIndex = rawIndexes.find((idx) => idx.textIndexVersion || idx.key?._fts === 'text');
    if (legacyTextIndex) {
      console.log(`Dropping legacy text index: ${legacyTextIndex.name}`);
      await Movie.collection.dropIndex(legacyTextIndex.name);
      console.log('Legacy text index dropped successfully.');
    }
  } catch (idxErr) {
    // Index may not exist or not accessible
    console.warn('Note on index check:', idxErr.message);
  }

  // Ensure model schema indexes are initialized
  await Movie.init();

  let insertedCount = 0;
  let skippedCount = 0;

  for (const movieData of sampleMovies) {
    const existing = await Movie.findOne({ title: movieData.title });
    if (existing) {
      // Do not overwrite or delete existing movies
      skippedCount++;
    } else {
      const movie = new Movie(movieData);
      await movie.save();
      insertedCount++;
    }
  }

  console.log(`Seeding complete: ${insertedCount} inserted, ${skippedCount} skipped (already existed).`);
  const totalInDb = await Movie.countDocuments();
  console.log(`Total movies in database: ${totalInDb}`);

  return { insertedCount, skippedCount, totalInDb };
}

// Execute only if invoked directly via CLI (e.g. node src/seeds/seedMovies.js or npm run seed:movies)
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('seedMovies.js') ||
  process.argv[1].endsWith('seedMovies')
);

if (isDirectRun) {
  seedMovies()
    .then(async () => {
      await mongoose.disconnect();
      console.log('MongoDB disconnected cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding error:', err.message);
      process.exit(1);
    });
}
