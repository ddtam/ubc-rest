/**
 * This is the course object that all courses will be represented as
 */

class Course {
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

    }
}