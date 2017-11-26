import {APPLYKEYnode} from "./APPLYKEYnode";
import {QueryEngine} from "../QueryEngine";

export class APPLYnode {
    applyKeyNodes: Array<APPLYKEYnode>;

    constructor(userDefinedCriteria: any) {

        // initialize all the apply keys and store them in the array
        this.applyKeyNodes = [];

        for (let c of userDefinedCriteria) {
            this.applyKeyNodes.push(new APPLYKEYnode(c))
        }
    }

    evaluate(group: any): any {
        let partialResult: any = {};

        // run the apply
        for (let applyKeyNode of this.applyKeyNodes) {
            // evaluate the partial result object with the user-defined key and its calculated value
            partialResult = applyKeyNode.evaluate(group);

            // complete the partial result with the keys that define this group
            for (let key of Object.keys(group)) {
                if (QueryEngine.isGoodKey(key)) {
                    partialResult[key] = group[key];
                }
            }
        }
        if (this.applyKeyNodes.length === 0){
            return group;
        }

        return partialResult;
    }

}