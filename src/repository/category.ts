import { injectable, inject } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { Category, CategoryID } from '../model';
import { CrudRepository } from './crud';
import { CategoryUtils } from '../utils';

@injectable()
export class CategoryRepository implements CrudRepository<CategoryID, Category> {
    constructor(
        @inject(CategoryUtils) private utils: CategoryUtils,
        @inject(Firestore) private firestore: Firestore
    ) {}

    async insert(category: Category): Promise<void> {
        this.utils.validate(category);
        const { id, ...data } = category;
        
        await this.firestore
            .collection('categories')
            .doc(id)
            .create(data);
    }

    async get(id: CategoryID): Promise<Category | null> {
        const doc = await this.firestore
            .collection('categories')
            .doc(id)
            .get();

        if (doc.exists)
            return this.utils.from(doc);
        else
            return null;
    }

    async update(category: Category): Promise<void> {
        this.utils.validate(category);

        const { id, ...data } = category;

        await this.firestore
            .collection('categories')
            .doc(id)
            .update(data);
    }

    async delete(id: CategoryID): Promise<void> {
        await this.firestore
            .collection('categories')
            .doc(id)
            .delete();
    }
}
