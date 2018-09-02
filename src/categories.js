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
import { when, getCategoryStorageUrl, showLoadingPromise } from "./utils";
import * as firebase from "@google-cloud/firestore";
import categoryRepo from "./repository/category-repo";
import { Spinner } from "cli-spinner";
const opn = require("opn");
import { SUPPORTED_LANGS } from "./constants";
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
      default: 1, // No
      filter: choice =>
        firebase.Timestamp.fromDate(
          choice == yesNo[0] ? new Date() : category.creationDate
        )
    }
  ]);
  newCategory.id = category.id;
  newCategory.count = category.count;

  const displayName = await prompt(
    SUPPORTED_LANGS.map(lang => ({
      name: lang,
      message: `Titolo (lingua: ${lang})`,
      default: category.displayName[lang]
    }))
  );

  const description = await prompt(
    SUPPORTED_LANGS.map(lang => ({
      name: lang,
      message: `Descrizione (lingua: ${lang})`,
      default: category.description[lang]
    }))
  );

  newCategory.displayName = displayName;
  newCategory.description = description;

  await showLoadingPromise(categoryRepo.updateCategory(newCategory), "Salvataggio in corso");

  console.log(
    "Per impostare la cover, carica un file cover.jpg delle corrette dimensioni su\n" +
      getCategoryStorageUrl(newCategory)
  );
};

export const selectCategory = async () => {
  const categories = await showLoadingPromise(categoryRepo.getCategories(), "Caricamento categorie");

  let humanCategories = [];
  categories.forEach(c => humanCategories.push(c.toReadableString()));

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
    await showLoadingPromise(categoryRepo.deleteCategory(cat), "Eliminazione categoria");
  }
};

const addCategory = async () => {
  const newCategory = await prompt([
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
      validate: choice => (choice.indexOf(" ") >= 0 ? "ID senza spazi" : true)
    }
  ]);

  const displayName = await prompt(
    SUPPORTED_LANGS.map(lang => ({
      name: lang,
      message: `Titolo (lingua: ${lang})`
    }))
  );

  const description = await prompt(
    SUPPORTED_LANGS.map(lang => ({
      name: lang,
      message: `Descrizione (lingua: ${lang})`
    }))
  );

  newCategory.displayName = displayName;
  newCategory.description = description;


  newCategory.creationDate = new Date();

  // Check unique ID
  const cat = await showLoadingPromise(categoryRepo.getCategoryById(newCategory.id), "Verificando ID univoco");
  if (cat) {
    console.error(`ID non univoco, categoria già presente ${cat.displayName}`);
    return;
  }

  await showLoadingPromise(categoryRepo.saveNewCategory(newCategory), "Salvataggio categoria");
  console.log("Per impostare la cover, carica un file cover.jpg nella finestra del browser");
  opn(getCategoryStorageUrl(newCategory));
};

const uploadCover = async () => {
  const category = await selectCategory();
  const url = getCategoryStorageUrl(category);
  opn(url);
}

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
    2: () => selectCategory().then(cat => editCategory(cat)),
    3: uploadCover
  })();
};
