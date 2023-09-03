const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('discord');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Export the connect function to establish a shared connection
module.exports = {
  connect,
};