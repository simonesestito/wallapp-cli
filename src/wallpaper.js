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
import { when, getWallpaperStorageUrl, showLoadingPromise } from "./utils";
import * as firebase from "@google-cloud/firestore";
import wallpapersRepo from "./repository/wallpapers-repo";
import { Spinner } from "cli-spinner";
import { selectCategory } from "./categories";
const opn = require("opn");
require("babel-polyfill");

const options = [
  "Aggiungi sfondo",
  "Rimuovi sfondo",
  "Modifica sfondo",
  "Carica o modifica file"
];

const yesNo = ["Si", "No"];

const editWallpaper = async () => {
  const wallpaper = await selectWallpaper();

  const newWallpaper = await prompt([
    {
      type: "list",
      message: "Pubblicato",
      name: "published",
      choices: yesNo,
      default: wallpaper.published ? 0 : 1,
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
          choice == yesNo[0] ? new Date() : wallpaper.creationDate
        )
    }
  ]);
  wallpaper.published = newWallpaper.published;
  wallpaper.creationDate = newWallpaper.creationDate;

  await showLoadingPromise(wallpapersRepo.saveWallpaper(wallpaper), "Salvataggio in corso");
  console.log(
    "Per impostare gli sfondi, carica i file delle corrette dimensioni su:\n" +
      getWallpaperStorageUrl(newWallpaper)
  );
};

const selectWallpaper = async () => {
  const category = await selectCategory();
  const wallpapers = await showLoadingPromise(wallpapersRepo.getWallpapersByCategoryId(category.id), "Caricamento sfondi");

  let humanWallpapers = [];
  wallpapers.forEach(c =>
    humanWallpapers.push(c.toReadableString())
  );

  const choice = await prompt({
    name: "wallChoice",
    message: "Scegli lo sfondo",
    type: "list",
    choices: humanWallpapers
  });
  const index = humanWallpapers.indexOf(choice.wallChoice);
  return wallpapers[index];
};

const deleteWallpaper = async () => {
  const wall = await selectWallpaper();
  const check = await prompt({
    name: "verifyId",
    message: "Scrivi l'ID dello sfondo da eliminare per confermare",
    validate: input =>
      input === wall.id ? true : "Scrivi l'ID corretto o annulla con CTRL+C"
  });

  if (check.verifyId === wall.id) {
    await showLoadingPromise(wallpapersRepo.deleteWallpaper(wall), "Eliminazione sfondo");
  }
};

const addWallpaper = async () => {
  const category = await selectCategory();

  const newWallpaper = await prompt([
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

  newWallpaper.creationDate = new Date();
  newWallpaper.categoryId = category.id;

  // Check unique ID
  const wall = await showLoadingPromise(wallpapersRepo.getWallpaperById(newWallpaper.categoryId, newWallpaper.id), "Verificando ID univoco");
  if (wall) {
    console.error("ID non univoco, wallpaper già presente");
    return;
  }

  await showLoadingPromise(wallpapersRepo.saveWallpaper(newWallpaper), "Salvataggio sfondo");
  console.log("Per impostare gli, carica i file correttamente nella finestra del browser");
  opn(getWallpaperStorageUrl(newWallpaper));
};

const uploadFiles = async () => {
  const wallpaper = await selectWallpaper();
  const url = getWallpaperStorageUrl(wallpaper);
  opn(url);
}

export default async () => {
  const choice = await prompt({
    name: "wallAction",
    message: "Azioni sugli sfondi",
    type: "list",
    choices: options
  });
  const index = options.indexOf(choice.wallAction);
  when(index, {
    0: addWallpaper,
    1: deleteWallpaper,
    2: editWallpaper,
    3: uploadFiles
  })();
};
