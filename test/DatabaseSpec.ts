/**
 * Created by sprecious on 2017-10-04.
 */

let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Criteria, Database} from "../src/controller/Database";
import {Section} from "../src/controller/Section";

describe("DatabaseSpec", function () {

    let db: Database = new Database;
    let inFac: InsightFacade;
    let content: string;

    beforeEach(function () {
       Log.warn('database is being reset...');
       db.reset();

       inFac = new InsightFacade();

        // clear databases that are cached
        Log.warn('deleting cached databases...');

        let databaseList = fs.readdirSync('./dbFiles');
        for (const file of databaseList) {
            fs.unlinkSync('./dbFiles/' + file)
        }
    });

    after(function () {
        // clear databases at end
        Log.warn('CLEAN UP: deleting cached databases...');

        let databaseList = fs.readdirSync('./dbFiles/');
        for (const file of databaseList) {
            fs.unlinkSync('./dbFiles/' + file)
        }
    });

    it("should write 9 fields correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            // done
            Log.test('Return code: ' + obj.code);

            // query db for first section of first course
            var sCollection: Array<Section> = db.getUUID("32311");
            expect(sCollection.length === 1);
            expect(sCollection[0].courses_dept).to.deep.equal("asia");
            expect(sCollection[0].courses_id).to.deep.equal("254");
            expect(sCollection[0].courses_title).to.deep.equal("jpn sex&gend flm");
            expect(sCollection[0].courses_instructor).to.deep.equal("hall, nicholas");

            // query db for 12th section of second course
            var sCollection: Array<Section> = db.getUUID("74337");
            expect(sCollection.length === 1);
            expect(sCollection[0].courses_dept).to.deep.equal("econ");
            expect(sCollection[0].courses_id).to.deep.equal("311");
            expect(sCollection[0].courses_title).to.deep.equal("macroeconomics");
            expect(sCollection[0].courses_instructor).to.deep.equal("shrestha, ratna");
            expect(sCollection[0].courses_fail).to.equal(11);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should return a singleton database", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
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

    it("Write to dbFiles should match sectionCollection", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        let fileID = 'courses';
        inFac.addDataset(fileID, content).then(function (obj) {

            Log.info('return code: ' + obj.code);

            let diskContent = new Buffer(fs.readFileSync('./dbFiles/' + fileID))
                .toString('utf8');

            expect(diskContent).to.deep.equal(db.pukeMemory(fileID));

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should query all courses in department correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getDept('econ');

            for (let s of results) {
                expect(s.courses_dept === 'econ');
                // Log.info(s.courses_uuid + ' is in ' + s.courses_dept + ' department')
            }

            expect(results.length).to.equal(18);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query a professor correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getInstructor('hall, nicholas');

            for (let s of results) {
                expect(s.courses_instructor === 'hall, nicholas');
                // Log.info(s.courses_uuid + ' is in ' + s.courses_dept + ' department')
            }

            expect(results.length).to.equal(1);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query a course number correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getID('254');

            for (let s of results) {
                expect(s.courses_id === '254');
                // Log.info(s.courses_uuid + ' is in ' + s.courses_dept + ' department')
            }

            expect(results.length).to.equal(4);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query a course name correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let results: Array<Section> = db.getTitle('macroeconomics');

            for (let s of results) {
                expect(s.courses_title === 'macroeconomics');
                // Log.info(s.courses_uuid + ' is in ' + s.courses_dept + ' department')
            }

            expect(results.length).to.equal(12);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query averages correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 74.3;
            let results: Array<Section> = db.getAvg(threshold, "GT");

            for (let s of results) {
                expect(s.courses_avg > threshold);
                // Log.info(s.courses_uuid + ' has average ' + s.courses_avg)
            }

            expect(results.length).to.equal(6);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query number of passing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 230;
            let results: Array<Section> = db.getPass(threshold, "LT");

            for (let s of results) {
                expect(s.courses_pass < threshold);
            }

            expect(results.length).to.equal(18);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query number of failing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 11;
            let results: Array<Section> = db.getFail(threshold, "EQ");

            for (let s of results) {
                expect(s.courses_fail === threshold);
            }

            expect(results.length).to.equal(4);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should query number of auditing students correctly", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 1;
            let results: Array<Section> = db.getAudit(threshold, "GT");

            for (let s of results) {
                expect(s.courses_audit > threshold);
            }

            expect(results.length).to.equal(2);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should throw error with bad inequality parameter", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            let threshold = 1;
            let results: Array<Section> = db.getAudit(threshold, "bad");

            // if it gets here, did not throw error
            expect.fail();
            done();

        }).catch(function (err) {
            expect(err.toString()).to.deep.equal('Error: equality query expected "GT", "LT", or "EQ"');

        }).then(done, done);
    });

    it("Should be able to handle complex query from entire dataset", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let qs: Array<Criteria> = [{
                property: 'courses_dept',
                value: 'cpsc',
            }, {
                property: 'courses_avg',
                value: 75,
                equality: 'LT'
            }];

            let results: Array<Section> = db.queries(qs);

            for (let s of results) {
                expect(s.courses_dept === 'cpsc');
                expect(s.courses_avg < 75);
            }

            expect(results.length).to.equal(468);

            expect(db.countEntries()).to.equal(64612);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should be able to handle a query for which no results exist", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let qs: Array<Criteria> = [{
                property: 'courses_avg',
                value: 0,
                equality: 'LT'
            }];

            let results: Array<Section> = db.queries(qs);

            expect(results.length).to.equal(0);

        }).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        }).then(done, done);
    });

    it("Should be err when given querying for a property that does not exist", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let qs: Array<Criteria> = [{
                property: 'DNE',
                value: 'cpsc',
            }];

            db.queries(qs);

            expect.fail();
            done();

        }).catch(function (err) {
            Log.test(err);
            expect(err.toString()).to.deep.equal("Error: query is poorly formed; property \"DNE\" does not exist");

        }).then(done, done);
    });

    it("Should be able to find a very, very specific section", function (done) {
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            // Log.info('return code: ' + obj.code);

            // build the query
            let qs: Array<Criteria> = [{
                property: 'courses_dept',
                value: 'phar',
            }, {
                property: 'courses_id',
                value: '460',
            }, {
                property: 'courses_title',
                value: 'nat hlth prodcts',
            }, {
                property: 'courses_instructor',
                value: 'cadario, barbara',
                equality: 'LT'
            }, {
                property: 'courses_avg',
                value: 82,
                equality: 'GT'
            }, {
                property: 'courses_pass',
                value: 148,
                equality: 'LT'
            }, {
                property: 'courses_fail',
                value: 1,
                equality: 'EQ'
            }, {
                property: 'courses_audit',
                value: 0,
                equality: 'EQ'
            }, {
                property: 'courses_uuid',
                value: 4754,
            }];

            let results: Array<Section> = db.queries(qs);

            for (let s of results) {
                expect(s.courses_dept === 'phar');
                expect(s.courses_id === '460');
                expect(s.courses_title === 'nat hlth prodcts');
                expect(s.courses_instructor === 'cadario, barbara');
                expect(s.courses_avg > 82);
                expect(s.courses_pass < 148);
                expect(s.courses_fail === 1);
                expect(s.courses_audit === 10000);
                expect(s.courses_uuid === '4754');
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