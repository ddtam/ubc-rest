/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import {Database} from "./Database";
import {CourseJSON} from "./IJSON";
let JSZip = require('jszip');

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;

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
                    that.handleZip(zipContents)
                        .then(function () {
                            // call to database to store whole database into file
                            db.saveDB(id);

                            // completely processed zip; fulfill promise
                            if (dbList.includes(id)) {
                                // this database has been loaded before
                                fulfill({
                                    code: 201,
                                    body: 'dataset successfully added; id already exists'
                                })
                            } else {
                                // is a new database id
                                fulfill({
                                    code: 204,
                                    body: 'dataset successfully added'
                                })
                            }
                        })

                        .catch(function (err: InsightResponse) {
                        // there was an error processing zip contents
                        Log.error('zip content error - ' + err.body);
                        reject({
                            code: 400,
                            body: err.body
                        });
                    })
                })

                .catch(function (err: Error) {
                    // else error on decoding base64 representation of zip
                    Log.error('JSZip err - ' + err.message);
                    reject({
                        code: 400,
                        body: err.message
                    })
                })

        });
    }

    /**
     * Helper iterates over .zip file contents to add each containing file to Database
     * @param {JSZip} zipContents is .zip file represented as JSZip object
     * @returns {Promise<void>} when all files are handled
     */
    private async handleZip(zipContents: JSZip) {
        // load up Database singleton
        let db = new Database;

        // store all the promises in this array
        let coursePromiseCollection: Array<Promise<null>> = [];
        let counter: number = 1;

        // track existence of AT LEAST ONE valid JSON; assume true
        let containsValidJSON: boolean = false;

        let that = this;

        zipContents.forEach(function (relativePath, file) {
            if (!file.dir) { // process only files, NOT directories
                let p: Promise<null> = that.handleFile(file, counter)
                    .then(function () {
                        if (!containsValidJSON) {
                            containsValidJSON = true;
                        }
                    })

                    .catch(function (err: Error) {
                        if (!err.name.includes('SyntaxError')) {
                            // was not syntax error (bad JSON); pass upwards
                            throw err
                        } // else, catch and continue...

                    });

                // add promise to iterable
                coursePromiseCollection.push(p);
                counter++;
            }
        });

        if (coursePromiseCollection.length === 0) {
            // there were no files processed
            return Promise.reject({
                code: 400,
                body: 'zip is empty'
            })
        }

        // wait for all promises for file processing to settle
        await Promise.all(coursePromiseCollection).then(function () {
            // complete contents of zip added to database
            Log.info('.zip completely processed!');
            Log.info('processed ' + (counter - 1) + ' files');
            Log.info('database contains ' + db.countEntries().toString() + ' entries');

            if (!containsValidJSON) {
                // there were no valid JSON files in the zip
                return Promise.reject({
                    code: 400,
                    body: 'zip contained no valid JSON files'
                })
            }

        }).catch(function (err) {
            // something went wrong...
            Log.info('failed to process all files in .zip');
            throw err;
        })
    }

    /**
     * Helper handles addition of individual files within zip to Database
     * @param {JSZipObject} file is the file to be processed
     * @param {number} counter uniquely identifies sequence of this file within zip
     * @returns {Promise<any>} queuing entry of this file into Database
     */
    private handleFile(file: JSZipObject, counter: number): Promise<null> {
        return new Promise(function (fulfill, reject) {

            let db = new Database();
            let parsedJSON: CourseJSON;

            file.async('string').then(function (fileContents: string) {
                // successfully got file as string
                try {
                    parsedJSON = JSON.parse(fileContents);
                    db.add(parsedJSON);

                } catch (err) {
                    Log.error('JSON in file ' + counter + ' is invalid: ' + err.toString());
                    throw err;

                }

                // successfully added a complete course to database
                // UNCOMMENT BELOW for very verbose logging of each file

                // if (parsedJSON.result.length > 0) {
                //     Log.info('file ' + counter +
                //         ' successfully added ' +
                //         parsedJSON.result[0].Subject + " " +
                //         parsedJSON.result[0].Course
                //     );
                //
                // } else {
                //     Log.info('file ' + counter +
                //         ' is a course without no recorded sections'
                //     )
                // }

                fulfill();

            }).catch(function (err) {
                // file.async could not read file
                // Log.error('error reading file: ' + err);
                reject(err);

            })
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: any): Promise<InsightResponse> {
        return null;
    }


}
