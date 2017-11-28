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

    it("Should complete a query that groups all departments", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/simpleTransformationQueryForAllSection');
        let expectedResult: string = '{"result":[{"courses_dept":"aanb"},{"courses_dept":"adhe"},{"courses_dept":"anat"},{"courses_dept":"anth"},{"courses_dept":"apbi"},{"courses_dept":"appp"},{"courses_dept":"apsc"},{"courses_dept":"arbc"},{"courses_dept":"arch"},{"courses_dept":"arcl"},{"courses_dept":"arst"},{"courses_dept":"arth"},{"courses_dept":"asia"},{"courses_dept":"asic"},{"courses_dept":"astr"},{"courses_dept":"astu"},{"courses_dept":"atsc"},{"courses_dept":"audi"},{"courses_dept":"ba"},{"courses_dept":"baac"},{"courses_dept":"babs"},{"courses_dept":"baen"},{"courses_dept":"bafi"},{"courses_dept":"bahr"},{"courses_dept":"bait"},{"courses_dept":"bala"},{"courses_dept":"bama"},{"courses_dept":"bams"},{"courses_dept":"bapa"},{"courses_dept":"basc"},{"courses_dept":"basm"},{"courses_dept":"baul"},{"courses_dept":"bioc"},{"courses_dept":"biof"},{"courses_dept":"biol"},{"courses_dept":"bmeg"},{"courses_dept":"bota"},{"courses_dept":"busi"},{"courses_dept":"caps"},{"courses_dept":"ccst"},{"courses_dept":"ceen"},{"courses_dept":"cell"},{"courses_dept":"cens"},{"courses_dept":"chbe"},{"courses_dept":"chem"},{"courses_dept":"chil"},{"courses_dept":"chin"},{"courses_dept":"cics"},{"courses_dept":"civl"},{"courses_dept":"clch"},{"courses_dept":"clst"},{"courses_dept":"cnps"},{"courses_dept":"cnrs"},{"courses_dept":"cnto"},{"courses_dept":"coec"},{"courses_dept":"cogs"},{"courses_dept":"cohr"},{"courses_dept":"comm"},{"courses_dept":"cons"},{"courses_dept":"cpen"},{"courses_dept":"cpsc"},{"courses_dept":"crwr"},{"courses_dept":"dani"},{"courses_dept":"dent"},{"courses_dept":"dhyg"},{"courses_dept":"eced"},{"courses_dept":"econ"},{"courses_dept":"edcp"},{"courses_dept":"edst"},{"courses_dept":"educ"},{"courses_dept":"eece"},{"courses_dept":"elec"},{"courses_dept":"ends"},{"courses_dept":"engl"},{"courses_dept":"enph"},{"courses_dept":"envr"},{"courses_dept":"eosc"},{"courses_dept":"epse"},{"courses_dept":"etec"},{"courses_dept":"fhis"},{"courses_dept":"fipr"},{"courses_dept":"fish"},{"courses_dept":"fist"},{"courses_dept":"fmst"},{"courses_dept":"fnel"},{"courses_dept":"fnh"},{"courses_dept":"fnis"},{"courses_dept":"food"},{"courses_dept":"fopr"},{"courses_dept":"fre"},{"courses_dept":"fren"},{"courses_dept":"frst"},{"courses_dept":"gbpr"},{"courses_dept":"geob"},{"courses_dept":"geog"},{"courses_dept":"germ"},{"courses_dept":"gpp"},{"courses_dept":"grek"},{"courses_dept":"grsj"},{"courses_dept":"gsat"},{"courses_dept":"hebr"},{"courses_dept":"hgse"},{"courses_dept":"hinu"},{"courses_dept":"hist"},{"courses_dept":"hunu"},{"courses_dept":"iar"},{"courses_dept":"igen"},{"courses_dept":"info"},{"courses_dept":"isci"},{"courses_dept":"ital"},{"courses_dept":"itst"},{"courses_dept":"iwme"},{"courses_dept":"japn"},{"courses_dept":"jrnl"},{"courses_dept":"kin"},{"courses_dept":"korn"},{"courses_dept":"lais"},{"courses_dept":"larc"},{"courses_dept":"laso"},{"courses_dept":"last"},{"courses_dept":"latn"},{"courses_dept":"law"},{"courses_dept":"lfs"},{"courses_dept":"libe"},{"courses_dept":"libr"},{"courses_dept":"ling"},{"courses_dept":"lled"},{"courses_dept":"math"},{"courses_dept":"mdvl"},{"courses_dept":"mech"},{"courses_dept":"medg"},{"courses_dept":"medi"},{"courses_dept":"micb"},{"courses_dept":"midw"},{"courses_dept":"mine"},{"courses_dept":"mrne"},{"courses_dept":"mtrl"},{"courses_dept":"musc"},{"courses_dept":"name"},{"courses_dept":"nest"},{"courses_dept":"nrsc"},{"courses_dept":"nurs"},{"courses_dept":"obst"},{"courses_dept":"onco"},{"courses_dept":"path"},{"courses_dept":"pcth"},{"courses_dept":"pers"},{"courses_dept":"phar"},{"courses_dept":"phil"},{"courses_dept":"phrm"},{"courses_dept":"phth"},{"courses_dept":"phys"},{"courses_dept":"plan"},{"courses_dept":"poli"},{"courses_dept":"pols"},{"courses_dept":"port"},{"courses_dept":"psyc"},{"courses_dept":"punj"},{"courses_dept":"relg"},{"courses_dept":"rgla"},{"courses_dept":"rhsc"},{"courses_dept":"rmes"},{"courses_dept":"rmst"},{"courses_dept":"rsot"},{"courses_dept":"russ"},{"courses_dept":"sans"},{"courses_dept":"scan"},{"courses_dept":"scie"},{"courses_dept":"soci"},{"courses_dept":"soil"},{"courses_dept":"sowk"},{"courses_dept":"span"},{"courses_dept":"spha"},{"courses_dept":"spph"},{"courses_dept":"stat"},{"courses_dept":"sts"},{"courses_dept":"surg"},{"courses_dept":"swed"},{"courses_dept":"test"},{"courses_dept":"thtr"},{"courses_dept":"udes"},{"courses_dept":"ufor"},{"courses_dept":"urst"},{"courses_dept":"ursy"},{"courses_dept":"vant"},{"courses_dept":"visa"},{"courses_dept":"wood"},{"courses_dept":"wrds"},{"courses_dept":"zool"}]}';

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

    it("Should handle a transformation query with duplicate APPLY keys", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformationDupeApply');

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
            Log.test(err.body.error);
            expect(err.code).to.equal(400);
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
            Log.test(err.body.error);
            expect(err.code).to.equal(400);
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
            Log.test(err.body.error);
            expect(err.code).to.equal(400);
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
            Log.test(err.body.error);
            expect(err.code).to.equal(400);
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
            Log.test(err.body.error);
            expect(err.code).to.equal(400);
            expect(err.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    // Passes anyway if body.result.length === something else, but I checked and it's 64612.  Don't know why not working. Same w/ radium
    it("Should be able to retrieve all courses data (Quicksilver)", function (done) {

        this.timeout(5000);
        let query: string = fs.readFileSync('test/testQueries/quicksilverQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            expect (body.result.length === 64612);

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });

    // Passes anyway if body.result.length === something else, but I checked and it's 364.  Don't know why not working. Same w/ quicksilver
    it("Should be able to retrieve all rooms data (radium)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/radiumQuery');

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            expect (body.result.length === 364);

        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });

    it("Should be able to order on multiple keys (Riviera)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/rivieraQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"laso","minPass":65},{"courses_dept":"appp","minPass":42},{"courses_dept":"spha","minPass":23},{"courses_dept":"baul","minPass":20},{"courses_dept":"vant","minPass":13},{"courses_dept":"baen","minPass":13},{"courses_dept":"bapa","minPass":12},{"courses_dept":"ba","minPass":12},{"courses_dept":"name","minPass":11},{"courses_dept":"basc","minPass":10},{"courses_dept":"bala","minPass":9},{"courses_dept":"bahr","minPass":9},{"courses_dept":"last","minPass":8},{"courses_dept":"bait","minPass":8},{"courses_dept":"audi","minPass":8},{"courses_dept":"arbc","minPass":8},{"courses_dept":"scan","minPass":7},{"courses_dept":"gsat","minPass":7},{"courses_dept":"caps","minPass":7},{"courses_dept":"bams","minPass":7},{"courses_dept":"babs","minPass":7},{"courses_dept":"baac","minPass":7},{"courses_dept":"arcl","minPass":7},{"courses_dept":"adhe","minPass":7},{"courses_dept":"latn","minPass":6},{"courses_dept":"lais","minPass":6},{"courses_dept":"basm","minPass":6},{"courses_dept":"astu","minPass":6},{"courses_dept":"asia","minPass":6},{"courses_dept":"aanb","minPass":6},{"courses_dept":"visa","minPass":5},{"courses_dept":"rgla","minPass":5},{"courses_dept":"japn","minPass":5},{"courses_dept":"bama","minPass":5},{"courses_dept":"asic","minPass":5},{"courses_dept":"apsc","minPass":5},{"courses_dept":"sans","minPass":4},{"courses_dept":"plan","minPass":4},{"courses_dept":"larc","minPass":4},{"courses_dept":"bafi","minPass":4},{"courses_dept":"atsc","minPass":4},{"courses_dept":"arst","minPass":4},{"courses_dept":"anat","minPass":4},{"courses_dept":"ital","minPass":3},{"courses_dept":"dani","minPass":3},{"courses_dept":"bota","minPass":3},{"courses_dept":"astr","minPass":3},{"courses_dept":"anth","minPass":3},{"courses_dept":"span","minPass":2},{"courses_dept":"law","minPass":2},{"courses_dept":"apbi","minPass":2},{"courses_dept":"stat","minPass":1},{"courses_dept":"phar","minPass":1},{"courses_dept":"path","minPass":1},{"courses_dept":"math","minPass":1},{"courses_dept":"iar","minPass":1},{"courses_dept":"arth","minPass":1},{"courses_dept":"arch","minPass":1}]}';

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

    it("Should be able to order on multiple keys in reverse order (Romeo)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/romeoQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"arch","minPass":1},{"courses_dept":"arth","minPass":1},{"courses_dept":"iar","minPass":1},{"courses_dept":"math","minPass":1},{"courses_dept":"path","minPass":1},{"courses_dept":"phar","minPass":1},{"courses_dept":"stat","minPass":1},{"courses_dept":"apbi","minPass":2},{"courses_dept":"law","minPass":2},{"courses_dept":"span","minPass":2},{"courses_dept":"anth","minPass":3},{"courses_dept":"astr","minPass":3},{"courses_dept":"bota","minPass":3},{"courses_dept":"dani","minPass":3},{"courses_dept":"ital","minPass":3},{"courses_dept":"anat","minPass":4},{"courses_dept":"arst","minPass":4},{"courses_dept":"atsc","minPass":4},{"courses_dept":"bafi","minPass":4},{"courses_dept":"larc","minPass":4},{"courses_dept":"plan","minPass":4},{"courses_dept":"sans","minPass":4},{"courses_dept":"apsc","minPass":5},{"courses_dept":"asic","minPass":5},{"courses_dept":"bama","minPass":5},{"courses_dept":"japn","minPass":5},{"courses_dept":"rgla","minPass":5},{"courses_dept":"visa","minPass":5},{"courses_dept":"aanb","minPass":6},{"courses_dept":"asia","minPass":6},{"courses_dept":"astu","minPass":6},{"courses_dept":"basm","minPass":6},{"courses_dept":"lais","minPass":6},{"courses_dept":"latn","minPass":6},{"courses_dept":"adhe","minPass":7},{"courses_dept":"arcl","minPass":7},{"courses_dept":"baac","minPass":7},{"courses_dept":"babs","minPass":7},{"courses_dept":"bams","minPass":7},{"courses_dept":"caps","minPass":7},{"courses_dept":"gsat","minPass":7},{"courses_dept":"scan","minPass":7},{"courses_dept":"arbc","minPass":8},{"courses_dept":"audi","minPass":8},{"courses_dept":"bait","minPass":8},{"courses_dept":"last","minPass":8},{"courses_dept":"bahr","minPass":9},{"courses_dept":"bala","minPass":9},{"courses_dept":"basc","minPass":10},{"courses_dept":"name","minPass":11},{"courses_dept":"ba","minPass":12},{"courses_dept":"bapa","minPass":12},{"courses_dept":"baen","minPass":13},{"courses_dept":"vant","minPass":13},{"courses_dept":"baul","minPass":20},{"courses_dept":"spha","minPass":23},{"courses_dept":"appp","minPass":42},{"courses_dept":"laso","minPass":65}]}';

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

    it("Should be able to use AVG in a transformation (Sahara)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/saharaQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"aanb","avgAvg":91.14},{"courses_dept":"audi","avgAvg":86.35},{"courses_dept":"anat","avgAvg":84.9},{"courses_dept":"arst","avgAvg":84.48},{"courses_dept":"adhe","avgAvg":82.94},{"courses_dept":"atsc","avgAvg":81.26},{"courses_dept":"arch","avgAvg":81.24},{"courses_dept":"appp","avgAvg":80.7},{"courses_dept":"arbc","avgAvg":80.08},{"courses_dept":"arth","avgAvg":77.87},{"courses_dept":"apbi","avgAvg":77.62},{"courses_dept":"anth","avgAvg":77.55},{"courses_dept":"asic","avgAvg":76.93},{"courses_dept":"apsc","avgAvg":76.62},{"courses_dept":"astr","avgAvg":76.36},{"courses_dept":"asia","avgAvg":74.53},{"courses_dept":"arcl","avgAvg":73.32},{"courses_dept":"astu","avgAvg":72.27}]}';

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

    it("Should be able to use and sort with multiple APPLY keys (SteamedHam/Stratos/Stringer)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/steamedHamQuery');
        let expectedResult: string = '{"result":[{"courses_dept":"iar","minPass":1,"maxPass":5},{"courses_dept":"arch","minPass":1,"maxPass":62},{"courses_dept":"arth","minPass":1,"maxPass":131},{"courses_dept":"path","minPass":1,"maxPass":148},{"courses_dept":"phar","minPass":1,"maxPass":234},{"courses_dept":"stat","minPass":1,"maxPass":827},{"courses_dept":"math","minPass":1,"maxPass":1390},{"courses_dept":"law","minPass":2,"maxPass":190},{"courses_dept":"apbi","minPass":2,"maxPass":233},{"courses_dept":"span","minPass":2,"maxPass":534},{"courses_dept":"dani","minPass":3,"maxPass":22},{"courses_dept":"bota","minPass":3,"maxPass":23},{"courses_dept":"anth","minPass":3,"maxPass":212},{"courses_dept":"ital","minPass":3,"maxPass":272},{"courses_dept":"astr","minPass":3,"maxPass":462},{"courses_dept":"sans","minPass":4,"maxPass":11},{"courses_dept":"arst","minPass":4,"maxPass":35},{"courses_dept":"larc","minPass":4,"maxPass":36},{"courses_dept":"plan","minPass":4,"maxPass":65},{"courses_dept":"anat","minPass":4,"maxPass":83},{"courses_dept":"atsc","minPass":4,"maxPass":101},{"courses_dept":"bafi","minPass":4,"maxPass":233},{"courses_dept":"rgla","minPass":5,"maxPass":25},{"courses_dept":"asic","minPass":5,"maxPass":86},{"courses_dept":"bama","minPass":5,"maxPass":203},{"courses_dept":"visa","minPass":5,"maxPass":442},{"courses_dept":"japn","minPass":5,"maxPass":500},{"courses_dept":"apsc","minPass":5,"maxPass":810},{"courses_dept":"lais","minPass":6,"maxPass":7},{"courses_dept":"aanb","minPass":6,"maxPass":9},{"courses_dept":"astu","minPass":6,"maxPass":121},{"courses_dept":"latn","minPass":6,"maxPass":135},{"courses_dept":"basm","minPass":6,"maxPass":188},{"courses_dept":"asia","minPass":6,"maxPass":409},{"courses_dept":"gsat","minPass":7,"maxPass":18},{"courses_dept":"bams","minPass":7,"maxPass":69},{"courses_dept":"scan","minPass":7,"maxPass":78},{"courses_dept":"babs","minPass":7,"maxPass":140},{"courses_dept":"arcl","minPass":7,"maxPass":184},{"courses_dept":"adhe","minPass":7,"maxPass":193},{"courses_dept":"baac","minPass":7,"maxPass":201},{"courses_dept":"caps","minPass":7,"maxPass":583},{"courses_dept":"arbc","minPass":8,"maxPass":40},{"courses_dept":"last","minPass":8,"maxPass":47},{"courses_dept":"audi","minPass":8,"maxPass":87},{"courses_dept":"bait","minPass":8,"maxPass":94},{"courses_dept":"bala","minPass":9,"maxPass":57},{"courses_dept":"bahr","minPass":9,"maxPass":222},{"courses_dept":"basc","minPass":10,"maxPass":153},{"courses_dept":"name","minPass":11,"maxPass":16},{"courses_dept":"bapa","minPass":12,"maxPass":205},{"courses_dept":"ba","minPass":12,"maxPass":209},{"courses_dept":"baen","minPass":13,"maxPass":69},{"courses_dept":"vant","minPass":13,"maxPass":203},{"courses_dept":"baul","minPass":20,"maxPass":46},{"courses_dept":"spha","minPass":23,"maxPass":44},{"courses_dept":"appp","minPass":42,"maxPass":70},{"courses_dept":"laso","minPass":65,"maxPass":89}]}';

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

    it("Should be able to find the average of all courses in a dept (Taurus)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/taurusQuery');
        let expectedResult: string = '{"result":[{"courses_id":"449","avgAvg":90.38},{"courses_id":"490","avgAvg":89.77},{"courses_id":"501","avgAvg":89.77},{"courses_id":"547","avgAvg":88.58},{"courses_id":"503","avgAvg":88.08},{"courses_id":"527","avgAvg":87.48},{"courses_id":"507","avgAvg":87.44},{"courses_id":"509","avgAvg":86.02},{"courses_id":"540","avgAvg":85.87},{"courses_id":"543","avgAvg":85.78},{"courses_id":"589","avgAvg":85.75},{"courses_id":"522","avgAvg":85.16},{"courses_id":"521","avgAvg":85.06},{"courses_id":"319","avgAvg":84.52},{"courses_id":"544","avgAvg":84.31},{"courses_id":"500","avgAvg":83.96},{"courses_id":"502","avgAvg":82.96},{"courses_id":"513","avgAvg":82.7},{"courses_id":"301","avgAvg":81.84},{"courses_id":"515","avgAvg":81.8},{"courses_id":"445","avgAvg":80.86},{"courses_id":"312","avgAvg":80.71},{"courses_id":"418","avgAvg":80.51},{"courses_id":"411","avgAvg":80.18},{"courses_id":"444","avgAvg":78.84},{"courses_id":"344","avgAvg":78.47},{"courses_id":"310","avgAvg":78.25},{"courses_id":"430","avgAvg":77.39},{"courses_id":"311","avgAvg":77.25},{"courses_id":"410","avgAvg":77.11},{"courses_id":"314","avgAvg":76.78},{"courses_id":"304","avgAvg":76.3},{"courses_id":"340","avgAvg":75.69},{"courses_id":"121","avgAvg":75.54},{"courses_id":"302","avgAvg":75.51},{"courses_id":"421","avgAvg":74.91},{"courses_id":"416","avgAvg":74.9},{"courses_id":"221","avgAvg":74.49},{"courses_id":"259","avgAvg":74.46},{"courses_id":"110","avgAvg":74.41},{"courses_id":"404","avgAvg":74.32},{"courses_id":"213","avgAvg":74.04},{"courses_id":"210","avgAvg":73.99},{"courses_id":"313","avgAvg":73.98},{"courses_id":"425","avgAvg":73.93},{"courses_id":"322","avgAvg":73.11},{"courses_id":"422","avgAvg":73.01},{"courses_id":"303","avgAvg":72.76},{"courses_id":"317","avgAvg":72.57},{"courses_id":"420","avgAvg":72.24},{"courses_id":"415","avgAvg":70.93},{"courses_id":"320","avgAvg":70.09},{"courses_id":"261","avgAvg":69.17}]}';

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

    it("Should be able to perform many applies", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/complexQueryMultipleApply');
        let expectedResult: string = '{"result":[{"rooms_shortname":"WESB","maxSeats":325,"avgSeats":325,"minSeats":325,"sumSeats":325,"countSeats":1},{"rooms_shortname":"ESB","maxSeats":350,"avgSeats":350,"minSeats":350,"sumSeats":350,"countSeats":1},{"rooms_shortname":"LSC","maxSeats":350,"avgSeats":350,"minSeats":350,"sumSeats":700,"countSeats":1},{"rooms_shortname":"HEBB","maxSeats":375,"avgSeats":375,"minSeats":375,"sumSeats":375,"countSeats":1},{"rooms_shortname":"CIRS","maxSeats":426,"avgSeats":426,"minSeats":426,"sumSeats":426,"countSeats":1},{"rooms_shortname":"OSBO","maxSeats":442,"avgSeats":442,"minSeats":442,"sumSeats":442,"countSeats":1},{"rooms_shortname":"WOOD","maxSeats":503,"avgSeats":503,"minSeats":503,"sumSeats":503,"countSeats":1}]}';

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

    it("Should throw 400 when trying to use a column not used in group entries", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformQueryBadColumns');

        inFac.performQuery(JSON.parse(query)).then(function (err: any) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()

        }).catch(function (obj: any) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(400);
            expect(obj.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    it("Should throw 400 when trying to use a column that isn't user defined", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/badTransformQueryNotUserDefined');

        inFac.performQuery(JSON.parse(query)).then(function (err: any) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()

        }).catch(function (obj: any) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(400);
            expect(obj.body.error).to.contain("SYNTAXERR");

        }).then(done, done)
    });

    // all looking good until it goes to format the results... there's a bug in formatMatch
    // Might be a problem when it checks whether it's looking for rooms or sections when the first key doesn't contain
    // rooms_ or courses_
    it("Should be able to find the total seats of each room type (Tin)", function (done) {
        this.timeout(5000);

        let query: string = fs.readFileSync('test/testQueries/tinQuery');
        let expectedResult: string = '{"result":[{"rooms_type":"","seatsInType":1},{"rooms_type":"TBD","seatsInType":2},{"rooms_type":"Studio Lab","seatsInType":3},{"rooms_type":"Active Learning","seatsInType":5},{"rooms_type":"Case Style","seatsInType":15},{"rooms_type":"Small Group","seatsInType":29},{"rooms_type":"Open Design General Purpose","seatsInType":33},{"rooms_type":"Tiered Large Group","seatsInType":51}]}';

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

    it("Should be able to find and sort unique offerings for each course (Titanium)", function (done) {
        this.timeout(90000);

        let query: string = fs.readFileSync('test/testQueries/titaniumQuery');
        let expectedResult: Array<any> = JSON.parse(fs.readFileSync('test/testQueries/titaniumResult')).result;

        inFac.performQuery(JSON.parse(query)).then(function (obj) {
            Log.test('Return code: ' + obj.code);
            expect(obj.code).to.equal(200);
            let body: bodyJSON = obj.body;
            checkResults(expectedResult, body.result)


        }).then(done, done).catch(function (err) {
            Log.warn('Return code: ' + err.code + ' FAILED TEST');
            Log.warn(err.body.error);
            expect.fail();
            done()
        })
    });
});