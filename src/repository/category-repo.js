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
import { Category } from "../model";
import wallpapersRepo from "./wallpapers-repo";
require("babel-polyfill");

const checkCategory = category => {
  try {
    checkAssert(category);
    checkAssert(
      category.count >= 0 && category.count !== undefined,
      "Wrong count"
    );
    checkAssert(category.description, "Wrong description");
    checkAssert(category.description.default, "No default description");
    checkAssert(category.displayName, "Wrong title");
    checkAssert(category.displayName.default, "No default title");
    checkAssert(category.id, "Wrong ID");
    checkAssert(
      category.published !== undefined && category.published !== null,
      "Wrong publish state"
    );
  } catch (err) {
    console.log(`\n\n${JSON.stringify(category)}\n\n`);
    throw err;
  }
};

export default {
  async getCategories() {
    const raw = await firestore
      .collection("categories")
      .orderBy("creationDate", "desc")
      .get();
    const result = [];
    raw.forEach(r => result.push(new Category(r)));
    return result;
  },

  async getCategoryById(id) {
    const raw = await firestore.doc(`categories/${id}`).get();
    return raw.exists ? new Category(raw) : null;
  },

  async updateCategory(category) {
    checkCategory(category);
    const id = category.id;

    // Transform to plain js object in case it is ES6 class
    category = toPlainObject(category);

    await firestore.doc(`categories/${id}`).set(category, {
      merge: true
    });
  },

  async saveNewCategory(category) {
    category.count = 0;
    checkCategory(category);
    await firestore.doc(`categories/${category.id}`).set(category);

    await storage.file(`categories/${category.id}/.nomedia`).save(" ");
  },

  async deleteCategory(category) {
    checkCategory(category);

    await storage.deleteFiles({
      prefix: `categories/${category.id}/`
    });

    const walls = await firestore
      .collection(`categories/${category.id}/wallpapers`)
      .get();
    const queue = [];
    walls.forEach(w => queue.push(w.ref.delete()));
    await Promise.all(queue);

    await firestore.doc(`categories/${category.id}`).delete();
  },

  async updateWallCount(category) {
    checkCategory(category);
    const walls = await wallpapersRepo.getWallpapersByCategoryId(category.id);
    category.count = walls.filter(w => w.published).length;
    this.updateCategory(category);
  }
};
