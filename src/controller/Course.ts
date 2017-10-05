
import {ICourse} from "./ICourse";
import JSON = Mocha.reporters.JSON;

export class Course implements ICourse{

    dept: string;
    id: string;
    avg: number;
    instructor: string;
    title: string;
    pass: number;
    fail: number;
    audit: number;
    uuid: string;

    constructor(){
        this.dept = null;
        this.id = null;
        this.avg = null;
        this.instructor = null;
        this.title = null;
        this.pass = null;
        this.fail = null;
        this.audit = null;
        this.uuid = null;
    }

    write(dep:string, cid:string, av:number, instruct:string, tit:string, pas:number, fai:number, aud:number, uu:string){


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