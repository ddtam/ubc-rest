/**
 * This is the course object that all courses will be represented as
 */

import {ICourse} from "./ICourse";
import JSON = Mocha.reporters.JSON;

class Course {

    dept: string;
    id: string;
    title: string;
    instructor: string;
    avg: number;
    instructor: string;
    title: string;
    pass: number;
    fail: number;
    audit: number;
    uuid: string;

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
    }

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

        console.log("in write");
        this.dept = dep;
        this.id = cid;
        this.avg = av;
        this.instructor = instruct;
        this.title = tit;
        this.pass = pas;
        this.fail = fai;
        this.audit = aud;
        this.uuid = uu;
        console.log("end write");

        //this.dept = str.dept;

        //uuid = jA.uuid;
        //write into fields
        //make obj key/val pair inside hashmap
        //string w/ tab or comma separated; write into file (TBD)
    }
}
