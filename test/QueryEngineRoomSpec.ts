import {bodyJSON} from "../src/controller/IJSON";

let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";


describe("QueryEngineRoomSpec", function () {

    let db: Database = new Database;
    let inFac: InsightFacade;

    function checkResults(first: Array<any>, second: Array<any>): void {
        if (first.length !== second.length) {
            Log.warn('>>> QUERY DID NOT RETURN EXPECTED RESULTS <<<');
            expect.fail();
        }
        expect(first).to.deep.include.members(second);
    }

    beforeEach(function (done) {
        this.timeout(10000);

        Log.warn('database is being reset...');
        db.reset("all");

        inFac = new InsightFacade();

        // clear databases that are cached
        Log.warn('deleting cached databases...');

        let databaseList = fs.readdirSync('./dbFiles/');
        for (const file of databaseList) {
            fs.unlinkSync('./dbFiles/' + file)
        }

        // load default rooms.zip
        let content: string = new Buffer(fs.readFileSync('./zips/rooms.zip'))
            .toString('base64');

        inFac.addDataset('rooms', content).then(function () {
            Log.warn('done set up...begin test');
            done();

        }).catch(function (err) {
            Log.warn('FAILED IN SET UP -  ' + err.body.error)

        })

    });


    it("Should complete a simple room query (from Spec example)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/simpleQueryRoom');
        let expectedResult: string = "{\"result\":[{\"rooms_name\":\"DMP_101\"},{\"rooms_name\":\"DMP_110\"},{\"rooms_name\":\"DMP_201\"},{\"rooms_name\":\"DMP_301\"},{\"rooms_name\":\"DMP_310\"}]}"

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a complex room query (from Spec example)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/complexQueryRoom');
        let expectedResult: string = "{\"result\":[{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4074\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4068\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4058\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4018\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4004\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3074\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3068\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3058\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3018\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3004\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_1001\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4072\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4062\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4052\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4016\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_4002\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3072\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3062\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3052\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3016\"},{\"rooms_address\":\"6363 Agronomy Road\",\"rooms_name\":\"ORCH_3002\"},{\"rooms_address\":\"6245 Agronomy Road V6T 1Z4\",\"rooms_name\":\"DMP_310\"},{\"rooms_address\":\"6245 Agronomy Road V6T 1Z4\",\"rooms_name\":\"DMP_201\"},{\"rooms_address\":\"6245 Agronomy Road V6T 1Z4\",\"rooms_name\":\"DMP_101\"},{\"rooms_address\":\"6245 Agronomy Road V6T 1Z4\",\"rooms_name\":\"DMP_301\"},{\"rooms_address\":\"6245 Agronomy Road V6T 1Z4\",\"rooms_name\":\"DMP_110\"}]}"

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a complex room query with untested (to this point) missing room keys", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/hugeRoomQuery');
        let expectedResult: string = "{\"result\":[{\"rooms_shortname\":\"OSBO\",\"rooms_number\":\"A\",\"rooms_seats\":442,\"rooms_type\":\"Open Design General Purpose\",\"rooms_furniture\":\"Classroom-Movable Tables & Chairs\",\"rooms_lat\":49.26047},{\"rooms_shortname\":\"IBLC\",\"rooms_number\":\"261\",\"rooms_seats\":112,\"rooms_type\":\"Open Design General Purpose\",\"rooms_furniture\":\"Classroom-Movable Tables & Chairs\",\"rooms_lat\":49.26766},{\"rooms_shortname\":\"HEBB\",\"rooms_number\":\"12\",\"rooms_seats\":54,\"rooms_type\":\"Open Design General Purpose\",\"rooms_furniture\":\"Classroom-Movable Tables & Chairs\",\"rooms_lat\":49.2661},{\"rooms_shortname\":\"HEBB\",\"rooms_number\":\"10\",\"rooms_seats\":54,\"rooms_type\":\"Open Design General Purpose\",\"rooms_furniture\":\"Classroom-Movable Tables & Chairs\",\"rooms_lat\":49.2661},{\"rooms_shortname\":\"HEBB\",\"rooms_number\":\"13\",\"rooms_seats\":54,\"rooms_type\":\"Open Design General Purpose\",\"rooms_furniture\":\"Classroom-Movable Tables & Chairs\",\"rooms_lat\":49.2661}]}"

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a simple url query", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/simpleQueryForURL');
        let expectedResult: string = "{\"result\":[{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-122\",\"rooms_name\":\"SOWK_122\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-124\",\"rooms_name\":\"SOWK_124\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-222\",\"rooms_name\":\"SOWK_222\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-223\",\"rooms_name\":\"SOWK_223\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-224\",\"rooms_name\":\"SOWK_224\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-324\",\"rooms_name\":\"SOWK_324\"},{\"rooms_href\":\"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-326\",\"rooms_name\":\"SOWK_326\"}]}"

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should throw 424 with a query for sections using room dataset", function (done) {
        let db = new Database();

        let query: string = fs.readFileSync('test/testQueries/simpleQueryForYear');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done()


        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn('Error message: ' + err.message)
            expect(err.code).to.equal(424);


        }).then(done, done)
    });

    it("Should still be able to perform a query when the removed dataset has a different id (Edison)", function (done) {
        this.timeout(15000);
        let query: string = fs.readFileSync('test/testQueries/simpleQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"educ","courses_avg":97.5},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"epse","courses_avg":97.67},{"courses_dept":"epse","courses_avg":97.69},{"courses_dept":"epse","courses_avg":97.78},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"epse","courses_avg":98.08},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"epse","courses_avg":98.36},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.7},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.8},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"cnps","courses_avg":99.19},{"courses_dept":"math","courses_avg":99.78},{"courses_dept":"math","courses_avg":99.78}]}';

        let contentC: string = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset("courses", contentC).then(function () {
            expect(db.countEntries()).to.equal(64976)

            return inFac.removeDataset("rooms")

        }).then(function () { // preloaded ROOMS is deleted
            expect(db.countEntries()).to.equal(64612);

            return inFac.performQuery(JSON.parse(query))
            // perform query on empty database

        }).catch(function (err) {
            Log.warn('failed to query:  ' + err.body.error);
            expect.fail();

        }).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })

    });

    it("Should be able to perform query when dataset has been added (Cesium)", function (done) {
        this.timeout(15000);
        let query: string = fs.readFileSync('test/testQueries/simpleQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"educ","courses_avg":97.5},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"epse","courses_avg":97.67},{"courses_dept":"epse","courses_avg":97.69},{"courses_dept":"epse","courses_avg":97.78},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"epse","courses_avg":98.08},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"epse","courses_avg":98.36},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.7},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.8},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"cnps","courses_avg":99.19},{"courses_dept":"math","courses_avg":99.78},{"courses_dept":"math","courses_avg":99.78}]}';

        inFac.removeDataset("rooms").then(function () { // preloaded ROOMS is deleted
            expect(db.countEntries()).to.equal(0);
            return inFac.performQuery(JSON.parse(query))
            // perform query on empty database

        }).then(function(obj) {
            Log.warn("Should have failed to query an empty database.")
            expect.fail();

        }).catch(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(424); // b/c empty

            let contentC: string = new Buffer(fs.readFileSync('./zips/courses.zip'))
                .toString('base64');

            return inFac.addDataset("courses", contentC);
            // add the COURSES dataset

        }).catch(function (err) {
            Log.warn('failed to add dataset:  ' + err.body.error);
            expect.fail();

        }).then(function () {
            let contentR: string = new Buffer(fs.readFileSync('./zips/rooms.zip'))
                .toString('base64');

            return inFac.addDataset("rooms", contentR);
            // add the ROOMS dataset

        }).then(function () {
            expect(db.countEntries()).to.equal(64976)
            return inFac.performQuery(JSON.parse(query))
            // perform the query on the database with COURSES and ROOMS loaded

        }).catch(function (err) {
            Log.warn('failed to query:  ' + err.body.error);
            expect.fail();

        }).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })

    });

 });