import {GeoResponse} from "./IGeoResponse";
import {IncomingMessage} from "http";
let http = require('http');

export class GeoUtil {

    getLatLon(addr: string): Promise<GeoResponse> {
        let body: string = '';
        let js: JSON = null;
        let that = this;

        return new Promise(function (fulfill) {
            new Promise(function (fulfill) {
                http.get(that.getSiteFromAddress(addr), function (response: any) {
                    fulfill(response);

                })
            }).then(function (response: IncomingMessage) {
                response.on('data', (chunk) => {
                    body += chunk
                })

                response.on('end', () => {
                    js = JSON.parse(body);
                    fulfill(js)

                })

            }).catch(function (err: Error) {
                fulfill({
                    error: err.message
                })
            })
        })



    }

    getSiteFromAddress(addr: string): string{
        let x = "http://skaha.cs.ubc.ca:11316/api/v1/team164/" + encodeURI(addr);

        console.log(x);

        return x;
    }
}