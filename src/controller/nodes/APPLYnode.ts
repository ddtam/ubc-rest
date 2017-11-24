import {LOGICCnode} from "./LOGICCnode";
import {MCnode} from "./MCnode";
import {SCnode} from "./SCnode";
import {NEGnode} from "./NEGnode";
import {FilterJSON} from "../IJSON";
import {error} from "util";
import {ANode} from "./ANode";
import {Section} from "../Section";
import {Room} from "../Room";
import {APPLYKEYnode} from "./APPLYKEYnode";

export class APPLYnode {
    criteria: LOGICCnode | MCnode | SCnode | NEGnode;
    applyKeys: Array<APPLYKEYnode>;
    keyFields: Array<string> = [];

    constructor(criteria: any) {

        // initialize all the apply keys and store them in the array
        this.applyKeys = [];

        for (let c of criteria) {
            this.applyKeys.push(new APPLYKEYnode(c))
        }

    }

    evaluate(group: Array<Section|Room>): any {

        // need to sort out how to dynamically create new section/room object with the grouped fields AND the
        //  keyFields from above

        let tempObject: any = {};

        // run the apply
        for (let app of this.applyKeys) {
            let keyName: string = app.getKeyName();
            let keyValue: any = app.evaluate(group);

            tempObject.keyName = keyValue;
        }

        return tempObject;
    }

}