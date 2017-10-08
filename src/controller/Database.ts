/**
 * This is the singleton database in which all course information will be stored
 */
import Log from "../Util";
import {CourseJSON, DatabaseJSON, SectionJSON} from "./IJSON";
import * as fs from "fs";
import {Section} from "./Section";
import {isNullOrUndefined} from "util";

export interface Criteria {
    [index: string]: any;

    // field represents one of the 9 properties of a Section
    property: string,
    // value is value of the field we wish to query
    value: any,
    // equality is one of gt, lt, or eq for numerical fields
    equality: string
}

export class Database {
    private sectionCollection: Array<Section>;
    private loadedDB: string;
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

    /**
     * Saves the current state of the database to a single file formatted in JSON
     * @param {string} dbName is the file name on disk
     */
    saveDB(dbName: string){
        Log.trace("in writeDB");
        // write in as json
        let cacheContents = this.pukeMemory();
        // console.log(finalBracket);

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
        }
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
                q.property === "dept" ||
                q.property === "id" ||
                q.property === "title" ||
                q.property === "instructor" ||
                q.property === "uuid"
            ) {
                // is a string query
                result = this.handleStrQuery(q.property, q.value)

            } else if (
                q.property === "avg" ||
                q.property === "pass" ||
                q.property === "fail" ||
                q.property === "audit"
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

    // helper to pass into the correct case of the 5 possible string-match queries
    private handleStrQuery(property: string, value: any): Array<Section> {
        switch (property) {
            case 'dept': return this.getDept(value);
            case 'id': return this.getID(value);
            case 'title': return this.getTitle(value);
            case 'instructor': return this.getInstructor(value);
            case 'uuid': return this.getUUID(value);
        }
    }

    // helper to pass into the correct case of the 4 possible numerical queries
    private handleNumQuery(property: string, value: any, equality: string): Array<Section> {
        switch (property) {
            case 'avg': return this.getAvg(value, equality);
            case 'pass': return this.getPass(value, equality);
            case 'fail': return this.getFail(value, equality);
            case 'audit': return this.getAudit(value, equality);
        }
    }

    /**
     * BEGIN: The 9 basic query methods are below
     */

    getDept(dept: string): Array<Section> {
        return this.sectionCollection.filter(s => s.dept === dept)
    }

    getID(id: string): Array<Section> {
        return this.sectionCollection.filter(s => s.id === id)
    }

    getTitle(title: string): Array<Section> {
        return this.sectionCollection.filter(s => s.title === title)
    }

    getInstructor(instructor: string): Array<Section> {
        return this.sectionCollection.filter(s => s.instructor === instructor)
    }

    getAvg(avg: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('avg', avg, equality);
    }

    getPass(pass: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('pass', pass, equality);
    }

    getFail(fail: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('fail', fail, equality);
    }

    getAudit(audit: number, equality: string): Array<Section> {
        return this.meetEqualityCriteria('audit', audit, equality);
    }

    getUUID(uuid: number) {
        // expects ONE result b/c UUID is unique by definition
        return this.sectionCollection.filter(s => s.uuid === uuid);
    }

    /**
     * Abstracted helper function to process inequality queries of relevant numerical fields
     * @param {string} property is the Section property that is being queried
     * @param {number} threshold is the value that the inequality will be checked against
     * @param {string} equality is one of eq = equals, lt = less than, or gt = greater than
     * @returns {Section[]} an array of sections
     */
    private meetEqualityCriteria(property: string, threshold: number, equality: string) {
        if (equality === "gt") {
            return this.sectionCollection.filter(function (section: Section) {
                return section[property] > threshold;
            })
        } else if (equality === "lt") {
            return this.sectionCollection.filter(function (section) {
                return section[property] < threshold;
            })
        } else if (equality === "eq") {
            return this.sectionCollection.filter(function (section) {
                return section[property] === threshold;
            })
        } else {
            // equality did not match gt, lt, or eq; throw error
            throw new Error('equality query expected "gt", "lt", or "eq"')
        }
    }

    // returns number of entries loaded in current database
    countEntries(): number {
        return this.sectionCollection.length;
    }

    // returns the database that is currently loaded
    whichDB(): string {
        return this.loadedDB;
    }

    // returns a list of the databases stored in memory
    listDB(): Array<string> {
        return fs.readdirSync('./dbFiles');
    }

    // may be used to blank the database before loading a query DB or restoring the main DB
    reset() {
        this.sectionCollection.length = 0;

    }
}

const instance = new Database;
Object.freeze(instance);

export default instance;