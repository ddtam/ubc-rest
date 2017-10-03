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
        // 1. parse content with JSZip
        let zip = new JSZip();
        zip.loadAsync(content, {base64:true}).then(function (zipContents) {
            Log.info(zipContents.files.toString());
            Object.keys(zipContents.files).forEach(function (key) {
                Log.info(key.toString());
            });
        });

        return null;
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: any): Promise <InsightResponse> {
        return null;
    }
}
