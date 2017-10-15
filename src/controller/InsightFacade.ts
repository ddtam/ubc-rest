/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import {Database} from "./Database";
import InputHandler from "./InputHandler";
import {stringify} from "querystring";
import {QueryEngine} from "./QueryEngine";
import {QueryJSON} from "./IJSON";
let JSZip = require('jszip');
let fs = require('fs');

export default class InsightFacade implements IInsightFacade {

    constructor() {
        // Log.trace('InsightFacadeImpl::init()');

        // check if dbFiles directory exists; if not create
        try {
            fs.mkdirSync('./dbFiles');

        } catch (err) {
            if ( err.code !== 'EEXIST') {
                // some error other than "file exists" was thrown;
                throw err;
            }

        }
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        // get current list of databases
        let db = new Database();
        let dbList: Array<string> = db.listDB();

        db.reset(); // blank loaded database before adding new entries

        return new Promise(function (fulfill, reject) {

            let zip = new JSZip();

            // load serialized zip into JSZip object
            zip.loadAsync(content, {base64: true})
                .then(function (zipContents: JSZip) {

                    // process the zip
                    InputHandler.prototype.handleZip(zipContents)
                        .then(function () {

                            // completely processed zip; save database and fulfill promise
                            if (dbList.includes(id)) {
                                // this database has been loaded before
                                db.saveDB(id, false);

                                fulfill({
                                    code: 201,
                                    body: {message: 'dataset successfully added; id already exists'}
                                })

                            } else {
                                // is a new database id
                                db.saveDB(id, true);

                                fulfill({
                                    code: 204,
                                    body: {message: 'dataset successfully added'}
                                })
                            }
                        })

                        .catch(function (err: InsightResponse) {
                        // there was an error processing zip contents
                        Log.error('zip content error');
                        reject(err);
                    })
                })

                .catch(function (err: Error) {
                    // else error on decoding base64 representation of zip
                    Log.error('JSZip err - ' + err.message);
                    reject({
                        code: 400,
                        body: {error: err.message}
                    })
                })

        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        // check if database contains this id
        let db = new Database();

        return new Promise(function (fulfill, reject) {
            if (!db.hasDB(id)) {
                // this database was not previously cached or loaded
                reject({
                    code: 404,
                    body: {error: 'resource does not exist; database "' + id + '" was never cached'}
                })
            } else {
                db.deleteDB(id);
                fulfill({
                    code: 204,
                    body: {message: 'database ' + id + ' deleted'}
                })
            }
        })
    }

    performQuery(query: any): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            try {
                // execute the query and get back stringified array of matching Sections
                let p: JSON = QueryEngine.prototype.parse(query);

                fulfill({
                    code: 200,
                    body: p
                })

            } catch (err) {
                // something went wrong in building or evaluating AST

                if (err.message.includes('SYNTAXERR')) {
                    reject({
                        code: 400,
                        body: {error: err.message}
                    })

                } else if (err.message.includes('DATASETERR')) {
                    reject({
                        code: 424,
                        body: {error: err.message}
                    })

                } else {
                    reject({
                        code: 400,
                        body: {error: 'something is wrong... - ' + err.message}
                    })
                }

            }
        })
    }


}
