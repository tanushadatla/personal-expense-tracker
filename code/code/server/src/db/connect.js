const mongoose = require("mongoose");
// Middleware
// const db = 'mongodb+srv://personalexpense:personalexpense@cluster0.eg4rfsk.mongodb.net/personalexpense?retryWrites=true&w=majority'
//const db = 'mongodb://127.0.0.1:27017/exp'
//const db='mongodb://localhost:27017/exp'
const db='mongodb+srv://me:fQBzBkaKtUoAy6eu@serverlessinstance0.rccrefd.mongodb.net/exp?retryWrites=true&w=majority&appName=ServerlessInstance0'
// Connect to MongoDB using the connection string
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connection successful`);
}).catch((e) => {
  console.log(`No connection: ${e}`);
});

// mongodb://localhost:27017