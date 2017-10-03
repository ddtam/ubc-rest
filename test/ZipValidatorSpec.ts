/**
 * Created by rtholmes on 2016-10-31.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';

describe("ZipValidatorSpec", function () {

    // NOTE: NOT ACTUALLY TESTING ANYTHING; just calls addDataset to log output
    it("Should iterate through every file in the zip", function () {
        let inFac = new InsightFacade();
        let content: string;

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            expect(obj.code).to.equal(204)
        });
    });


    it("Should give 400 response when given bad zip", function () {
        let inFac = new InsightFacade();
        let content: string;

        content = new Buffer(fs.readFileSync('coursesEncrypted.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).catch(function (obj) {
            expect(obj.code).to.equal(400)
        });

    })

});
