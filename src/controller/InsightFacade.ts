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
        return new Promise(function (fulfill, reject) {

            let zip = new JSZip();

            // load serialized zip into JSZip object
            zip.loadAsync(content, {base64: true})
                .then(function (zipContents: JSZip) {

                    // process the zip
                    that.handleZip(zipContents)
                        .then(function () {

                            // Call to database to store whole database into file
                            let db = new Database();
                            db.writeDB();

                            // completely processed zip; return promise
                            fulfill({
                                code: 204,
                                body: '.zip successfully parsed'
                            })
                        })
                })

                .catch(function (err: Error) {
                    // error on decoding base64 representation of zip
                    Log.info('err from JSZip promise to decode .zip: ' + err.message);
                    reject({
                        code: 400,
                        body: '.zip failed to decode into base64'
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
        let counter: number = 0;

        let that = this;

        zipContents.forEach(function (relativePath, file) {
            if (!file.dir) { // process only files, NOT directories

                let p: Promise<null> = that.handleFile(file, counter);

                // add promise to iterable
                coursePromiseCollection.push(p);
                counter++;
            }
        });

        // wait for all promises for file processing to settle
        await Promise.all(coursePromiseCollection).then(function () {
            // complete contents of zip added to database
            Log.info('.zip completely processed!');
            Log.info('processed ' + counter + ' files');
            Log.info('database contains ' + db.countEntries().toString() + ' entries')

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

            file.async('string').then(function (fileContents: string) {
                // successfully got file as string
                let parsedJSON: CourseJSON = JSON.parse(fileContents);
                db.add(parsedJSON);

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
                Log.error('error reading file: ' + err);
                reject();

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
