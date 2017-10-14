import {InsightResponse} from "./IInsightFacade";
import {Section} from "./Section";
import {FilterJSON, OptionsJSON, QueryJSON} from "./IJSON";
import {FILTERnode} from "./nodes/FILTERnode";
import {ResultSection} from "./ResultSection";
import {OPTIONnode} from "./nodes/OPTIONnode";

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
        let fResults: Array<ResultSection> = this.formatMatch(query.OPTIONS, results);

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

    private formatMatch(OPTIONS: any, results: Array<Section>): Array<ResultSection> {
        let optKeys: Array<string>;
        let colKeys: Array<string>;
        let fResults: Array<ResultSection> = [];
        let sortOn: string;
        let hasStringOrder: boolean = false; // flag for if OPTIONS has alphabetical ORDER
        let hasNumberOrder: boolean = false; // flag for if OPTIONS has numerical ORDER

        optKeys = Object.keys(OPTIONS);

        // syntax check for COLUMNS
        if (!optKeys.includes('COLUMNS')) {
            throw {
                code: 400,
                body: {err: 'SYNTAXERR - no COLUMNS field found'}
            }
        }

        colKeys = OPTIONS.COLUMNS;

        // check syntax for KEYS in COLUMN
        for (let key of colKeys) {
            switch (key) {
                case 'courses_dept':
                case 'courses_id':
                case 'courses_title':
                case 'courses_instructor':
                case 'courses_avg':
                case 'courses_pass':
                case 'courses_fail':
                case 'courses_audit':
                case 'courses_uuid':
                    break;
                default:
                    throw {
                        code: 400,
                        body: {err: 'SYNTAXERR - some key in COLUMNS dne'}
                    }
            }
        }

        // create the results
        for (let section of results) {
            let rSec = new ResultSection();

            for (let key of colKeys) {
                // this is terrible, we know
                rSec[key] = section[key];

            }
            fResults.push(rSec);

        }


        if(optKeys.length === 2 && optKeys.includes('ORDER')){
            sortOn = OPTIONS.ORDER;

            switch (sortOn) {
                case 'courses_dept':
                case 'courses_id':
                case 'courses_title':
                case 'courses_instructor':
                case 'courses_uuid':
                    hasStringOrder = true;
                    break;

                case 'courses_avg':
                case 'courses_pass':
                case 'courses_fail':
                case 'courses_audit':
                    hasNumberOrder = true;
                    break;

            }
        }

        if (hasStringOrder) {
            // sort on a string
            fResults.sort(function(a, b) {
                var nameA = a[sortOn];
                var nameB = b[sortOn];
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });

        } else if(hasNumberOrder) {
            // sort on a number
            fResults.sort(function (a, b) {
                return Number(a[sortOn]) - Number(b[sortOn]);

            });

        }

        return fResults;
    }

    private static encapsulate(fResults: Array<ResultSection> ): Promise<InsightResponse> {
        // turn fResults into the JSON return format
        let asJSON = "{\"result\": ";
        let withCollection = asJSON.concat(JSON.stringify(fResults));
        let finalBracket = withCollection.concat("}");

        let output = new Promise(function (fulfill) {
            fulfill({
                code: 200,
                body: finalBracket
            })
        });

        return output;
    }
}