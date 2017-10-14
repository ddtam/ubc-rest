/**
 * This is the course section object that all sections will be represented as
 */
export class Section {
    [index: string]: any;

    courses_dept: string;
    courses_id: string;
    courses_title: string;
    courses_instructor: string;
    courses_avg: number;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;
    courses_uuid: number;

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
        this.courses_dept = dept;
        this.courses_id = id;
        this.courses_title = title;
        this.courses_instructor = instructor;
        this.courses_avg = avg;
        this.courses_pass = pass;
        this.courses_fail = fail;
        this.courses_audit= audit;
        this.courses_uuid = uuid;
    }
}
