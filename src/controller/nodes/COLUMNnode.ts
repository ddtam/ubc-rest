import {MKEYnode} from "./MKEYnode";
import {SKEYnode} from "./SKEYnode";
import {ANode} from "./ANode";

export class COLUMNnode extends ANode {
    columns: SKEYnode | MKEYnode;

    evaluate(): any {
        return undefined;
    }

}