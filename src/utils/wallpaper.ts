import { injectable } from 'inversify';
import { ModelUtils } from './model';
import { Wallpaper } from '../model';
import { DocumentSnapshot } from '@google-cloud/firestore';

@injectable()
export class WallpaperUtils implements ModelUtils<Wallpaper> {
    validate(data: Wallpaper) {
        if (data == null)
            throw new Error('Wallpaper is null');

        if (typeof data !== 'object')
            throw new Error('Wallpaper is not an object');

        if (typeof data.id !== 'string')
            throw new Error('Wallpaper ID is not a string');

        if (typeof data.categoryId !== 'string')
            throw new Error('Category ID is not a string');

        if (!(data.creationDate instanceof Date))
            throw new Error('Wallpaper creation date is not a date');

        if (typeof data.published !== 'boolean')
            throw new Error('Wallpaper published field is not a boolean');

        // Check content
        if (data.id.length === 0)
            throw new Error('Wallpaper ID is empty');

        if (data.categoryId.length === 0)
            throw new Error('Category ID is empty');

        if (data.creationDate > new Date())
            throw new Error('Wallpaper creation date is in the future');
    }

    from(doc: DocumentSnapshot): Wallpaper {
        const path = doc.ref.path.split('/');
        return {
            id: doc.id,
            categoryId: path[1],
            creationDate: doc.get('creationDate').toDate(),
            published: !!doc.get('published')
        };
    }
}

