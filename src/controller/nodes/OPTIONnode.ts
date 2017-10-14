import {MKEYnode} from "./MKEYnode";
import {SKEYnode} from "./SKEYnode";
import {COLUMNnode} from "./COLUMNnode";
import {ANode} from "./ANode";

export class OPTIONnode extends ANode {
    columns: COLUMNnode;
    order?: SKEYnode | MKEYnode;

    evaluate(): any {
        return undefined;
    }

}