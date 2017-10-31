/**
 * Created by sprecious on 2017-10-03.
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {GeoUtil} from "../src/controller/GeoUtil";
import {GeoResponse} from "../src/controller/IGeoResponse";

let fs = require('fs');

describe("GeoUtilSpec", function () {

    it("Should get lat/lon from an address", function (done) {
        GeoUtil.getLatLon("6245 Agronomy Road V6T 1Z4")
        .then(function (gr: GeoResponse) {
            expect(gr.lat).to.equal(49.26125);
            expect(gr.lon).to.equal(-123.24807);

        }).then(done, done).catch(function (err: Error) {
            Log.warn('ERROR: ' + err.message);
            expect.fail();
            done();

        })
    });

});
