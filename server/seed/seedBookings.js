const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB Atlas connection string and credentials
const uri = 'mongodb+srv://malaksadek9924:malak@seatscene.mongodb.net/?retryWrites=true&w=majority';

const seedBookings = [
  {
    show: { title: "The Phantom of the Opera", id: "show1" },
    theater: "Grand Theater",
    time: "7:00 PM",
    selectedSeats: ["A-1", "A-2"],
    totalPrice: 300,
    paymentMethod: "Credit Card",
    user: { id: "user1", name: "Alice" },
    timestamp: new Date().toISOString(),
    confirmationCode: "CONF-ABCD1234"
  },
  {
    show: { title: "Hamilton", id: "show2" },
    theater: "City Stage",
    time: "9:00 PM",
    selectedSeats: ["B-5", "B-6", "B-7"],
    totalPrice: 450,
    paymentMethod: "Debit Card",
    user: { id: "user2", name: "Bob" },
    timestamp: new Date().toISOString(),
    confirmationCode: "CONF-EFGH5678"
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test');
    const bookingsCollection = db.collection('bookings');
    await bookingsCollection.deleteMany({});
    await bookingsCollection.insertMany(seedBookings);
    console.log('Bookings seeded!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();