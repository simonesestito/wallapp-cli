import { prompt } from "inquirer";
import { when } from "./utils";
import categoryMenu from "./categories/index"
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
    0: categoryMenu,
    1: () => {},
    2: () => {}
  })();
};

mainMenu();
