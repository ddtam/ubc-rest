/**
 * This is the singleton database in which all course information will be stored
 */
import Log from "../Util";
import {CourseJSON, DatabaseJSON, SectionJSON} from "./IJSON";
import * as fs from "fs";
import {Section} from "./Section";

interface IQuestion {

}

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

    getUUID(uuid: number) {
        // expects ONE result b/c UUID is unique by definition
        return this.sectionCollection.filter(s => s.uuid === uuid);
    }

    // returns number of entries loaded in current database
    countEntries(): number {
        return this.sectionCollection.length;
    }

    // may be used to blank the database before loading a queryDB or restoring the mainDB
    reset() {
        this.sectionCollection.length = 0;

    }
}

const instance = new Database;
Object.freeze(instance);

export default instance;