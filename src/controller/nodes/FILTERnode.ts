import {LOGICCnode} from "./LOGICCnode";
import {MCnode} from "./MCnode";
import {SCnode} from "./SCnode";
import {NEGnode} from "./NEGnode";
import {FilterJSON} from "../IJSON";
import {error, isNullOrUndefined, isUndefined} from "util";
import {ANode} from "./ANode";
import {Section} from "../Section";
import {Room} from "../Room";
import {Database} from "../Database";

export class FILTERnode extends ANode {
    criteria: LOGICCnode | MCnode | SCnode | NEGnode;

    constructor(filter: FilterJSON) {
        super();

        // get the type of filter out of the object
        let key = Object.keys(filter)[0];

        switch (key) {
            // switch on the filter type and construct it

            case 'OR':
            case 'AND':
                this.criteria = new LOGICCnode(filter[key], key);
                break;

            case 'LT':
            case 'GT':
            case 'EQ':
                this.criteria = new MCnode(filter[key], key);
                break;

            case 'IS':
                this.criteria = new SCnode(filter[key]);
                break;

            case 'NOT':
                this.criteria = new NEGnode(filter[key]);
                break;

            default:
                if (isNullOrUndefined(key)){
                    this.criteria = null;
                    break;
                }
                throw new Error('SYNTAXERR - some FILTER query is poorly formed');

        }
    }

    evaluate(): Array<Section|Room> {
        let result: Array<Section|Room>;
        if (!isNullOrUndefined(this.criteria)){
            result = this.criteria.evaluate();
        }else{
            let db = new Database();
            result = db.query(null);
        }

        return result

    }

}