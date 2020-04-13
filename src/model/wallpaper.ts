export interface WallpaperID {
    id: string;
    categoryId: string;
}

export interface WallpaperData {
    creationDate: Date;
    published: boolean;
    // TODO Author info
}

export type Wallpaper = WallpaperID | WallpaperData;
