import { prompt } from "inquirer";
import { when } from "./utils";
require("babel-polyfill");

const options = [
  "Amministra categorie",
  "Amministra sfondi",
  "Scansione Firebase"
];

const mainMenu = async () => {
  const choice = await prompt({
    name: "mainAction",
    type: "list",
    message: "Benvenuto. Che devi fare?",
    choices: options
  });

  when(options.indexOf(choice.mainAction), {
    0: () => {},
    1: () => {},
    2: () => {}
  })();
};

mainMenu();
