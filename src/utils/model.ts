import { DocumentSnapshot } from '@google-cloud/firestore';

/**
 * Utility functions on a model interface.
 */
export interface ModelUtils<T> {
    /**
     * Validate if the given model is correct at runtime
     *
     * @param data The model to check
     * @throws Error if data is not valid
     */
    validate(data: T): void

    /**
     * Creates a model object from a Firestore document
     *
     * @param doc The snapshot of the Firestore document
     * @return A model object
     */
    from(doc: DocumentSnapshot): T
}
