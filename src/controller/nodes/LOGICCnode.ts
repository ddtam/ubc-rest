import {FILTERnode} from "./FILTERnode";
import {ANode} from "./ANode";
import {FilterJSON} from "../IJSON";
import {Section} from "../Section";
import ArrayUtil from "../../ArrayUtil";

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
        let accumulatingResult: Array<Section> = [];
        let first: boolean = true; // flag to indicate if this is the first query

        if (this.logic === 'AND') {
            // looking for AND result from the filters
            for (let f of this.filters) {
                let iteratingResult: Array<Section> = f.evaluate();

                if (first) { // then just set accumulating result to these first results
                    accumulatingResult = iteratingResult;
                    first = false;

                } else { // perform the intersection
                    accumulatingResult = ArrayUtil.intersection(accumulatingResult, iteratingResult);

                }
            }

        }

        if (this.logic === 'OR') {
            // looking for OR result from the filters
            for (let f of this.filters) {
                let iteratingResult: Array<Section> = f.evaluate();

                if (first) { // then just set accumulating result to these first results
                    accumulatingResult = iteratingResult;
                    first = false;

                } else { // perform the union
                    accumulatingResult = ArrayUtil.union(accumulatingResult, iteratingResult);

                }
            }

        }

        return accumulatingResult;

    }

}