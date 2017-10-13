import {FILTERnode} from "./FILTERnode";
import {ANode} from "./ANode";
import {FilterJSON} from "../IJSON";
import {Section} from "../Section";

export class LOGICCnode extends ANode {

    filters: Array<FILTERnode>;
    logic: string;

    constructor(filterOn: Array<FilterJSON>, lgc: string) {
        super();

        // get the type of logic (AND or OR) out
        this.logic = lgc;

        // initialize all the filters and keep them in the array
        this.filters = [];

        for (let o of filterOn) {
            this.filters.push(new FILTERnode(o))
        }
    }

    evaluate(): Array<Section> {
        return undefined;
    }

}