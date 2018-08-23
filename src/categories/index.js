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
import { when } from "../utils";
import { firestore } from "../firebase";
require("babel-polyfill");

const options = [
  "Aggiungi categoria",
  "Rimuovi categoria",
  "Modifica categoria"
];

const editCategory = async category => {
  const yesNo = ["Si", "No"];

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
    }
  ]);

  // TODO: test only
  console.log(JSON.stringify(newCategory));
};

const selectCategory = async () => {
  const categories = await listCategories();
  let humanCategories = [];
  categories.forEach(c =>
    humanCategories.push(`${c.displayName} (ID: ${c.id})`)
  );

  const choice = await prompt({
    name: "categoryChoice",
    message: "Scegli la categoria",
    type: "list",
    choices: humanCategories
  });
  return categories[humanCategories.indexOf(choice)];
};

const deleteCategory = async () => {
  await selectCategory();
};

const listCategories = async () => {
  const raw = await firestore.collection("categories").get();
  const result = [];
  raw.forEach(r => {
    const data = r.data();
    data.id = r.id;
    result.push(data);
  });
  return result;
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
    0: () => editCategory({}),
    1: deleteCategory,
    2: () => selectCategory().then(cat => editCategory(cat))
  })();
};
