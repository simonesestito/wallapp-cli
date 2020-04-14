/**
 * Interface defining a CRUD repository
 * It has to be implemented by every repository
 *
 * An implementation has to specify two generic types:
 * - ID: the ID of the model
 * - T: the model interface itself
 *
 * All methods are considered async and return Promise
 */
export interface CrudRepository<ID, T> {
    /**
     * Insert a new entity with a given ID
     *
     * @param data The data to insert, with the ID
     */
    insert(data: T): Promise<void>

    /**
     * Get an entity by its ID
     *
     * @param id ID to look for
     * @return Found entity, or null
     */
    get(id: ID): Promise<T | null>

    /**
     * Update an existing entity
     *
     * @param data Entity to overwrite
     */
    update(data: T): Promise<void>

    /**
     * Remove a specified entity by its ID
     *
     * @param id ID to delete
     */
    delete(id: ID): Promise<void>
}
