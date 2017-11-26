import {Database} from "../src/controller/Database";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import {bodyJSON} from "../src/controller/IJSON";

describe ("TransformSpec", function () {

    let fs = require('fs');
    let db: Database = new Database();
    let inFac: InsightFacade;

    function checkResults(first: Array<any>, second: Array<any>): void {
        if (first.length !== second.length) {
            Log.warn('>>> QUERY DID NOT RETURN EXPECTED RESULTS <<<');
            expect.fail();
        }
        expect(first).to.deep.include.members(second);
    }

    before(function(done) {
        this.timeout(90000);

        inFac = new InsightFacade();

        // load zips
        let rContent: string = new Buffer(fs.readFileSync('./zips/rooms.zip'))
            .toString('base64');

        let cContent: string = new Buffer(fs.readFileSync('./zips/courses.zip'))
            .toString('base64');

        inFac.addDataset('rooms', rContent).then(function () {
            return inFac.addDataset('courses', cContent)

        })
        .catch(function (err) {
            Log.warn('FAILED IN SET UP -  ' + err.body.error)

        }).then(function () {
                done();
        })
    });

    it("Should complete Query A from Spec (maxSeats transformation)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/maxSeatsQuery');
        let expectedResult: string = "{\"result\":[{\"rooms_shortname\":\"OSBO\",\"maxSeats\":442},{\"rooms_shortname\":\"HEBB\",\"maxSeats\":375},{\"rooms_shortname\":\"LSC\",\"maxSeats\":350}]}"

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });

    it("Should complete Query B from Spec (no apply)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/simpleTransformationQueryNoApply');
        let expectedResult: string = '{"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}';

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });

    it("Should complete a simple section query with MIN transformation", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/simpleTransformationQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"aanb","minAvg":87.83},{"courses_dept":"anat","minAvg":80.28},{"courses_dept":"appp","minAvg":77.99},{"courses_dept":"arbc","minAvg":75.4},{"courses_dept":"arst","minAvg":73.56},{"courses_dept":"arch","minAvg":73},{"courses_dept":"asic","minAvg":71.27},{"courses_dept":"atsc","minAvg":69.25},{"courses_dept":"arth","minAvg":68.91},{"courses_dept":"adhe","minAvg":67.5},{"courses_dept":"arcl","minAvg":64.5},{"courses_dept":"astu","minAvg":63.14},{"courses_dept":"audi","minAvg":62.63},{"courses_dept":"astr","minAvg":62.5},{"courses_dept":"asia","minAvg":61.46},{"courses_dept":"anth","minAvg":60.05},{"courses_dept":"apsc","minAvg":57.68},{"courses_dept":"apbi","minAvg":52.08}]}';

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(JSON.parse(expectedResult).result, body.result)

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });

    it("Should handle a bad transformation query with no GROUP", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationNoGroup');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query with no APPLY", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationNoApply');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query that groups on a bad course key", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationInvalidGroupCourseKey');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query that groups on a bad room key", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationInvalidGroupRoomKey');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query that isn't MAX/MIN/AVG/COUNT/SUM", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationInvalidApply');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query that performs MAX on a string", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationMaxString');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should handle a bad transformation query that performs MAX on a bad key", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationMaxBadKey');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.warn('Return code: ' + obj.code + ' FAILED TEST');
            expect.fail();
            done()

        }).catch(function (err) {
            Log.test('Return code: ' + err.code);
            expect(err.code).to.equal(400);
            Log.test(err.body.error);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    })

});