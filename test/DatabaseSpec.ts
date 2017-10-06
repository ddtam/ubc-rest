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

    let db: Database = new Database;
    let inFac: InsightFacade;
    let content: string;

    beforeEach(function () {;
       Log.warn('database is being reset...')
       db.reset();

        inFac = new InsightFacade();
    });

    it("should write 9 fields correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            // done
            Log.test('Return code: ' + obj.code);

            // query db for first section of first course
            var sCollection: Array<Section> = db.getUUID(32311);
            expect(sCollection.length === 1);
            expect(sCollection[0].dept).to.deep.equal("asia");
            expect(sCollection[0].id).to.deep.equal("254");
            expect(sCollection[0].title).to.deep.equal("jpn sex&gend flm");
            expect(sCollection[0].instructor).to.deep.equal("hall, nicholas");

            // query db for 12th section of second course
            var sCollection: Array<Section> = db.getUUID(74337);
            expect(sCollection.length === 1);
            expect(sCollection[0].dept).to.deep.equal("econ");
            expect(sCollection[0].id).to.deep.equal("311");
            expect(sCollection[0].title).to.deep.equal("macroeconomics");
            expect(sCollection[0].instructor).to.deep.equal("shrestha, ratna");
            expect(sCollection[0].fail).to.equal(11);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should return a singleton database", function (done) {
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

    it("Should query all courses in department correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getDept('econ');

            for (let s of results) {
                expect(s.dept === 'econ');
                // Log.info(s.uuid + ' is in ' + s.dept + ' department')
            }

            expect(results.length).to.equal(18);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query a professor correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getInstructor('hall, nicholas');

            for (let s of results) {
                expect(s.instructor === 'hall, nicholas');
                // Log.info(s.uuid + ' is in ' + s.dept + ' department')
            }

            expect(results.length).to.equal(1);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query a course number correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getID('254');

            for (let s of results) {
                expect(s.id === '254');
                // Log.info(s.uuid + ' is in ' + s.dept + ' department')
            }

            expect(results.length).to.equal(4);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query a course name correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getTitle('macroeconomics');

            for (let s of results) {
                expect(s.title === 'macroeconomics');
                // Log.info(s.uuid + ' is in ' + s.dept + ' department')
            }

            expect(results.length).to.equal(12);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query averages correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 74.3;
            let results: Array<Section> = db.getAvg(threshold, "gt");

            for (let s of results) {
                expect(s.avg > threshold);
                // Log.info(s.uuid + ' has average ' + s.avg)
            }

            expect(results.length).to.equal(6);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query number of passing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 230;
            let results: Array<Section> = db.getPass(threshold, "lt");

            for (let s of results) {
                expect(s.pass < threshold);
            }

            expect(results.length).to.equal(18);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query number of failing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 11;
            let results: Array<Section> = db.getFail(threshold, "eq");

            for (let s of results) {
                expect(s.fail === threshold);
            }

            expect(results.length).to.equal(4);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query number of auditing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 1;
            let results: Array<Section> = db.getAudit(threshold, "gt");

            for (let s of results) {
                expect(s.audit > threshold);
            }

            expect(results.length).to.equal(2);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should throw error with bad inequality parameter", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 1;
            let results: Array<Section> = db.getAudit(threshold, "bad");

            // if it gets here, did not throw error
            expect.fail();

        }).catch(function (err) {
            expect(err.toString()).to.deep.equal('Error: equality query expected "gt", "lt", or "eq"');
            done();
        }).then(done, done);
    });

});