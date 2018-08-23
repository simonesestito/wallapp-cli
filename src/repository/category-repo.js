import { checkAssert } from "../utils";
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
    checkAssert(category.displayName, "Wrong title");
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
    const time = category.creationDate;
    category = JSON.parse(JSON.stringify(category))
    category.creationDate = time;

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
