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

export class Category {
  constructor(snapshot) {
    if (snapshot) {
      this.id = snapshot.id;
      this.count = snapshot.get("count");
      this.creationDate = snapshot.get("creationDate");
      this.description = snapshot.get("description");
      this.displayName = snapshot.get("displayName");
      this.published = snapshot.get("published");
    } else {
      this.id = undefined;
      this.count = 0;
      this.creationDate = undefined; // Assign new Date() below
      this.description = undefined;
      this.displayName = undefined;
      this.published = false;
    }

    if (this.creationDate && typeof this.creationDate.toDate === "function") {
      this.creationDate = this.creationDate.toDate();
    } else {
      this.creationDate = new Date();
    }
  }

  toReadableString() {
    return `${this.displayName} (ID: ${this.id})`;
  }
}

export class Wallpaper {
  constructor(categoryId, snapshot) {
    if (snapshot) {
      this.id = snapshot.id;
      this.categoryId = categoryId;
      this.creationDate = snapshot.get("creationDate").toDate();
      this.published = snapshot.get("published");
    } else {
      this.id = undefined;
      this.categoryId = undefined;
      this.creationDate = new Date();
      this.published = false;
    }
  }

  toReadableString() {
    return `Wallpaper ID ${this.id}`;
  }
}
