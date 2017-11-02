import {bodyJSON} from "../src/controller/IJSON";

let fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";


describe("QueryEngineSpec", function () {

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
        this.timeout(5000);

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
        let content: string = new Buffer(fs.readFileSync('./zips/rooms.zip'))
            .toString('base64');

        inFac.addDataset('rooms', content).then(function () {
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
});