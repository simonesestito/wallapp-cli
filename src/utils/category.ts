import { injectable, inject } from 'inversify';
import { ModelUtils } from './model';
import { TranslationUtils } from './translation';
import { Category, CategoryGroup } from '../model';
import { DocumentSnapshot } from '@google-cloud/firestore';

@injectable()
export class CategoryUtils implements ModelUtils<Category> {
    constructor(
        @inject(TranslationUtils) private translationUtils: TranslationUtils
    ) {}

    validate(data: Category) {
        if (data == null)
            throw new Error('Category is null');

        if (typeof data !== 'object')
            throw new Error('Category must be an object');

        if (typeof data.id !== 'string')
            throw new Error('Category ID must be a string');

        if (!(data.creationDate instanceof Date))
            throw new Error('Creation date is not a date');

        if (data.creationDate > new Date())
            throw new Error('Creation date is in the future');

        if (typeof data.published !== 'boolean')
            throw new Error('Published field is not a boolean');

        if (typeof data.count !== 'number')
            throw new Error('Category walls counts is not a number');

        if (data.count % 1 > 0)
            throw new Error('Category walls count is not an integer');

        if (data.count < 0)
            throw new Error('Category walls count is negative');

        if (typeof data.group !== 'string')
            throw new Error('Category group is not a string');

        if (!(data.group in CategoryGroup))
            throw new Error('Category group is invalid');

        this.translationUtils.validate(data.description);
        this.translationUtils.validate(data.title);

    }

    from(doc: DocumentSnapshot): Category {
        return {
            id: doc.id,
            count: doc.get('count'),
            creationDate: doc.get('creationDate').toDate(),
            published: doc.get('published'),
            group: doc.get('group'),
            title: doc.get('title'),
            description: doc.get('description')
        };
    }
}
