/**
 * This is the course object that all courses will be represented as
 */

export interface CourseJSON {
    result: Array<SectionJSON>
}

export interface SectionJSON {
    Audit: number; // audit
    Avg: number; // avg
    Course: string; // id
    Fail: number // fail
    id: number // uuid
    Pass: number // pass
    Professor: string // instructor
    Subject: string; // dept
    Title: string; // title
}

export class Section {

    dept: string;
    id: string;
    title: string;
    instructor: string;
    avg: number;
    pass: number;
    fail: number;
    audit: number;
    uuid: number;

    constructor(
        dept: string,
        id: string,
        title: string,
        instructor: string,
        avg: number,
        pass: number,
        fail: number,
        audit: number,
        uuid: number
    ) {
        this.dept = dept;
        this.id = id;
        this.title = title;
        this.instructor = instructor;
        this.avg = avg;
        this.pass = pass;
        this.fail = fail;
        this.audit= audit;
        this.uuid = uuid;
        //this.dept = str.dept;

        //uuid = jA.uuid;
        //write into fields
        //make obj key/val pair inside hashmap
        //string w/ tab or comma separated; write into file (TBD)
    }
}
