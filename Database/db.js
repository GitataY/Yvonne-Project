const mongoose = require("mongoose");
//------------------------------------------CLEAR MONGOOSE ERRORS-------
mongoose.set("strictQuery", false);
//-----------------------------------------INITIALIZE MONGOOSE-------
const connectDb = async (url) => {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("CONNECTED TO DB!............................");
    })
    .catch((err) => {
      console.log("Connection to DB Failed");
    });
};
module.exports = { connectDb };
