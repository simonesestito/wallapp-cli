export class Category {
  constructor(snapshot) {
    if (snapshot) {
      this.id = snapshot.id;
      this.count = snapshot.get("count");
      this.creationDate = snapshot.get("creationDate").toDate();
      this.description = snapshot.get("description");
      this.displayName = snapshot.get("displayName");
      this.published = snapshot.get("published");
    } else {
      this.id = undefined;
      this.count = 0;
      this.creationDate = new Date();
      this.description = undefined;
      this.displayName = undefined;
      this.published = false;
    }
  }

  toReadableString() {
    return `${this.displayName} (ID: ${this.id})`;
  }
}

export class Wallpaper {
  constructor(snapshot) {
    if (snapshot) {
      this.id = snapshot.id;
      this.categoryId = categoryId;
      this.creationDate = snapshot.get("creationDate").toDate();
      this.published = snapshot.get("published");
    } else {
      this.id = undefined;
      this.creationDate = new Date();
      this.published = false;
    }
  }

  toReadableString() {
    return `Wallpaper ID ${this.id}`;
  }
}
