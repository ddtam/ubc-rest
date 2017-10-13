import {LOGICCnode} from "./LOGICCnode";
import {MCnode} from "./MCnode";
import {SCnode} from "./SCnode";
import {NEGnode} from "./NEGnode";
import {FilterJSON} from "../IJSON";
import {error} from "util";
import {ANode} from "./ANode";
import {Section} from "../Section";

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
                throw error('SYNTAXERR - some FILTER query is poorly formed');

        }
    }

    evaluate(): Array<Section> {
        let result: Array<Section> = this.criteria.evaluate();

        return result

    }

}