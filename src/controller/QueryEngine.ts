import {Section} from "./Section";
import {FilterJSON, QueryJSON, TransformJSON} from "./IJSON";
import {FILTERnode} from "./nodes/FILTERnode";
import {ResultSection} from "./ResultSection";
import {Database} from "./Database";
import {Room} from "./Room";
import {ResultRoom} from "./ResultRoom";
import {APPLYnode} from "./nodes/APPLYnode";
import {isUndefined} from "util";

export class QueryEngine {

    parse(query: QueryJSON): JSON {

        // check fundamental syntax structure for WHERE and OPTIONS in the root
        let objKeys: Array<string> = Object.keys(query);

        this.checkQueryStructure(objKeys);

        // get the results that match the query based on FILTER
        let results: Array<Section|Room> = this.getMatch(query.WHERE);

        // transform the results based on TRANSFORMATIONS
        if (objKeys.includes('TRANSFORMATIONS')){
            results = this.transformMatch(query.TRANSFORMATIONS, results);
        }

        // format the results based on OPTIONS
        let fResults: Array<ResultSection|ResultRoom> = this.formatMatch(query.OPTIONS, results);

        // return the results in the form of an InsightResponse
        return QueryEngine.encapsulate(fResults);

    }

    private checkQueryStructure(objKeys: Array<string>) {
        if (objKeys.length === 3) {
            if (!objKeys.includes('TRANSFORMATIONS') || // doesn't include .TRANSFORMATIONS
                !objKeys.includes('WHERE') || // doesn't include .WHERE
                !objKeys.includes('OPTIONS') // doesn't include .OPTIONS
            ) {
                throw new Error('SYNTAXERR - query fundamentally malformed: one of ' + objKeys + ' is invalid')
            }

        } else if (objKeys.length === 2) {
            if (!objKeys.includes('WHERE') || // doesn't include .WHERE
                !objKeys.includes('OPTIONS') // doesn't include .OPTIONS
            ) {
                throw new Error('SYNTAXERR - query fundamentally malformed: one of ' + objKeys + ' is invalid')
            }

        } else {
            throw new Error('SYNTAXERR - query fundamentally malformed: one of ' + objKeys + ' is invalid')

        }
    }

    /**
     * Parses the query by building an AST and evaluates with recursion
     * @param {FilterJSON} criteria is a JSON object that specifies the filters by which
     *  sections should be selected
     * @returns {Array<Section>} as an array of Section objects which pass all filter specifications
     */
    private getMatch(criteria: FilterJSON): Array<Section|Room> {
        // build the filters AST rooted on a FILTERnode

        let db = new Database();
        if (db.countEntries() === 0){
            throw new Error('DATASETERR - missing dataset')
        }

        let root: FILTERnode;
        let result: Array<Section|Room>;

        root = new FILTERnode(criteria);
        result = root.evaluate();

        // reset the query-type
        db.resetQuery();

        return result;

    }

    /**
     *
     * @param {TransformJSON} transformation
     * @param {Array<Section | Room>} rawResults
     * @returns {Array<Section | Room>}
     */
    private transformMatch(transformation: TransformJSON, rawResults: Array<Section|Room>): Array<Section|Room> {
        let groups: Array<Array<any>> = [];
        let transformedGroups: Array<any> = [];

        // check syntax of transformation clause
        let groupCriteria: Array<string> = transformation.GROUP;
        let applyCriteria: any = transformation.APPLY;

        if (isUndefined(groupCriteria)) {
            throw new Error('SYNTAXERR - no GROUP defined in transformation')
        } else if (isUndefined(applyCriteria)) {
            throw new Error('SYNTAXERR - no APPLY defined in transformation')
        }

        if (rawResults.length === 0) {
            // there were no results; return
            return transformedGroups;
        }

        // evaluate groups and store them in an array
        groups = QueryEngine.createGroups(rawResults, groupCriteria);

        // "apply" to each group and store results
        let root: APPLYnode = new APPLYnode(applyCriteria);

        for (let g of groups) {
            transformedGroups.push(root.evaluate(g));

        }

        return transformedGroups;
    }

