/**
 * This contains handler functions for asynchronous addition of a file to the database
 */

import Log from "../Util";
import {Database} from "./Database";
import {CourseJSON} from "./IJSON";
import {InsightResponse} from "./IInsightFacade";

export default class InputHandler {

    containsValidJSON: boolean;

    /**
     * Helper iterates over Courses .zip file contents to add each containing file to Database
     * @param {JSZip} zipContents is .zip file represented as JSZip object
     * @returns {Promise<InsightResponse>} when all files are handled
     */
    async handleCourseZip(zipContents: JSZip) {

        // store all the promises in this array
        let coursePromiseCollection: Array<Promise<InsightResponse>> = [];
        let counter: number = 1;

        let that = this;

        // track existence of AT LEAST ONE valid JSON; assume false
        this.containsValidJSON = false;

        zipContents.forEach(function (relativePath, file) {
            if (!file.dir) { // process only files, NOT directories

                let p: Promise<InsightResponse> = that.buildFilePromise(file, counter);

                // add promise to iterable
                coursePromiseCollection.push(p);
                counter++;
            }
        });

        if (coursePromiseCollection.length === 0) {
            // there were no files processed
            throw new Error('zip is empty');
        }

        // wait for all promises for file processing to settle
        await this.ProcessAllFiles(coursePromiseCollection, counter);
    }

    /**
     * Helper to build individual promises that each process one file
     * @param {JSZipObject} file is the file that will be processed
     * @param {number} counter is the unique number of this file in the zip
     * @returns {Promise<any>} of file being added to the database
     */
    buildFilePromise(file: JSZipObject, counter: number): Promise<any> {
        let that = this;

        return new Promise(function (fulfill) {
            that.handleCourseFile(file, counter)
                .then(function () {
                    if (!that.containsValidJSON) {
                        that.containsValidJSON = true;
                    }
                    fulfill();

                })

                .catch(function (err) {
                    // SyntaxError OR JSON is valid but empty
                    // Log.error('file failed to be processed - ' + err.body.error);
                    fulfill();

                });
        });
    }

    /**
     * Helper that awaits the resolution of an array of promises
     * @param {Array<Promise<InsightResponse>>} coursePromiseCollection is the array of promises to-complete
     * @param {number} counter is the number of files in the array
     * @returns {Promise<any>}
     * @constructor
     */
    private ProcessAllFiles(coursePromiseCollection: Array<Promise<InsightResponse>>, counter: number): Promise<any> {
        let that = this;

        return Promise.all(coursePromiseCollection)
            .then(function () {
                InputHandler.LogDatabaseStateToConsole(counter);

                if (!that.containsValidJSON) {
                    // there were no valid JSON files in the zip
                    return Promise.reject({
                        code: 400,
                        body: {error: 'zip contained no valid JSON files'}
                    })
                }
            })

            .catch(function (err: InsightResponse) {
                // something went wrong...
                Log.info('failed to process all files in .zip');

                return Promise.reject(err);
            })
    }

    private static LogDatabaseStateToConsole(counter: number) {
        let db = new Database();

        // complete contents of zip added to database
        Log.info('=== DATABASE LOADED ===');
        Log.info('processed ' + (counter - 1) + ' files');
        Log.info('database contains ' + db.countEntries().toString() + ' entries');
    }

    /**
     * Helper handles addition of individual Course files within zip to Database
     * @param {JSZipObject} file is the file to be processed
     * @param {number} counter uniquely identifies sequence of this file within zip
     * @returns {Promise<any>} queuing entry of this file into Database
     */
    private handleCourseFile(file: JSZipObject, counter: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(function (fulfill, reject) {

            let db = new Database();
            let parsedJSON: CourseJSON;

            file.async('string').then(function (fileContents: string) {
                // successfully got file as string
                try {
                    parsedJSON = JSON.parse(fileContents);

                    if (parsedJSON.result.length === 0) {
                        // there is no real data
                        reject({
                            code: 400,
                            body: {error: 'contains no section data'}
                        })

                    } else {
                        db.add(parsedJSON);
                        fulfill({
                            code: 204,
                            body: {message: 'successfully added file ' + counter}
                        });

                    }

                } catch (err) {
                    Log.error('JSON in file ' + counter + ' is invalid - ' + err.toString());
                    reject({
                        code: 400,
                        body: {error: 'JSON in file ' + counter + ' is invalid - ' + err.toString()}
                    });

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

            }).catch(function (err: Error) {
                // file.async could not read file
                Log.error('async error reading file: ' + err);
                reject({
                    code: 400,
                    body: {error: 'file.async failing to read file ' + counter}
                })

            })
        });
    }


}