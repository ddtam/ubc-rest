/**
 * Created by dtam on 2017-10-09.
 */

let fs = require('fs');
import {Database} from "../src/controller/Database";
import {expect} from 'chai';
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";


describe("RemoveDatasetSpec", function () {
    let db: Database = new Database;
    let inFac: InsightFacade;

    beforeEach(function() {
        Log.warn('database is being reset...');
        db.reset();

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

    it("Should give 404 response if attempting to delete a non-existent database", function (done) {
        inFac = new InsightFacade;

        inFac.removeDataset('dneDB').then(function (obj: InsightResponse) {
            Log.warn('did not fail when deleting non-existent dataset - ' + obj.body);
            expect.fail();
            done();

        }).catch(function (err) {
            Log.info('Return code: ' + err.code);
            expect(err.code).to.equal(404);
            expect(err.body.error).to.include('resource does not exist');

        }).then(done, done);

    });

    it("Should give 204 response if attempting to delete a previously cached database", function (done) {
        // populate database...
        inFac = new InsightFacade();
        let content: string = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            Log.info('successfully populated test database');

            // ...then delete it
            inFac.removeDataset('courses').then(function (obj: InsightResponse) {
                Log.info('successfully deleted test database');

                Log.info('Return code: ' + obj.code);
                expect(obj.code).to.equal(204);
                expect(obj.body).to.include('deleted');

                // confirm database is empty
                expect(db.pukeMemory()).to.deep.equal('{"content": []}');

            }).then(done, done).catch(function (err: InsightResponse) {
                Log.warn('failed to delete a cached database - ' + err.body);
                expect.fail();
                done();

            })

        }).catch(function (err) {
            Log.warn('failed to add dataset; something else is wrong... - ' + err.toString());
            expect.fail();
            done();
        })

    });

    it("Should give 204 response if attempting to delete the previously cached FULL database", function (done) {
        this.timeout(5000);

        // populate database...
        inFac = new InsightFacade();
        let content: string = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            Log.info('successfully populated test database');

            // ...then delete it
            inFac.removeDataset('courses').then(function (obj: InsightResponse) {
                Log.info('successfully deleted test database');

                Log.info('Return code: ' + obj.code);
                expect(obj.code).to.equal(204);
                expect(obj.body).to.include('deleted');

                // confirm database is empty
                expect(db.pukeMemory()).to.deep.equal('{"content": []}');

            }).then(done, done).catch(function (err: InsightResponse) {
                Log.warn('failed to delete a cached database - ' + err.body);
                expect.fail();
                done();

            })

        }).catch(function (err) {
            Log.warn('failed to add dataset; something else is wrong... - ' + err.toString());
            expect.fail();
            done();
        })

    });

    it("Should retain memory if database to be deleted is not the one loaded", function (done) {

        inFac = new InsightFacade();
        let first: string = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        let second: string = new Buffer(fs.readFileSync('coursesSomeValidJSON.zip'))
            .toString('base64');

        // add the first database...
        inFac.addDataset('first', first).then(function () {
            Log.info('successfully added first database');

            // ...then the second...
            inFac.addDataset('second', second).then(function () {
                Log.info('successfully added second database');

                // ...then delete the first one
                inFac.removeDataset('first').then(function (obj: InsightResponse) {
                    Log.info('successfully deleted test database');

                    Log.info('Return code: ' + obj.code);
                    expect(obj.code).to.equal(204);
                    expect(obj.body).to.include('deleted');

                    // confirm database is empty
                    expect(db.pukeMemory()).to.deep.equal('{"content": []}');

                }).then(done, done).catch(function (err: InsightResponse) {
                    Log.warn('failed to delete a cached database - ' + err.body);
                    expect.fail();
                    done();

                })

            }).catch(function (err) {
                Log.warn('failed to add dataset; something else is wrong... - ' + err.toString());
                expect.fail();
                done();

            })

        }).catch(function (err) {
            Log.warn('failed to add dataset; something else is wrong... - ' + err.toString());
            expect.fail();
            done();

        })

    });

});