
import {KeyJSON} from "../IJSON";
import {isNull} from "util";
import {Section} from "../Section";
import {Room} from "../Room";

export class APPLYKEYnode {
    keyName: string;
    token: string;
    onKey: KeyJSON;

    constructor(criteria: any) {

        // extract the relevant values
        this.keyName = Object.keys(criteria)[0];

        this.token = Object.keys(criteria[this.keyName])[0];

        this.onKey = criteria[this.keyName][this.token];

        if (isNull(this.keyName) ||
            isNull(this.token) ||
            isNull(this.onKey)
        ) {
            throw new Error('SYNTAXERR - APPLYKEY malformed: ' + criteria)
        }
    }

    getKeyName(): string {
        return this.keyName;
    }

    evaluate(group: Array<Section|Room>): Array<any> {

        return null;
    }
}