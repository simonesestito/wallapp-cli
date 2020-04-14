import { injectable, inject } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { CrudRepository } from './crud';
import { Wallpaper, WallpaperID } from '../model';
import { WallpaperUtils } from '../utils';

@injectable()
export class WallpaperRepository implements CrudRepository<WallpaperID, Wallpaper> {
    constructor(
        @inject(Firestore) private firestore: Firestore,
        @inject(WallpaperUtils) private utils: WallpaperUtils
    ) {}

    async insert(wallpaper: Wallpaper): Promise<void> {
        this.utils.validate(wallpaper);
        const { id, categoryId, ...data } = wallpaper;
        
        await this.firestore
            .collection('categories')
            .doc(categoryId)
            .collection('wallpapers')
            .doc(id)
            .create(data);
    }

    async get(wallpaperId: WallpaperID): Promise<Wallpaper | null> {
        const { id, categoryId } = wallpaperId;

        const doc = await this.firestore
            .collection('categories')
            .doc(categoryId)
            .collection('wallpapers')
            .doc(id)
            .get();

        if (doc.exists)
            return this.utils.from(doc);
        else
            return null;
    }

    async update(wallpaper: Wallpaper): Promise<void> {
        this.utils.validate(wallpaper);

        const { id, categoryId, ...data } = wallpaper;

        await this.firestore
            .collection('categories')
            .doc(categoryId)
            .collection('wallpapers')
            .doc(id)
            .update(data);
    }

    async getByCategory(categoryId: string): Promise<Wallpaper[]> {
        const collection = await this.firestore
            .collection('categories')
            .doc(categoryId)
            .collection('wallpapers')
            .orderBy('creationDate', 'desc')
            .get();

        const result: Wallpaper[] = [];
        collection.forEach(e => {
            const wallpaper = this.utils.from(e);
            result.push(wallpaper);
        });
        return result;
    }

    async delete(wallpaperId: WallpaperID): Promise<void> {
        const { id, categoryId } = wallpaperId;

        await this.firestore
            .collection('categories')
            .doc(categoryId)
            .collection('wallpapers')
            .doc(id)
            .delete();
    }
}
