import {Section} from "./Section";
import {FilterJSON, QueryJSON} from "./IJSON";
import {FILTERnode} from "./nodes/FILTERnode";
import {ResultSection} from "./ResultSection";
import {Database} from "./Database";
import {Room} from "./Room";
import {ResultRoom} from "./ResultRoom";

export class QueryEngine {

    parse(query: QueryJSON): JSON {

        // check fundamental syntax structure for WHERE and OPTIONS in the root
        let objKeys: Array<string> = Object.keys(query);

        if (!objKeys.includes('WHERE') || // doesn't include .WHERE
            !objKeys.includes('OPTIONS') || // doesn't include .OPTIONS
            !(objKeys.length === 2) // some other keys beyond .WHERE and .OPTIONS
        ) {
            // query does not contain WHERE and OPTIONS information
            throw new Error('SYNTAXERR - query fundamentally malformed: no WHERE/OPTIONS information')
        }

        // get the results that match the query based on FILTER
        let results: Array<Section> = this.getMatch(query.WHERE);

        // format the results based on OPTIONS
        let fResults: Array<ResultSection> = this.formatMatch(query.OPTIONS, results);

        // return the results in the form of an InsightResponse
        return QueryEngine.encapsulate(fResults);

    }

    /**
     * Parses the query by building an AST and evaluates with recursion
     * @param {FilterJSON} criteria is a JSON object that specifies the filters by which
     *  sections should be selected
     * @returns {Array<Section>} as an array of Section objects which pass all filter specifications
     */
    private getMatch(criteria: FilterJSON): Array<Section> {
        // build the filters AST rooted on a FILTERnode

        let db = new Database();
        if (db.countEntries() === 0){
            throw new Error('DATASETERR - missing dataset')
        }

        let root: FILTERnode;
        let result: Array<Section>;

        root = new FILTERnode(criteria);
        result = root.evaluate();

        return result;

    }

    /**
     * Format helper to extract relevant columns from course sections that passed filters
     * @param OPTIONS is JSON object from input that specifies columns and sort-order of results
     * @param {Array<Section>} results is output of getMatch helper
     * @returns {Array<ResultSection>} as an array of sections conforming to OPTIONS specifications
     */
    private formatMatch(OPTIONS: any, results: Array<Section>): Array<ResultSection> {
        // TODO this big ass method needs refactoring, pronto

        let optKeys: Array<string>;
        let colKeys: Array<string>;
        let fResults: Array<ResultSection|ResultRoom> = [];
        let sortOn: string;
        let hasStringOrder: boolean = false; // flag for if OPTIONS has alphabetical ORDER
        let hasNumberOrder: boolean = false; // flag for if OPTIONS has numerical ORDER

        // extract the keys out of OPTIONS (which should only only contain COLUMNS and ORDER)
        optKeys = Object.keys(OPTIONS);

        // syntax check for COLUMNS
        if (!optKeys.includes('COLUMNS')) {
            throw new Error('SYNTAXERR - no COLUMNS field found')
        }

        // extract the columns for result output
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
                case 'courses_year':
                case 'courses_section':
                case 'rooms_fullname':
                case 'rooms_shortname':
                case 'rooms_number':
                case 'rooms_name':
                case 'rooms_address':
                case 'rooms_lat':
                case 'rooms_lon':
                case 'rooms_seats':
                case 'rooms_type':
                case 'rooms_furniture':
                case 'rooms_href':
                    break;
                default:
                    throw new Error('key "' + key + '" does not exist')
            }
        }



        // create the results
        for (let section of results) {
            if (section instanceof Room) {
                let rRoom = new ResultRoom();

                for (let key of colKeys) {
                    // this is terrible, we know
                    rRoom[key] = section[key];
                }

                fResults.push(rRoom);


            } else if (section instanceof Section) {
                let rSec = new ResultSection();

                for (let key of colKeys) {
                    // this is terrible, we know
                    rSec[key] = section[key];
                }

                fResults.push(rSec);

            }
        }


        if(
            optKeys.length === 2 && // this is the only other key
            optKeys.includes('ORDER') // and the second key is ORDER

        ){
            sortOn = OPTIONS.ORDER;

            // check if sortOn is retained by COLUMNS
            if (!colKeys.includes(sortOn)) {
                // sorting on a column that is not printed
                throw new Error('SYNTAXERR - cannot order on a column that is not printed')
            }

            // determine what type of field is being sorted on
            switch (sortOn) {
                case 'courses_dept':
                case 'courses_id':
                case 'courses_title':
                case 'courses_instructor':
                case 'courses_uuid':
                case 'courses_section':
                    hasStringOrder = true;
                    break;

                case 'courses_avg':
                case 'courses_pass':
                case 'courses_fail':
                case 'courses_audit':
                case 'courses_year':
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

    /**
     * Encapsulation helper to convert array result into a JSON-formatted body for InsightResponse
     * @param {Array<ResultSection>} fResults are formatted results from formatMatch helper
     * @returns {string} as stringified JSON
     */
    private static encapsulate(fResults: Array<ResultSection> ): JSON {
        // turn fResults into the JSON return format
        let asJSON = "{\"result\":";
        let withCollection = asJSON.concat(JSON.stringify(fResults));
        let finalBracket = withCollection.concat("}");

        return JSON.parse(finalBracket);
    }
}