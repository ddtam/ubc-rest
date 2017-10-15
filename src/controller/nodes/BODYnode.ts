import {FILTERnode} from "./FILTERnode";
import {OPTIONnode} from "./OPTIONnode";
import {ANode} from "./ANode";

export class BODYnode extends ANode {

    filter: FILTERnode;
    options: OPTIONnode;

    evaluate(): any {
        return undefined;
    }

}