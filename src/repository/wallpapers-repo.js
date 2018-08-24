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

 import { checkAssert, toPlainObject } from "../utils";
import { firestore, storage } from "../firebase";
import { Wallpaper } from "../model";
import categoryRepo from "./category-repo";
require("babel-polyfill");

const checkWallpaper = wallpaper => {
  try {
    checkAssert(wallpaper);
    checkAssert(wallpaper.categoryId, "Wrong category ID");
    checkAssert(wallpaper.creationDate, "Wrong date");
    checkAssert(wallpaper.id, "Wrong ID");
    checkAssert(
      wallpaper.published !== undefined && wallpaper.published !== null,
      "Wrong publish state"
    );
  } catch (err) {
    console.log(`\n\n${JSON.stringify(wallpaper)}\n\n`);
    throw err;
  }
};

export default {
  async getWallpapersByCategoryId(categoryId) {
    const raw = await firestore
      .collection(`categories/${categoryId}/wallpapers`)
      .orderBy("creationDate", "desc")
      .get();
    const result = [];
    raw.forEach(r => result.push(new Wallpaper(categoryId, r)));
    return result;
  },

  async getWallpaperById(categoryId, wallpaperId) {
    checkAssert(categoryId);
    checkAssert(wallpaperId);

    const raw = await firestore
      .doc(`categories/${categoryId}/wallpapers/${wallpaperId}`)
      .get();
    return raw.exists ? new Wallpaper(categoryId, raw) : null;
  },

  async saveWallpaper(wallpaper) {
    checkWallpaper(wallpaper);
    // Transform to plain js object in case it is ES6 class
    wallpaper = toPlainObject(wallpaper);

    await firestore
      .doc(`categories/${wallpaper.categoryId}/wallpapers/${wallpaper.id}`)
      .set(wallpaper);

    const category = await categoryRepo.getCategoryById(wallpaper.categoryId);

    await storage
      .file(`categories/${category.id}/wallpapers/${wallpaper.id}/.nomedia`)
      .save(" ");

    await categoryRepo.updateWallCount(category);
  },

  async deleteWallpaper(wallpaper) {
    checkWallpaper(wallpaper);

    await firestore
      .doc(`categories/${wallpaper.categoryId}/wallpapers/${wallpaper.id}`)
      .delete();

    await storage.deleteFiles({
      prefix: `categories/${wallpaper.categoryId}/wallpapers/${wallpaper.id}`
    });

    const category = await categoryRepo.getCategoryById(wallpaper.categoryId);
    await categoryRepo.updateWallCount(category);
  }
};
