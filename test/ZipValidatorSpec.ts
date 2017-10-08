/**
 * Created by dtam on 2017-10-03.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";
import * as path from "path";

describe("ZipValidatorSpec", function () {

    let db: Database = new Database;
    let inFac: InsightFacade;
    let content: string;

    beforeEach(function () {
        Log.warn('database is being reset...');
        db.reset();

        inFac = new InsightFacade();

        // clear databases that are cached
        Log.warn('deleting cached databases...');
        let directory: string = './dbFiles';
        let databaseList = fs.readdirSync(directory);

        for (const file of databaseList) {
            fs.unlinkSync(path.join(directory, file))
        }

    });

    it("Should iterate through the 3 files in the test zip", function (done) {
        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        });
    });

    it("Should iterate through ALL files in the zip", function (done) {
        // because my machine is slow or something ._.
        this.timeout(5000);

        content = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.deep.equal(204);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();

        });
    });

    it("Should give 400 response when given empty zip", function (done) {
        content = new Buffer(fs.readFileSync('coursesEmpty.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            Log.test('Return code: ' + obj.code + '; DID NOT RECOGNIZE EMPTY ZIP');
            expect.fail();
            done();

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.deep.equal(400);
            expect(err.body).to.deep.equal('zip is empty')

        }).then(done, done);

    });

    it("Should give 400 response when given zip with no valid JSON", function (done) {
        content = new Buffer(fs.readFileSync('coursesNoValidJSON.zip'))
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
        content = new Buffer(fs.readFileSync('coursesSomeValidJSON.zip'))
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
        content = new Buffer(fs.readFileSync('coursesCorrupted.zip'))
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
        content = new Buffer(fs.readFileSync('coursesEncrypted.zip'))
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

        content = new Buffer(fs.readFileSync('courses.zip'))
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