    /**
     * Format helper to extract relevant columns from course sections that passed filters
     * @param OPTIONS is JSON object from input that specifies columns and sort-order of results
     * @param {Array<Section>} results is output of getMatch helper
     * @returns {Array<ResultSection>} as an array of sections conforming to OPTIONS specifications
     */
    private formatMatch(OPTIONS: any, results: Array<any>): Array<ResultSection|ResultRoom> {
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
        this.checkColumnSyntax(colKeys, results);

        // create the results
        for (let x of results) {
            if (x instanceof Room) {
                let rRoom = new ResultRoom();

                for (let key of colKeys) {
                    // this is terrible, we know
                    rRoom[key] = x[key];
                }

                fResults.push(rRoom);


            } else if (x instanceof Section) {
                let rSec = new ResultSection();

                for (let key of colKeys) {
                    // this is terrible, we know
                    rSec[key] = x[key];
                }

                fResults.push(rSec);

            }
        }

        if (
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
            if (QueryEngine.isStringKey(sortOn)) {
                hasStringOrder = true;

            } else if (QueryEngine.isNumberKey(sortOn)) {
                hasNumberOrder = true;

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

        } else if (hasNumberOrder) {
            // sort on a number
            fResults.sort(function (a, b) {
                return Number(a[sortOn]) - Number(b[sortOn]);

            });

        }

        return fResults;
    }

    private checkColumnSyntax(colKeys: Array<string>, results: Array<any>) {
        // check syntax for KEYS in COLUMN

        let transformKeys: Array<string> = Object.keys(results[0]);

        for (let key of colKeys) {
            if (!QueryEngine.isGoodKey(key) && !transformKeys.includes(key)) {
                // is not a transform key; throw error
                throw new Error('SYNTAXERR - key "' + key + '" does not exist')
            }
        }
    }

    /**
     * Encapsulation helper to convert array result into a JSON-formatted body for InsightResponse
     * @param {Array<ResultSection>} fResults are formatted results from formatMatch helper
     * @returns {string} as stringified JSON
     */
    private static encapsulate(fResults: Array<ResultSection|ResultRoom> ): JSON {
        // turn fResults into the JSON return format
        let asJSON = "{\"result\":";
        let withCollection = asJSON.concat(JSON.stringify(fResults));
        let finalBracket = withCollection.concat("}");

        return JSON.parse(finalBracket);
    }

    /**
     * Creates groups based on groupCriteria
     * @param {Array<Section | Room>} ungroupedResults
     * @param {Array<string>} groupCriteria
     * @returns {Array<Array<any>>}
     */
    private static createGroups(ungroupedResults: Array<any>, groupCriteria: Array<string>): Array<Array<any>> {
        let groupedResults: Array<any> = [];

        // check syntax
        if (!isUndefined(ungroupedResults[0].courses_id)) {
            for (let c of groupCriteria) {
                if (!QueryEngine.isSectionKey(c)) {
                    throw new Error('SYNTAXERR - "' + c + '" is not a valid course key')
                }
            }

        } else if (!isUndefined(ungroupedResults[0].rooms_name)) {
            for (let c of groupCriteria) {
                if (!QueryEngine.isRoomKey(c)) {
                    throw new Error('SYNTAXERR - "' + c + '" is not a valid room key')
                }
            }
        }

        // perform grouping
        for (let u of ungroupedResults) {
            let matchedExistingGroup = false;

            // check if r matches a current group
            for (let r of groupedResults) {
                let isAMatch: boolean = true;

                for (let c of groupCriteria) {
                    if (!(u[c] === r[c])) {
                        isAMatch = false;
                    }
                }

                if (isAMatch) {
                    r.groupContents.push(u);
                    matchedExistingGroup = true;
                }
            }

            // r does not fall into a current group; make a new group
            if (!matchedExistingGroup) {
                let newGroup: any = {};

                for (let c of groupCriteria) {
                    newGroup[c] = u[c];
                }

                newGroup.groupContents = [u];

                groupedResults.push(newGroup);
            }
        }

        return groupedResults;
    }

    // checks if a key corresponds with established keys
    static isGoodKey(key: string): boolean {
        let keyIsGood: boolean;

        switch (key) {
            case 'courses_dept':
            case 'courses_id':
            case 'courses_title':
            case 'courses_instructor':
            case 'courses_uuid':
            case 'courses_section':
            case 'courses_avg':
            case 'courses_pass':
            case 'courses_fail':
            case 'courses_audit':
            case 'courses_year':
            case 'rooms_fullname':
            case 'rooms_shortname':
            case 'rooms_number':
            case 'rooms_name':
            case 'rooms_address':
            case 'rooms_type':
            case 'rooms_furniture':
            case 'rooms_href':
            case 'rooms_lat':
            case 'rooms_lon':
            case 'rooms_seats':
                keyIsGood = true;
                break;
            default:
                keyIsGood = false;
        }

        return keyIsGood;
    }

    // checks if a key is for a section
    static isSectionKey(key: string): boolean {
        let keyIsGood: boolean;

        switch (key) {
            case 'courses_dept':
            case 'courses_id':
            case 'courses_title':
            case 'courses_instructor':
            case 'courses_uuid':
            case 'courses_section':
            case 'courses_avg':
            case 'courses_pass':
            case 'courses_fail':
            case 'courses_audit':
            case 'courses_year':
                keyIsGood = true;
                break;
            default:
                keyIsGood = false;
        }

        return keyIsGood;
    }

    // checks if a key is for a room
    static isRoomKey(key: string): boolean {
        let keyIsGood: boolean;

        switch (key) {
            case 'rooms_fullname':
            case 'rooms_shortname':
            case 'rooms_number':
            case 'rooms_name':
            case 'rooms_address':
            case 'rooms_type':
            case 'rooms_furniture':
            case 'rooms_href':
            case 'rooms_lat':
            case 'rooms_lon':
            case 'rooms_seats':
                keyIsGood = true;
                break;
            default:
                keyIsGood = false;
        }

        return keyIsGood;
    }

    // checks if a key encodes a string
    static isStringKey(key: string): boolean {
        let keyIsGood: boolean;

        switch (key) {
            case 'courses_dept':
            case 'courses_id':
            case 'courses_title':
            case 'courses_instructor':
            case 'courses_uuid':
            case 'courses_section':
            case 'rooms_fullname':
            case 'rooms_shortname':
            case 'rooms_number':
            case 'rooms_name':
            case 'rooms_address':
            case 'rooms_type':
            case 'rooms_furniture':
            case 'rooms_href':
                keyIsGood = true;
                break;
            default:
                keyIsGood = false;
        }

        return keyIsGood;
    }

    // checks if a key encodes a number
    static isNumberKey(key: string): boolean {
        let keyIsGood: boolean;

        switch (key) {
            case 'courses_avg':
            case 'courses_pass':
            case 'courses_fail':
            case 'courses_audit':
            case 'courses_year':
            case 'rooms_lat':
            case 'rooms_lon':
            case 'rooms_seats':
                keyIsGood = true;
                break;
            default:
                keyIsGood = false;
        }

        return keyIsGood;
    }
}