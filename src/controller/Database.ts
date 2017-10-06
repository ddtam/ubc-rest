/**
 * This is the singleton database in which all course information will be stored
 */
import Log from "../Util";
import {CourseJSON, DatabaseJSON, SectionJSON} from "./IJSON";
import * as fs from "fs";
import {Section} from "./Section";

export class Database {
    private sectionCollection: Array<Section>;
    private static instance: Database;

    constructor() {
        if (! Database.instance) {
            this.sectionCollection = [];
            Database.instance = this;
        }
        return Database.instance;

    }

    /**
     * Add takes a JSON object for a course and writes all the sections it encodes into the database
     * @param {string} courseJSON
     */
    add(courseJSON: CourseJSON) {
        for (let i = 0; i < courseJSON.result.length; i++) {
            let sectionJSON: SectionJSON = courseJSON.result[i];
            let s = new Section(
                sectionJSON.Subject,
                sectionJSON.Course,
                sectionJSON.Title,
                sectionJSON.Professor,
                sectionJSON.Avg,
                sectionJSON.Pass,
                sectionJSON.Fail,
                sectionJSON.Audit,
                sectionJSON.id
            );

            this.sectionCollection.push(s);

            // TODO also need to write to file
        }
    }

    addDB(dbName: string, dbPath: string) {
        var content = fs.readFileSync(dbPath).toString('string');
        var dbJSON: DatabaseJSON = JSON.parse(content);

        for (let i = 0; i < dbJSON.contents.length; i++) {
            // TODO
        }
    }

    countEntries(): number {
        return this.sectionCollection.length;
    }

    getUUID(uuid: number) {
        // this is just one example method; we can implement something like this for all the other fields
        //  if this works out well...
        return this.sectionCollection.find(c => c.uuid === uuid)
    }

    // THIS SHOULD ONLY EVER BE USED IN TESTING; resets singleton by emptying collection
    reset() {
        this.sectionCollection.length = 0;

    }
}

const instance = new Database;
Object.freeze(instance);

export default instance;