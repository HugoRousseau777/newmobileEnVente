const uri = "mongodb+srv://hugo:megaman00@cluster0.7qqwlqk.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require('mongoose');

async function connect() {
  try {
   await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to mongodb");
  } catch (error) {
    console.log(error)
  }
}

