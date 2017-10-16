import {ANode} from "./ANode";
import {SCompJSON} from "../IJSON";
import {Section} from "../Section";
import {isString} from "util";
import {Database} from "../Database";

export class SCnode extends ANode {

    s_key: string;
    inputstring: string = '';

    constructor(sc: SCompJSON) {
        super();

        // get the s_key out of the object and check syntax
        this.s_key = Object.keys(sc)[0];

        if (!this.s_key.match(
            /^(courses_id|courses_dept|courses_instructor|courses_title|courses_uuid)/
            )) {
            throw new Error('SYNTAXERR - some s_key is poorly formed')
        }

        let placeHolder: any = sc[this.s_key];

        // check syntax of to-be regex
        let regexOk: boolean = false; // flag default to false

        if (placeHolder === '') {
            // accept empty string
            regexOk = true;

        } else if (
            isString(placeHolder) &&
                // input is a string
            RegExp('[^*]+').test(placeHolder)
                // AND input string is one or more of any character except asterisk
        ) {
            regexOk = true;
        }

        if (regexOk) {
            // process inputstring into a RegEx-ready string
            this.inputstring = this.inputstring.concat('^');
            placeHolder = placeHolder.replace(new RegExp('\\*', 'g'), '.*');
            this.inputstring = this.inputstring.concat(placeHolder).concat('$');

        } else {
            // throw error because RegEx is bad
            throw new Error('SYNTAXERR - search string "' + placeHolder + '" is invalid')

        }
    }


    evaluate(): Array<Section> {
        let db = new Database();

        let accumulatingResult: Array<Section> = db.query({
            property: this.s_key,
            value: this.inputstring
        });

        return accumulatingResult;
    }

}