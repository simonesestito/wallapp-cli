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
import { when, getCategoryStorageUrl, showLoadingPromise } from "./utils";
import * as firebase from "@google-cloud/firestore";
import categoryRepo from "./repository/category-repo";
import { Spinner } from "cli-spinner";
const opn = require("opn");
require("babel-polyfill");

const options = [
  "Aggiungi categoria",
  "Rimuovi categoria",
  "Modifica categoria",
  "Carica o modifica file cover"
];

const yesNo = ["Si", "No"];

const editCategory = async category => {
  const newCategory = await prompt([
    {
      message: "Titolo",
      name: "displayName",
      default: category.displayName
    },
    {
      message: "Descrizione",
      name: "description",
      default: category.description
    },
    {
      type: "list",
      message: "Pubblicato",
      name: "published",
      choices: yesNo,
      default: category.published ? 0 : 1,
      filter: choice => choice == yesNo[0]
    },
    {
      type: "list",
      message: "Aggiornare la data di creazione?",
      name: "creationDate",
      choices: yesNo,
      filter: choice =>
        firebase.Timestamp.fromDate(
          choice == yesNo[0] ? new Date() : category.creationDate
        )
    }
  ]);
  newCategory.id = category.id;
  newCategory.count = category.count;

  const spinner = new Spinner("Salvataggio in corso...");
  spinner.start();
  await categoryRepo.updateCategory(newCategory);
  spinner.stop();
  console.log(
    "Per impostare la cover, carica un file cover.jpg delle corrette dimensioni su\n" +
      getCategoryStorageUrl(newCategory)
  );
};

export const selectCategory = async () => {
  const spinner = new Spinner("Caricamento categorie...");
  spinner.start();
  const categories = await categoryRepo.getCategories();
  spinner.stop();

  let humanCategories = [];
  categories.forEach(c =>
    humanCategories.push(c.toReadableString())
  );

  const choice = await prompt({
    name: "categoryChoice",
    message: "Scegli la categoria",
    type: "list",
    choices: humanCategories
  });
  const index = humanCategories.indexOf(choice.categoryChoice);
  return categories[index];
};

const deleteCategory = async () => {
  const cat = await selectCategory();
  const check = await prompt({
    name: "verifyId",
    message: "Scrivi l'ID della categoria da eliminare per confermare",
    validate: input =>
      input === cat.id ? true : "Scrivi l'ID corretto o annulla con CTRL+C"
  });

  if (check.verifyId === cat.id) {
    const spinner = new Spinner("Eliminazione categoria...");
    spinner.start();
    await categoryRepo.deleteCategory(cat);
    spinner.stop();
  }
};

const addCategory = async () => {
  const newCategory = await prompt([
    {
      message: "Titolo",
      name: "displayName"
    },
    {
      message: "Descrizione",
      name: "description"
    },
    {
      type: "list",
      message: "Pubblicato",
      name: "published",
      choices: yesNo,
      default: 1,
      filter: choice => choice == yesNo[0]
    },
    {
      message: "ID",
      name: "id",
      validate: choice => choice.indexOf(' ') >= 0 ? "ID senza spazi" : true
    }
  ]);

  newCategory.creationDate = new Date();

  // Check unique ID
  let spinner = new Spinner("Verificando ID univoco...");
  spinner.start();
  const cat = await categoryRepo.getCategoryById(newCategory.id);
  spinner.stop();
  if (cat) {
    console.error(`ID non univoco, categoria già presente ${cat.displayName}`);
    return;
  }

  spinner = new Spinner("Salvataggio categoria...");
  spinner.start();
  await categoryRepo.saveNewCategory(newCategory);
  spinner.stop();
  console.log(
    "Per impostare la cover, carica un file cover.jpg delle corrette dimensioni su\n" +
      getCategoryStorageUrl(newCategory)
  );
};

export default async () => {
  const choice = await prompt({
    name: "categoryAction",
    message: "Azioni sulle categorie",
    type: "list",
    choices: options
  });
  const index = options.indexOf(choice.categoryAction);
  when(index, {
    0: addCategory,
    1: deleteCategory,
    2: () => selectCategory().then(cat => editCategory(cat))
  })();
};
