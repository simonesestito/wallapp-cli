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
