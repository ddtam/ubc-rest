/**
 * This is the singleton database in which all course information will be stored
 */
import Log from "../Util";
import {CourseJSON, DatabaseJSON, SectionJSON} from "./IJSON";
let fs = require('fs');
import {Section} from "./Section";
import {isNullOrUndefined} from "util";

export interface Criteria {
    [index: string]: any;

    // field represents one of the 9 properties of a Section
    property: string,
    // value is value of the field we wish to query
    value: any,
    // equality is one of gt, lt, or eq for numerical fields
    equality?: string
}

export class Database {
    private sectionCollection: Array<Section>;
    private loadedDB: Array<string>;
    private static instance: Database;

    constructor() {
        if (! Database.instance) {
            this.sectionCollection = [];
            this.loadedDB = [];
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

        }
    }

    /**
     * Delete a section from the database
     */
    deleteEntry(s: Section) {
        let target:number = this.sectionCollection.indexOf(s);
        if (target > -1) {
            this.sectionCollection.splice(target, 1);
        }
    }

    /**
     * Saves the current state of the database to a single file formatted in JSON
     * @param {string} dbName is the file name on disk
     * @param firstTime is true if this is the first time this database is being saved
     *  (usually only after populating from zip)
     */
    saveDB(dbName: string, firstTime?: boolean){
        Log.trace("in writeDB");
        // write in as json
        let cacheContents = this.pukeMemory();
        // console.log(finalBracket);

        if (!isNullOrUndefined(firstTime) && firstTime) {
            // change which databases are loaded
            this.loadedDB.push(dbName);
        }

        fs.writeFileSync("./dbFiles/" + dbName, cacheContents);

        Log.info("The file was saved!");
    }

    /**
     * Loads a database from file by name
     * @param {string} dbName is the name of the database to be loaded into memory
     */
    loadDB(dbName: string) {
        var content = fs.readFileSync('./dbFiles/' + dbName).toString('string');
        var dbJSON: DatabaseJSON = JSON.parse(content);

        for (let i = 0; i < dbJSON.content.length; i++) {
            // TODO
            // for each Section information, create a new Section and add it to the sectionCollection
            // should check for duplicates probably?
        }
    }

    /**
     * Deletes a database from disk and clears its entries from memory
     * @param {string} dbName
     */
    deleteDB(dbName: string) {

        if (this.loadedDB.includes(dbName)) {
            // remove from list of loaded
            let pos = this.loadedDB.indexOf(dbName);
            this.loadedDB.splice(pos, 1);

            // blank memory and reload remaining databases
            this.reset();
            if (this.loadedDB.length !== 0) {
                for (let db of this.loadedDB) {
                    // this.loadDB(db); TODO: change when implemented
                }
            }
        }

        // delete from disk
        fs.unlinkSync('./dbFiles/' + dbName)

    }

    /**
     * Query takes an array of Criteria and queries the database to return an array of sections that fulfill
     *  all the criteria
     * @param {Array<Criteria>} questions
     * @returns {Array<Section>}
     */
    query(questions: Array<Criteria>): Array<Section> {
        let result: Array<Section>;
        let originalDB: Array<Section>;

        for (let q of questions) {
            // check if first query
            if (questions[0] === q) {
                // hold onto the current database
                originalDB = this.sectionCollection.slice(0);

            }

            if (
                q.property === "courses_dept" ||
                q.property === "courses_id" ||
                q.property === "courses_title" ||
                q.property === "courses_instructor" ||
                q.property === "courses_uuid"
            ) {
                // is a string query
                result = this.handleStrQuery(q.property, q.value)

            } else if (
                q.property === "courses_avg" ||
                q.property === "courses_pass" ||
                q.property === "courses_fail" ||
                q.property === "courses_audit"
            ) {
                // is a numerical query with some equality comparison
                result = this.handleNumQuery(q.property, q.value, q.equality)

            } else {
                // query is poorly formed; throw error
                throw new Error('query is poorly formed; property "' + q.property + '" does not exist')

            }
            // set result of this sub-query as the new database for the next query
            this.reset();

            // if nothing was returned, no sections match the search criteria; break out
            if (result.length === 0) {
                break;
            }

            // write in results as working database for next sub-query
            for (let s of result) {
                this.sectionCollection.push(s);
            }

        }
        // done all queries; restore original database
        this.reset();
        for (let s of originalDB) {
            this.sectionCollection.push(s);
        }

        // return query results
        return result;

    }

