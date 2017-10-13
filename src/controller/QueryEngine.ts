import {InsightResponse} from "./IInsightFacade";
import {Section} from "./Section";
import {FilterJSON, QueryJSON} from "./IJSON";
import {FILTERnode} from "./nodes/FILTERnode";

export class QueryEngine {

    parse(query: QueryJSON): Promise<InsightResponse> {

        // check fundamental syntax structure for WHERE and OPTIONS in the root
        let objKeys: Array<string> = Object.keys(query);

        if (!objKeys.includes('WHERE') || // doesn't include .WHERE
            !objKeys.includes('OPTIONS') || // doesn't include .OPTIONS
            !(objKeys.length === 2) // some other keys beyond .WHERE and .OPTIONS
        ) {
            // query does not contain WHERE and OPTIONS information
            return new Promise(function (fulfill, reject) {
                reject({
                    code: 400,
                    body: {err: 'query fundamentally malformed: no WHERE/OPTIONS information'}
                })
            })
        }

        // get the results that match the query based on FILTER
        let results: Array<Section> = this.getMatch(query.WHERE);

        // format the results based on OPTIONS
        let fResults: Array<Section> = this.formatMatch(query.OPTIONS, results);

        // return the results in the form of an InsightResponse
        return QueryEngine.encapsulate(fResults);

    }

    private getMatch(criteria: FilterJSON): Array<Section> {
        // build the filters AST rooted on a FILTERnode

        let root: FILTERnode;
        let result: Array<Section>;

        try {
            root = new FILTERnode(criteria);
            result = root.evaluate();

        } catch (err) {
            // something went wrong in building or evaluating AST

            if (err.message.includes('SYNTAXERR')) {
                throw {
                    code: 400,
                    body: {err: err.message}
                }

            } else if (err.message.includes('DATASETERR')) {
                throw {
                    code: 424,
                    body: {err: err.message}
                }

            }

        }
        return result;

    }

    private formatMatch(OPTIONS: any, results: Array<Section>): Array<Section> {
        return results; // TODO actually implement this
    }

    private static encapsulate(fResults: Array<Section> ): Promise<InsightResponse> {
        // turn fResults into the JSON return format
        let asJSON = "{\"result\": ";
        let withCollection = asJSON.concat(JSON.stringify(fResults));
        let finalBracket = withCollection.concat("}");

        return ;
    }
}