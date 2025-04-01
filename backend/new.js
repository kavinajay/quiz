const mongoose = require('mongoose');
const db_password = "kavin@2525";
const uri = `mongodb+srv://loganayakikavin:${encodeURIComponent(db_password)}@cluster0.bwb1qyq.mongodb.net/myDatabase?retryWrites=true&w=majority`;

const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();