import {GeoResponse} from "./IGeoResponse";
import {IncomingMessage} from "http";
let http = require('http');

export class GeoUtil {

    /**
     * getLatLon returns a promise to resolve an address into GPS coordinates as a GeoResponse
     * @param {string} addr is the real-world address of the location to be queried
     * @returns {Promise<GeoResponse>} that will resolve into a GeoReponse containing a lat-lon pair
     */
    static getLatLon(addr: string): Promise<GeoResponse> {
        let body: string = '';
        let js: JSON = null;
        let that = this;

        return new Promise(function (fulfill) {
            that.getHttpIncomingMessage(addr)
                .then(function (response: IncomingMessage) {
                    response.on('data', (chunk) => {
                        body += chunk
                    });

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

    /**
     * Get the HTTP response for a GET
     * @param {string} addr is the physical real-world address of the location being queried
     * @returns {Promise<"http".IncomingMessage>} is an incoming message for the lat-lon request
     */
    private static getHttpIncomingMessage(addr: string): Promise<IncomingMessage> {
        let that = this;

        return new Promise(function (fulfill) {
            http.get(that.getSiteFromAddress(addr), function (response: any) {
                fulfill(response);

            })
        })
    }

    /**
     * Converts an address into a web-query to the UBC CS host
     * @param {string} addr is the address to be queried
     * @returns {string} as well-formed URI query
     */
    static getSiteFromAddress(addr: string): string{
        let x = "http://skaha.cs.ubc.ca:11316/api/v1/team164/" + encodeURI(addr);
        return x;
    }
}