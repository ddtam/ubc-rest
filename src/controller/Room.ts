/**
 * This is the object that all rooms will be represented as, similar structure to Section
 */
import {GeoResponse} from "./IGeoResponse";
import {GeoUtil} from "./GeoUtil";
let http = require('http');


export class Room {
    [index: string]: any;

    rooms_fullname: string;
    rooms_shortname: string;
    rooms_number: string;
    rooms_name: string;
    rooms_address: string;
    rooms_lat: number;
    rooms_lon: number;
    rooms_seats: number;
    rooms_type: string;
    rooms_furniture: string;
    rooms_href: string;

    constructor(
        fullName: string,
        shortName: string,
        number: string,
        address: string,
        seats: number,
        type: string,
        furniture: string,
        href: string
    ) {
        this.rooms_fullname = fullName;
        this.rooms_shortname = shortName;
        this.rooms_number = number;
        this.rooms_name = this.rooms_shortname + " " + this.rooms_number;
        this.rooms_address = address;
        this.rooms_seats= seats;
        this.rooms_type = type;
        this.rooms_furniture = furniture;
        this.rooms_href = href;

        let gu = new GeoUtil();

        let that = this;

        gu.getLatLon(this.rooms_address)
            .then(function (gr) {
                that.rooms_lat = gr.lat;
                that.rooms_lon = gr.lon;
            })

    }


    //TODO: fix getLatLon
}



/*
    rooms_fullname: string; Full building name (e.g., "Hugh Dempster Pavilion").
    rooms_shortname: string; Short building name (e.g., "DMP").
    rooms_number: string; The room number. Not always a number, so represented as a string.
    rooms_name: string; The room id; should be rooms_shortname+"_"+rooms_number.
    rooms_address: string; The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
    rooms_lat: number; The latitude of the building.
    rooms_lon: number; The longitude of the building.
    rooms_seats: number; The number of seats in the room.
    rooms_type: string; The room type (e.g., "Small Group").
    rooms_furniture: string; The room type (e.g., "Classroom-Movable Tables & Chairs").
    rooms_href: string; The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").
*/


// fetch(this.getSiteFromAddress()).then(function (obj: any) {
//     console.log(obj.lat);
//     console.log(obj.lon);
// }).catch(function (err: Error) {
//     console.log(err.message);
// })