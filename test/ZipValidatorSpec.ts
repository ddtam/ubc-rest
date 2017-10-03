/**
 * Created by rtholmes on 2016-10-31.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";

describe("ZipValidatorSpec", function () {

    // NOTE: NOT ACTUALLY TESTING ANYTHING; just calls addDataset to log output
    it("Should iterate through every file in the zip", function () {
        let inFac = new InsightFacade();
        let content: string;

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content);
    });

});
