import { Container } from 'inversify';
import {
    FIRESTORE_TYPE,
    firestore
} from '../sources';

const container = new Container();

container.bind(FIRESTORE_TYPE).toConstantValue(firestore);

export { container };
