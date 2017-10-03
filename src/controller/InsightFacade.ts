/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import * as JSZip from "jszip";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let returnPromise: Promise<InsightResponse> = new Promise (function (fulfill, reject) {

            // 1. parse content with JSZip
            let zip = new JSZip();

            zip.loadAsync (content, {base64:true}).then(function (zipContents) {
                zipContents.forEach(function (relativePath, file) {
                    // iterating in here: this is where the helper will be called
                    Log.info('iterate over: ' + file.name)
                });

                fulfill({
                    code: 204,
                    body: 'assume successfully parsed; remove when helper implemented'
                })

            }).catch( function (err) {
                // assumed error on decoding base64
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

    performQuery(query: any): Promise <InsightResponse> {
        return null;
    }
}
