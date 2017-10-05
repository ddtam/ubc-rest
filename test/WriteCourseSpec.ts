/**
 * Created by rtholmes on 2016-10-31.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";

describe("WriteCourseSpec", function () {

    it("9 fields should be correct", function (done) {
        let inFac = new InsightFacade();
        let content: string;

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);
            done();

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });


    it("Should give 400 response when given bad zip", function (done) {
        let inFac = new InsightFacade();
        let content: string;

        content = new Buffer(fs.readFileSync('coursesEncrypted.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT FAIL');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);
            done();
        });

    })

});