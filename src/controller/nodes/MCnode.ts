import {ANode} from "./ANode";
import {MCompJSON} from "../IJSON";
import {Section} from "../Section";
import {error} from "util";

export class MCnode extends ANode {

    m_key: string;
    num: number;
    equality: string;

    constructor(mc: MCompJSON, lgc: string) {
        super();

        // get the type of inequality out
        this.equality = lgc;

        // get the m_key out of the object
        this.m_key = Object.keys(mc)[0];

        if (!this.m_key.match(
                /^(courses_avg|courses_pass|courses_fail|courses_audit)/
            )) {
            throw error('SYNTAXERR - some m_key is poorly formed')
        }

        this.num = mc[this.m_key]
    }

    evaluate(): Array<Section> {
        return undefined;
    }

}