// const notFound = require("../Errors/404");
// const Products = require("../Models/ussd");
const ussdMenu = require("ussd-builder");
const menu = new ussdMenu();
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
// menu.state("donate", {
//   run: () => {
//     menu.con("What is your name?");
//   },
//   next: {
//     "*[a-zA-Z]+": "donate.food",
//   },
// });
// menu.state("donate.food", {
//   run: () => {
//     let name = menu.val;
//     menu.con(`${name} what would you like to donate?`);
//   },
// });
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
const getUssd = (req, res) => {
  res.send("This is a ussd end point");
};
const postUssd = (req, res) => {
  try {
    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.log("ERROR>>>", error);
  }
};
module.exports = { getUssd, postUssd };
