/**
 * Created by sprecious on 2017-10-04.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Criteria, Database} from "../src/controller/Database";
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should return a singleton database", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {

            Log.info('return code: ' + obj.code);
            expect(db.countEntries()).to.equal(22);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
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

    it("Should be able to handle complex query from entire dataset", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let query: Array<Criteria> = [{
                property: 'dept',
                value: 'cpsc',
                equality: 'n/a'
            }, {
                property: 'avg',
                value: 75,
                equality: 'lt'
            }];

            let results: Array<Section> = db.query(query);

            for (let s of results) {
                expect(s.dept === 'cpsc');
                expect(s.avg < 75);
            }

            expect(results.length).to.equal(468);

            expect(db.countEntries()).to.equal(64612);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should be able to handle a query for which no results exist", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let query: Array<Criteria> = [{
                property: 'avg',
                value: 0,
                equality: 'lt'
            }];

            let results: Array<Section> = db.query(query);

            expect(results.length).to.equal(0);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should be err when given querying for a property that does not exist", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let query: Array<Criteria> = [{
                property: 'DNE',
                value: 'cpsc',
                equality: ''
            }];

            db.query(query);

            expect.fail();
            done();

        }).catch(function (err) {
            Log.test(err);
            expect(err.toString()).to.deep.equal("Error: query is poorly formed; property \"DNE\" does not exist");

        }).then(done, done);
    });

    it("Should be able to find a very, very specific section", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let query: Array<Criteria> = [{
                property: 'dept',
                value: 'phar',
                equality: ''
            }, {
                property: 'id',
                value: '460',
                equality: ''
            }, {
                property: 'title',
                value: 'nat hlth prodcts',
                equality: ''
            }, {
                property: 'instructor',
                value: 'cadario, barbara',
                equality: 'lt'
            }, {
                property: 'avg',
                value: 82,
                equality: 'gt'
            }, {
                property: 'pass',
                value: 148,
                equality: 'lt'
            }, {
                property: 'fail',
                value: 1,
                equality: 'eq'
            }, {
                property: 'audit',
                value: 0,
                equality: 'eq'
            }, {
                property: 'uuid',
                value: 4754,
                equality: ''
            }];

            let results: Array<Section> = db.query(query);

            for (let s of results) {
                expect(s.dept === 'phar');
                expect(s.id === '460');
                expect(s.title === 'nat hlth prodcts');
                expect(s.instructor === 'cadario, barbara');
                expect(s.avg > 82);
                expect(s.pass < 148);
                expect(s.fail === 1);
                expect(s.audit === 10000);
                expect(s.uuid === 4754);
            }

            expect(results.length).to.equal(1);

            // check that the database is restored
            expect(db.countEntries()).to.equal(64612)

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    })

});