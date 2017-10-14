import {ANode} from "./ANode";
import {SCompJSON} from "../IJSON";
import {Section} from "../Section";
import {error} from "util";
import {Database} from "../Database";

export class SCnode extends ANode {

    s_key: string;
    inputstring: string;

    constructor(sc: SCompJSON) {
        super();

        // get the s_key out of the object and check syntax
        this.s_key = Object.keys(sc)[0];

        if (!this.s_key.match(
            /^(courses_id|courses_dept|courses_instructor|courses_title|courses_uuid)/
            )) {
            throw new Error('SYNTAXERR - some s_key is poorly formed')
        }

        this.inputstring = sc[this.s_key]
        // TODO? do we need to check if this is a string? or just cast as one

    }

    evaluate(): Array<Section> {
        let db = new Database();

        let accumulatingResult: Array<Section> = db.query([{
            property: this.s_key,
            value: this.inputstring, // TODO: need to handle regex
        }]);

        return accumulatingResult;
    }

}