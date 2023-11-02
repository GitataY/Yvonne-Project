//-----------------------------------------------------------Require dotenv------------------
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
//---------------------------------------------------------Require Async Errors------------
require("express-async-errors");
//--------------------------------------------------------Initialize Express-----------------
const express = require("express");
const bodyParser = require("body-parser");
const { connectDb } = require("./Database/db");
const { customErrorHandler } = require("./Middleware/errorHandler");
const { notFound } = require("./Middleware/not-found");
const ussdRouter = require("./Router/ussdRouter");

//-----------------------------------------------Define ports
require("./Database/db");
const app = express();
const PORT = process.env.PORT || 5500;
//=================================================================================MIDDLEWARE
//-------------------------------------------------------use json
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();

//--------------------------------------------------------------SEPARATOR
// const ussdMenu = require("ussd-builder");
// const menu = new ussdMenu();
let userData = {};
menu.startState({
  run: () => {
    menu.con("Welcome. Choose option:" + "\n1. donate" + "\n2. quit");
  },
  // next object links to next state based on user input
  next: {
    1: "donate",
    2: "quit",
  },
});
//----------------------------------------------------DONATE---------------
menu.state("donate", {
  run: () => {
    menu.con("What is your name?");
  },
  next: {
    "*[a-zA-Z]+": "donate.food",
  },
});
menu.state("donate.food", {
  run: () => {
    let name = menu.val;
    menu.con(`${name} what would you like to donate?`);
  },
});
menu.state("end", {
  run: () => {
    let donations = menu.val;
    userData.donations = donations;
    menu.end("Thank you for your donation");
  },
});
//------------------------------------------------------------Quit
menu.state("quit", {
  run: () => {
    menu.end("We are sure you'll donate again");
  },
});
//-------------------------------------------------------------------------------START OF CONTROLLERS
const postUssd = (req, res) => {
  menu.run(req.body, (ussdResult) => {
    res.send(ussdResult);
  });
};
//-------------------------------------------------------import router
app.get("/", (req, res) => {
  res.send("USSD");
});
app.use("/api/v1/", ussdRouter);
app.use("/test", postUssd);

//--------------------------------------------------------import Not found for no-existent routes
app.use(notFound);

//================================================================LAUNCH SERVER
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON ${PORT}..........`);
    });
  } catch (error) {
    console.log(error);
  }
};
//---------------------------------------------------------IMPORT CUSTOM ERROR HANDLER
app.use(customErrorHandler);
startServer();
