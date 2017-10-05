/**
 * Created by sprecious on 2017-10-04.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";
import {Section} from "../src/controller/Section";

describe("DatabaseSpec", function () {

    beforeEach(function () {
       Log.warn('database is being reset...')
       let db = new Database();
       db.reset();
    });

    it("should write 9 fields correctly", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            // done
            Log.test('Return code: ' + obj.code);

            // query db for first section of first course
            var s: Section = db.getUUID(32311);
            expect(s.dept).to.deep.equal("asia");
            expect(s.id).to.deep.equal("254");
            expect(s.title).to.deep.equal("jpn sex&gend flm");
            expect(s.instructor).to.deep.equal("hall, nicholas");

            // query db for 12th section of second course
            var s: Section = db.getUUID(74337);
            expect(s.dept).to.deep.equal("econ");
            expect(s.id).to.deep.equal("311");
            expect(s.title).to.deep.equal("macroeconomics");
            expect(s.instructor).to.deep.equal("shrestha, ratna");
            expect(s.fail).to.equal(11);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should return a singleton database", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {

                Log.info('return code: ' + obj.code);
                expect(db.countEntries()).to.equal(22);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

});