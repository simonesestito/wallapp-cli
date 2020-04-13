import { Container } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { firestore, Scaleway } from '../datasource';
import { WallpaperRepository } from '../repository';

const container = new Container();

// Datasources
container.bind(Firestore).toConstantValue(firestore);
container.bind(Scaleway).toSelf();

// Repositories
container.bind(WallpaperRepository).toSelf();

export { container };