    // helper to courses_pass into the correct case of the 5 possible string-match queries
    private handleStrQuery(property: string, value: any): Array<Section> {
        switch (property) {
            case 'courses_dept': return this.getDept(value);
            case 'courses_id': return this.getID(value);
            case 'courses_title': return this.getTitle(value);
            case 'courses_instructor': return this.getInstructor(value);
            case 'courses_uuid': return this.getUUID(value);
        }
    }

    // helper to courses_pass into the correct case of the 4 possible numerical queries
    private handleNumQuery(property: string, value: any, equality: string): Array<Section> {
        switch (property) {
            case 'courses_avg': return this.getAvg(value, equality);
            case 'courses_pass': return this.getPass(value, equality);
            case 'courses_fail': return this.getFail(value, equality);
            case 'courses_audit': return this.getAudit(value, equality);
        }
    }

    /**
     * BEGIN: The 9 basic query methods are below
     */

    getDept(dept: string): Array<Section> {
        return this.sectionCollection.filter(s => s.courses_dept === dept)
    }

    getID(id: string): Array<Section> {
        return this.sectionCollection.filter(s => s.courses_id === id)
    }

    getTitle(title: string): Array<Section> {
        return this.sectionCollection.filter(s => s.courses_title === title)
    }

    getInstructor(instructor: string): Array<Section> {
        return this.sectionCollection.filter(s => s.courses_instructor === instructor)
    }

    getAvg(avg: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('courses_avg', avg, equality);
    }

    getPass(pass: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('courses_pass', pass, equality);
    }

    getFail(fail: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('courses_fail', fail, equality);
    }

    getAudit(audit: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('courses_audit', audit, equality);
    }

    getUUID(uuid: number) {
        // expects ONE result b/c UUID is unique by definition
        return this.sectionCollection.filter(s => s.courses_uuid === uuid);
    }

    /**
     * Abstracted helper function to process inequality queries of relevant numerical fields
     * @param {string} property is the Section property that is being queried
     * @param {number} threshold is the value that the inequality will be checked against
     * @param {string} equality is one of eq = equals, lt = less than, or gt = greater than
     * @returns {Section[]} an array of sections
     */
    private meetEqualityCriteria(property: string, threshold: number, equality: string) {
        if (equality === "GT") {
            return this.sectionCollection.filter(function (section: Section) {
                return section[property] > threshold;
            })
        } else if (equality === "LT") {
            return this.sectionCollection.filter(function (section) {
                return section[property] < threshold;
            })
        } else if (equality === "EQ") {
            return this.sectionCollection.filter(function (section) {
                return section[property] === threshold;
            })
        } else {
            // equality did not match gt, lt, or eq; throw error
            throw new Error('equality query expected "GT", "LT", or "EQ"')
        }
    }

    /**
     * Converts entire array collection into JSON format and returns as string
     *   Should really be diagnostic use only...
     * @returns {string}
     */
    pukeMemory(): string {
        let asJSON = "{\"content\": ";
        let withCollection = asJSON.concat(JSON.stringify(this.sectionCollection));
        let finalBracket = withCollection.concat("}");

        return finalBracket;
    }

    getOpposite(a: Array<Section>): Array<Section> {
        let originalDB: Array<Section> = this.sectionCollection.slice(0);
        let result: Array<Section> = [];

        for (let s of a) {
            this.deleteEntry(s)
        }

        result = this.sectionCollection.slice(0);

        // done getting opposite; restore original database
        this.reset();
        for (let s of originalDB) {
            this.sectionCollection.push(s);
        }

        return result;

    }

    // returns number of entries loaded in current database
    countEntries(): number {
        return this.sectionCollection.length;
    }

    // returns the database that is currently loaded
    listLoaded(): Array<string> {
        return this.loadedDB;
    }

    // returns a list of the databases stored in memory
    listDB(): Array<string> {
        return fs.readdirSync('./dbFiles');
    }

    hasDB(id: string): boolean {
        return this.loadedDB.includes(id);
    }

    // may be used to blank the database before loading a query DB or restoring the main DB
    reset() {
        this.sectionCollection.length = 0;

    }
}

const instance = new Database;
Object.freeze(instance);

export default instance;