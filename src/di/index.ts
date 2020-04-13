import { Container } from 'inversify';
import {
    FIRESTORE_TYPE,
    firestore,
    Scaleway
} from '../sources';

const container = new Container();

container.bind(FIRESTORE_TYPE).toConstantValue(firestore);
container.bind(Scaleway).toSelf();

export { container };
