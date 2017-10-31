/**
 * Created by dtam on 2017-10-03.
 */
import {Room} from "../src/controller/Room";
import {expect} from 'chai';

let fs = require('fs');

describe("GeoUtilSpec", function () {

    it("Should get lat/lon from an address", function (done) {
        let room: Room = null;

        new Promise(function (fulfill) {
            room = new Room("ksfj", "kds", "kk", "6245 Agronomy Road V6T 1Z4", 8, "k", "k", ",dsfj");
            fulfill();

        }).then(function () {
            expect(room.rooms_lat).to.equal(49.26125);
            expect(room.rooms_lat).to.equal(-123.24807);
        })


    });

});
