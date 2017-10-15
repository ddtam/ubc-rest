let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";

describe("QueryEngineSpec", function () {

    let db: Database = new Database;
    let inFac: InsightFacade;

    beforeEach(function (done) {
        this.timeout(10000);

        Log.warn('database is being reset...');
        db.reset();

        inFac = new InsightFacade();

        // clear databases that are cached
        Log.warn('deleting cached databases...');

        let databaseList = fs.readdirSync('./dbFiles/');
        for (const file of databaseList) {
            fs.unlinkSync('./dbFiles/' + file)
        }

        // load default courses.zip
        let content: string = new Buffer(fs.readFileSync('courses.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function () {
            done();

        }).catch(function (err) {
            Log.warn('FAILED IN SET UP -  ' + err.body.error)

        })

    });

    it("Should complete a simple query (from Spec example)", function (done) {
        let query: string = fs.readFileSync('test/testQueries/simpleQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a query for all courses in CPSC", function (done) {
        let query: string = fs.readFileSync('test/testQueries/deptQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a query for all courses in starting with \"Z\"", function (done) {
        let query: string = fs.readFileSync('test/testQueries/deptQueryWithRegex');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a simple NOT query", function (done) {
        let query: string = fs.readFileSync('test/testQueries/notQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a complex query (from Spec example)", function (done) {
        let query: string = fs.readFileSync('test/testQueries/complexQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should complete a query for a very specific section", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/hardQueryForOne');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            Log.info(obj.body.toString());
            // TODO expect the actual results here

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect.fail();
            done()
        })
    });

    it("Should throw 400 with a query that is missing WHERE", function (done) {
        let query: string = fs.readFileSync('test/testQueries/badQueryRoot');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done();

        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect(err.code).to.equal(400);

        }).then(done, done)
    });

    it("Should throw 400 with a query that is not GT/LT/EQ", function (done) {
        let query: string = fs.readFileSync('test/testQueries/badQueryLeaf');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done();

        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect(err.code).to.equal(400);


        }).then(done, done)
    });

    it("Should throw 400 when given string query with multiple asterisks", function (done) {
        let query: string = fs.readFileSync('test/testQueries/badQueryWithMultipleAsterisks');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done();

        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect(err.code).to.equal(400);

        }).then(done, done)
    });

    it("Should throw 400 when trying to ORDER on field not in COLUMNS", function (done) {
        let query: string = fs.readFileSync('test/testQueries/badQueryOrderNotInColumn');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done();

        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect(err.code).to.equal(400);
            expect(err.body.error).to.contain('SYNTAXERR')

        }).then(done, done)
    });

    it("Should throw 424 with a missing dataset", function (done) {
        let db = new Database();
        db.reset();

        let query: string = fs.readFileSync('test/testQueries/simpleQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect.fail();
            done()


        }).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            expect(err.code).to.equal(424);

        }).then(done, done)
    });

});