import { Container } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { firestore, Scaleway } from './datasource';
import { 
    CategoryRepository,
    WallpaperRepository
} from './repository';
import {
    CategoryUtils,
    TranslationUtils,
    WallpaperUtils
} from './utils';

const container = new Container();

// Datasources
container.bind(Firestore).toConstantValue(firestore);
container.bind(Scaleway).toSelf();

// Repositories
container.bind(CategoryRepository).toSelf();
container.bind(WallpaperRepository).toSelf();

// Utils
container.bind(CategoryUtils).toSelf();
container.bind(TranslationUtils).toSelf();
container.bind(WallpaperUtils).toSelf();

export { container };
