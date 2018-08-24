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

import { BASE_FIREBASE_STORAGE_CONSOLE_URL } from "./firebase";
import { Spinner } from "cli-spinner";
require("babel-polyfill");

export const when = (key, cases) => cases[key];

export const checkAssert = (expression, message) => {
  if (!expression) {
    throw new Error(
      (message ? message : "Assertion failed") + `: ${expression}`
    );
  }
};

/**
 * Transform an ES6 object into plain JS object
 * Useful before passing the object to Firestore
 * @param {Object} obj
 */
export const toPlainObject = obj => {
  const plain = {};
  for (const x in obj) {
    if (typeof obj[x] !== "function") {
      plain[x] = obj[x];
    }
  }
  return plain;
};

/**
 * Get the browsable URL of the category folder in Firebase Storage
 * @param {Category} category
 */
export const getCategoryStorageUrl = category =>
  BASE_FIREBASE_STORAGE_CONSOLE_URL +
  encodeURIComponent(`/categories/${category.id}/`).replace(/%/g, "~");

/**
 * Get the browsable URL of the wallpaper folder in Firebase Storage
 * @param {Wallpaper} wallpaper
 */
export const getWallpaperStorageUrl = wallpaper =>
  BASE_FIREBASE_STORAGE_CONSOLE_URL +
  encodeURIComponent(
    `/categories/${wallpaper.categoryId}/wallpapers/${wallpaper.id}/`
  ).replace(/%/g, "~");

/**
 * Display a Spinner until a Promise if fullfilled
 * @param {Promise} promise
 * @param {String} message Message of the spinner
 */
export const showLoadingPromise = async (promise, message = "Caricamento") => {
  const spinner = new Spinner(`${message}...`);
  spinner.start();
  let result;
  try {
    result = await promise;
  } finally {
    spinner.stop(true);
    console.log(""); // Print a new line
  }
  if (result) {
    return result;
  }
};
