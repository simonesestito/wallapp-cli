/*
 * This file is part of WallApp CLI Manager.
 * Copyright (C) 2018  Simone Sestito
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


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
