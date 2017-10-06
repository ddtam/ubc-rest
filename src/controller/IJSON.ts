/**
 * Interfaces for all JSON objects used by input zip and database files
 */

export interface CourseJSON {
    result: Array<SectionJSON>
}

export interface DatabaseJSON {
    contents: Array<SectionJSON>
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