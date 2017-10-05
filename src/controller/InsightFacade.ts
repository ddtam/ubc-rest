/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import {ICourse} from "./ICourse";
import {Course} from "./Course";
let JSZip = require('jszip');

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let returnPromise: Promise<InsightResponse> = new Promise(function (fulfill, reject) {

            // 1. parse content with JSZip
            let zip = new JSZip();

            zip.loadAsync(content, {base64: true}).then(function (zipContents: JSZip) {
                zipContents.forEach(function (relativePath, file) {
                    // iterating in here: this is where the helper will be called
                    file.async('string').then(function (str) {
                        let parsedJSON = JSON.parse(str);

                        //console.log(parsedJSON.result);

                        for(var i: number = 0; i<2; i++){
                            let aCourse = new Course();
                            let result = parsedJSON.result[i];
                            let bigD = result.Subject;
                            let bigID = result.Course.toString();
                            let bigAvg = result.Avg;
                            let bigInst = result.Professor;
                            let bigT = result.Title;
                            let bigP = result.Pass;
                            let bigF = result.Fail;
                            let bigAud = result.Audit;
                            let bigU = result.id.toString();
                            aCourse.write(bigD, bigID, bigAvg, bigInst, bigT, bigP, bigF, bigAud, bigU);
                        }
                        // str here is the contents of each file; uncomment below to see (massive) log output
                        //Log.info(str);

                    }).catch(function (err) {
                        // currently unreachable; will be called when helper above rejects
                        Log.info('err from getting file content');
                        reject({
                            code: 400,
                            body: 'no valid JSON'
                        })

                    })
                });

                fulfill({
                    code: 204,
                    body: 'assume successfully parsed; remove when helper implemented'
                })

            }).catch(function (err: Error) {
                // assumed error on decoding base64
                Log.info('err from JSZip promise to decode .zip: ' + err.message);
                reject({
                    code: 400,
                    body: '.zip failed to decode into base64'
                })
            })
        });

        return returnPromise;
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: any): Promise<InsightResponse> {
        return null;
    }

}
