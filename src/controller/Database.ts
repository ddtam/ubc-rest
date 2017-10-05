/**
 * This is the singleton database in which all course information will be stored
 */

class Database {
    private hashmap: Array<Course>;
    private static instance: Database;

    constructor() {
        if (! Database.instance) {
            this.hashmap = [];
            Database.instance = this;
        }
        return Database.instance;

    }

    add(course: Course) {
        this.hashmap.push(course);
    }

    getUUID(uuid: number) {
        // this is just one example method; we can implement something like this for all the other fields
        //  if this works out well...
        return this.hashmap.find(c => c.uuid === uuid)
    }
}

const instance = new Database;
Object.freeze(instance);

export default instance;