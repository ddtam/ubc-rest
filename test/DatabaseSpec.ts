/**
 * Created by sprecious on 2017-10-04.
 */

import * as fs from "fs";
import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {Database} from "../src/controller/Database";
import {Section} from "../src/controller/Section";

describe("DatabaseSpec", function () {

    beforeEach(function () {
       Log.warn('database is being reset...');
       let db = new Database();
       db.reset();
    });

    it("should write 9 fields correctly", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {
            // done
            Log.test('Return code: ' + obj.code);

            // query db for first section of first course
            var s: Section = db.getUUID(32311);
            expect(s.dept).to.deep.equal("asia");
            expect(s.id).to.deep.equal("254");
            expect(s.title).to.deep.equal("jpn sex&gend flm");
            expect(s.instructor).to.deep.equal("hall, nicholas");

            // query db for 12th section of second course
            var s: Section = db.getUUID(74337);
            expect(s.dept).to.deep.equal("econ");
            expect(s.id).to.deep.equal("311");
            expect(s.title).to.deep.equal("macroeconomics");
            expect(s.instructor).to.deep.equal("shrestha, ratna");
            expect(s.fail).to.equal(11);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    it("Should return a singleton database", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {

                Log.info('return code: ' + obj.code);
                expect(db.countEntries()).to.equal(22);

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

    //Can't figure out this test

    it("Write to dbFiles should match sectionCollection", function (done) {
        let inFac = new InsightFacade();
        let content: string;
        let db = new Database();

        content = new Buffer(fs.readFileSync('courses_3test.zip'))
            .toString('base64');

        inFac.addDataset('courses', content).then(function (obj) {

            Log.info('return code: ' + obj.code);
            let result:string;
            fs.readFile('./dbFiles/test', (err, data) => {
                if (err) throw err;
                result = data.toString();
                console.log(data);
            });
            //console.log(result);
            //expect(result).to.deep.equal('{content: [{"dept":"asia","id":"254","title":"jpn sex&gend flm","instructor":"hall, nicholas","avg":72.34,"pass":80,"fail":3,"audit":0,"uuid":32311},{"dept":"asia","id":"254","title":"jpn sex&gend flm","instructor":"","avg":72.34,"pass":80,"fail":3,"audit":0,"uuid":32312},{"dept":"asia","id":"254","title":"jpn sex&gend flm","instructor":"milutin, otillia clara","avg":84.5,"pass":20,"fail":0,"audit":0,"uuid":39402},{"dept":"asia","id":"254","title":"jpn sex&gend flm","instructor":"","avg":84.5,"pass":20,"fail":0,"audit":0,"uuid":39403},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":71.25,"pass":214,"fail":9,"audit":0,"uuid":11475},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":71.25,"pass":214,"fail":9,"audit":0,"uuid":11476},{"dept":"econ","id":"311","title":"","instructor":"shrestha, ratna","avg":74.14,"pass":216,"fail":9,"audit":0,"uuid":21476},{"dept":"econ","id":"311","title":"","instructor":"","avg":74.14,"pass":216,"fail":9,"audit":0,"uuid":21477},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":74.73,"pass":231,"fail":6,"audit":1,"uuid":21949},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":74.73,"pass":231,"fail":6,"audit":1,"uuid":21950},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":74.26,"pass":217,"fail":11,"audit":0,"uuid":52282},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":74.26,"pass":217,"fail":11,"audit":0,"uuid":52283},{"dept":"econ","id":"311","title":"","instructor":"shrestha, ratna","avg":73.34,"pass":211,"fail":18,"audit":0,"uuid":58365},{"dept":"econ","id":"311","title":"","instructor":"","avg":73.34,"pass":211,"fail":18,"audit":0,"uuid":58366},{"dept":"econ","id":"311","title":"","instructor":"","avg":74.9,"pass":239,"fail":5,"audit":0,"uuid":69823},{"dept":"econ","id":"311","title":"","instructor":"","avg":74.9,"pass":239,"fail":5,"audit":0,"uuid":69824},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":72.99,"pass":195,"fail":11,"audit":0,"uuid":74337},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":72.99,"pass":195,"fail":11,"audit":0,"uuid":74338},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":72.29,"pass":229,"fail":10,"audit":0,"uuid":78383},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":72.29,"pass":229,"fail":10,"audit":0,"uuid":78384},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"shrestha, ratna","avg":72.75,"pass":227,"fail":5,"audit":2,"uuid":90932},{"dept":"econ","id":"311","title":"macroeconomics","instructor":"","avg":72.75,"pass":227,"fail":5,"audit":2,"uuid":90933}]}');

        }).then(done, done).catch(function (err) {
            Log.test(err);
            expect.fail();
            done();
        });
    });

});