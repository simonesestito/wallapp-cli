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
import * as firebase from "@google-cloud/firestore";
import wallpapersRepo from "./repository/wallpapers-repo";
import { Spinner } from "cli-spinner";
import { selectCategory } from "./categories";
require("babel-polyfill");

const options = [
  "Aggiungi sfondo",
  "Rimuovi sfondo",
  "Modifica sfondo"
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
      filter: choice =>
        firebase.Timestamp.fromDate(
          choice == yesNo[0] ? new Date() : wallpaper.creationDate
        )
    }
  ]);
  wallpaper.published = newWallpaper.published;
  wallpaper.creationDate = newWallpaper.creationDate;

  const spinner = new Spinner("Salvataggio in corso...");
  spinner.start();
  await wallpapersRepo.saveWallpaper(wallpaper);
  spinner.stop();
};

const selectWallpaper = async () => {
  const category = await selectCategory();
  const spinner = new Spinner("Caricamento sfondi...");
  spinner.start();
  const wallpapers = await wallpapersRepo.getWallpapersByCategoryId(category.id);
  spinner.stop();

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
    const spinner = new Spinner("Eliminazione sfondo...");
    spinner.start();
    await wallpapersRepo.deleteWallpaper(wall);
    spinner.stop();
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
  let spinner = new Spinner("Verificando ID univoco...");
  spinner.start();
  const wall = await wallpapersRepo.getWallpaperById(newWallpaper.categoryId, newWallpaper.id);
  spinner.stop();
  if (wall) {
    console.error("ID non univoco, wallpaper già presente");
    return;
  }

  spinner = new Spinner("Salvataggio sfondo...");
  spinner.start();
  await wallpapersRepo.saveWallpaper(newWallpaper);
  spinner.stop();
};

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
  })();
};