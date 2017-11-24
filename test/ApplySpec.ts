import {Database} from "../src/controller/Database";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import {bodyJSON} from "../src/controller/IJSON";

describe ("ApplySpec", function () {

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

    beforeEach(function (done) {
        this.timeout(5000);

        Log.warn('database is being reset...');
        db.reset("all");

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
            expect.fail();
            done()
        })
    })

});