import { Container } from 'inversify';
import { Firestore } from '@google-cloud/firestore';
import { firestore, Scaleway } from '../datasource';

const container = new Container();

// Datasources
container.bind(Firestore).toConstantValue(firestore);
container.bind(Scaleway).toSelf();

export { container };
