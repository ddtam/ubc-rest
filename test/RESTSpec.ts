/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
import Service from "../src/rest/Service";
import * as fs from "fs";
import {Database} from "../src/controller/Database";

describe("RESTSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        // Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        // Log.test('BeforeTest: ' + (<any>this).currentTest.title);

        let db = new Database;
        db.reset("all");

        let databaseList = fs.readdirSync('./dbFiles');
        for (const file of databaseList) {
            fs.unlinkSync('./dbFiles/' + file)
        }
    });

    after(function () {
        // Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        // Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to add a small dataset", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return server.stop()

        }).catch(function (err) {
            Log.trace('catch:');
            expect.fail();

        });
    });

    it("Should return 201 if dataset has already been added", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            Log.trace('catch:');
            expect.fail();

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(201);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return server.stop()

        }).catch(function (err) {
            Log.trace('catch:');
            expect.fail();

        });
    });

    it("Should be able to delete a small dataset", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            Log.trace('catch:');
            Log.info('failed to add a dataset');
            expect.fail();

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return chai.request(URL)
                .del('/dataset/courses')

        }).catch(function (err) {
            Log.trace('catch:');
            Log.info('failed to delete a dataset');
            Log.info(err.code + ": " + err.body.error);
            expect.fail();

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(0);

            return server.stop()
        })
    });

    it("Should be able to perform a query on a small dataset", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        let queryJSONObject = JSON.parse(fs.readFileSync("test/testQueries/simpleQuerySortUUID")
                .toString("utf8"));

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            Log.trace('catch:');
            Log.info('failed to add a dataset');
            expect.fail();

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return chai.request(URL)
                .post('/query')
                .send(queryJSONObject)

        }).catch(function (err) {
            Log.trace('catch:');
            Log.info('failed to perform query');
            expect.fail();

        }).then(function (res: Response) {
            Log.trace('then:');
            let db = new Database();

            Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(200);

            return server.stop()
        })
    });






    it("Should give error when bad request goes out for put", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        let queryJSONObject = JSON.parse(fs.readFileSync("test/testQueries/simpleQuerySortUUID")
            .toString("utf8"));

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/ourses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            Log.trace('catch: ' + err.toString());
            //Log.info('failed to add a dataset');
            expect(err.toString() === "Error: Bad Request");

        }).then(function (res: Response) {
            expect.fail;

        }).catch(function (err) {
            //Log.trace('catch:');
            //Log.info('failed to perform query');
            expect(err.toString() === "Error: Bad Request");

        })
    });

    it("Should fail when trying to delete a file that doesn't exist", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            Log.trace('catch:');
            //Log.info('failed to add a dataset');
            expect.fail();

        }).then(function (res: Response) {
            //Log.trace('then:');
            let db = new Database();

            //Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            //Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return chai.request(URL)
                .del('/dataset/rses')

        }).catch(function (err) {
            //Log.trace('catch:');
            //Log.info('failed to delete a dataset');
            Log.info(err.toString());
            expect(err.toString() === "Error: Not Found");

        })
    });

    it("Should fail when trying to use post with nonexistent thing", function () {
        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        let queryJSONObject = JSON.parse(fs.readFileSync("test/testQueries/simpleQuerySortUUID")
            .toString("utf8"));

        return server.start().then(function (success: Boolean) {
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("zips/courses_3test.zip"),
                    "courses_3test.zip")

        }).catch(function (err) {
            //Log.trace('catch:');
            //Log.info('failed to add a dataset');
            expect.fail();

        }).then(function (res: Response) {
            //Log.trace('then:');
            let db = new Database();

            //Log.info('Response Code: ' + res.status);
            expect(res.status).to.be.equal(204);

            //Log.info('Database count: ' + db.countEntries());
            expect(db.countEntries()).to.equal(22);

            return chai.request(URL)
                .post('/query')
                .send('')

        }).catch(function (err) {
            //Log.trace('catch:');
            Log.info('failed to perform query' + err.toString());
            expect(err.toString() === "Error: Not Found");

        })
    });

});
