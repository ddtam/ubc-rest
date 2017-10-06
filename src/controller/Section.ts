/**
 * This is the course section object that all sections will be represented as
 */
export class Section {
    [index: string]: any;

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
