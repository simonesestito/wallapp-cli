/*
 * This file is part of WallApp CLI Manager.
 * Copyright (C) 2018-2020  Simone Sestito
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
import { when, showLoadingPromise } from "./utils";
import * as firebase from "@google-cloud/firestore";
import wallpapersRepo from "./repository/wallpapers-repo";
import { selectCategory } from "./categories";
import categoryRepo from "./repository/category-repo";
import * as fs from 'fs';

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
      default: 1, // No
      filter: choice =>
        firebase.Timestamp.fromDate(
          choice == yesNo[0] ? new Date() : wallpaper.creationDate
        )
    },
    {
      name: "authorName",
      message: "Nome autore (Vuoto per non impostarlo)",
      default: wallpaper.authorName || ""
    },
    {
      name: "authorBio",
      message: "Bio autore (Vuoto per non impostarlo)",
      default: wallpaper.authorBio || ""
    },
    {
      name: "authorSocial",
      message: "Link autore (Vuoto per non impostarlo)",
      default: wallpaper.authorSocial || ""
    }
  ]);

  wallpaper.published = newWallpaper.published;
  wallpaper.creationDate = newWallpaper.creationDate;
  wallpaper.authorName = newWallpaper.authorName || null;
  wallpaper.authorBio = newWallpaper.authorBio || null;
  wallpaper.authorSocial = newWallpaper.authorSocial || null;

  await showLoadingPromise(
    wallpapersRepo.saveWallpaper(wallpaper),
    "Salvataggio in corso"
  );
};

const selectWallpaper = async () => {
  const category = await selectCategory();
  const wallpapers = await showLoadingPromise(
    wallpapersRepo.getWallpapersByCategoryId(category.id),
    "Caricamento sfondi"
  );

  let humanWallpapers = [];
  wallpapers.forEach(c => humanWallpapers.push(c.toReadableString()));

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
    await showLoadingPromise(
      wallpapersRepo.deleteWallpaper(wall),
      "Eliminazione sfondo"
    );
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
      type: "list",
      name: "community",
      message: "Sfondo community?",
      choices: yesNo,
      default: 1,
      filter: choice => choice == yesNo[0]
    }
  ]);

  newWallpaper.creationDate = new Date();
  newWallpaper.categoryId = category.id;

  if (newWallpaper.community) {
    // Check author file
    const authorFile = process.cwd() + '/autore.txt';
    const authorFileStat = fs.statSync(authorFile);
    if (!authorFileStat.isFile) {
      console.error('File ' + authorFile + ' non trovato!');
      process.exit(1);
    }

    const authorFileContent = fs.readFileSync(authorFile, { encoding: 'utf-8' });
    [
      newWallpaper.authorName,
      newWallpaper.authorBio,
      newWallpaper.authorSocial
    ] = authorFileContent.split('\n');
  } else {
    newWallpaper.authorName = null;
    newWallpaper.authorBio = null;
    newWallpaper.authorSocial = null;
  }

  delete newWallpaper.community;

  // Populate ID
  const walls = await showLoadingPromise(
    wallpapersRepo.getWallpapersByCategoryId(newWallpaper.categoryId),
    "Calcolando ID incrementale"
  );
  const wallIds = walls.filter(wall => Number.parseInt(wall.id) == wall.id)
    .map(wall => Number.parseInt(wall.id));
  const lastId = wallIds.length > 0 ? Math.max(...wallIds) : 0;
  newWallpaper.id = lastId + 1;

  // Update category creation date automatically
  category.creationDate = firebase.Timestamp.fromDate(new Date())
  const updateCategoryPromise = categoryRepo.updateCategory(category);

  await showLoadingPromise(
    Promise.all([
      wallpapersRepo.saveWallpaper(newWallpaper),
      updateCategoryPromise
    ]),
    "Salvataggio sfondo"
  );
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
    2: editWallpaper
  })();
};
