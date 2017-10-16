/**
 * Created by dtam on 2017-10-03.
 */

let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";

describe("AddDatasetSpec", function () {

    let db: Database = new Database;
    let inFac: InsightFacade;
    let content: string;

    beforeEach(function () {
        Log.warn('database is being reset...');
        db.reset();

        inFac = new InsightFacade();

        // clear databases that are cached
        Log.warn('deleting cached databases...');

        let databaseList = fs.readdirSync('./dbFiles/');
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

    it("Should iterate through the 3 files in the test zip", function (done) {
        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);
            expect(db.countEntries()).to.equal(22)

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        });
    });

    it("Should iterate through ALL files in the zip", function (done) {
        // because my machine is slow or something ._.
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);
            expect(db.countEntries()).to.equal(64612);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        });
    });

    it("Should give 400 response when given empty zip", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesEmpty.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT RECOGNIZE EMPTY ZIP');
            expect.fail();
            done();

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.deep.equal(400);
            expect(err.body.error).to.deep.equal('zip is empty')

        }).then(done, done);

    });

    it("Should give 400 response when given zip with no valid JSON", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesNoValidJSON.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT RECOGNIZE ZIP W/ NO VALID JSON');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);

        }).then(done, done);

    });

    it("Should process valid JSONs when only some JSON in zip are invalid", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesSomeValidJSON.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);
            expect(db.countEntries()).to.equal(182); // TODO: put the real # here

        }).then(done, done).catch(function (obj) {
            Log.test('Return code: ' + obj.code + '; FAILED TO DROP INVALID JSONs ONLY');
            expect.fail();
            done();

        });

    });

    it("Should give 400 response when given corrupted zip", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesCorrupted.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT FAIL');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);

        }).then(done, done);

    });

    it("Should give 400 response when given encrypted zip", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesEncrypted.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT FAIL');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);

        }).then(done, done);

    });

    it("Should give 400 response when given something that is not a zip", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesNotZip.rar'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT FAIL');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);

        }).then(done, done);

    });

    it("Should give 400 response when given JSON with no real section data", function (done) {
        content = new Buffer(fs.readFileSync('./zips/coursesNoRealData.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT FAIL');
            expect.fail();
            done();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(400);

        }).then(done, done);

    });

    it("Should give 201 response when adding a database with the same ID", function (done) {
        this.timeout(10000);

        content = new Buffer(fs.readFileSync('./zips/courses_3test.zip'))
            .toString('base64');

        // add first time
        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(204);
            addAgain();

        }).catch(function () {
            Log.test('should not err here, basic addDataset is failing');
            done();

        });

        function addAgain() {
            // add second time
            inFac.addDataset('courses', content).then(function (obj) {
                Log.test('Return code: ' + obj.code);
                expect(obj.code).to.equal(201);

            }).then(done, done).catch(function (obj) {
                Log.test('Return code: ' + obj.code + '; IS NOT DETECTING SAME DB ADDED TWICE');
                expect.fail();
                done();

            })
        }


    });

});
