import {Building} from "./Building";

export class HtmlUtil {
    static readBuildingIndex(json: JSON): Array<Building> {
        // store each building as Building object
        let buildings: Array<Building> = [];

        // get the tbody table out of the JSONified HTML
        let tbody: any = HtmlUtil.getTBody(json);

        // tbody.childNodes.tr.childNodes.
        for (let e of tbody.childNodes) {
            if (e.nodeName === "tr") {
                buildings.push(HtmlUtil.createBuildingFromNode(e))
            }
        }

        return buildings;

    }

    private static createBuildingFromNode(node: any): Building {
        let longname: string = '';
        let shortname: string = '';
        let address: string = '';

        // find the three properties in this shit-storm of automagically generated html/json nodes
        for (let node1 of node.childNodes) {
            if (node1.attrs) { // property attrs exists
                for (let node2 of node1.attrs) {
                    if (node2.value === 'views-field views-field-field-building-code') { // found shortname
                        shortname = node1.childNodes[0].value.trim()
                    }

                    if (node2.value === 'views-field views-field-field-building-address') { // found shortname
                        address = node1.childNodes[0].value.trim()
                    }

                    if (node2.value === 'views-field views-field-title') { // found shortname
                        longname = node1.childNodes[1].childNodes[0].value
                    }

                    if (longname && shortname && address) {
                        break; // everything has been found; exit
                    }
                }
            }
        }

        // build the Building
        let b: Building = new Building(longname, shortname, address);

        return b;
    }

    // get the tbody node containing the rooms
    static getTBody(json: JSON) {
        return this.getNodeByNodeName('tbody', json)
    }

    // recursively search the JSON for a nodeName property
    private static getNodeByNodeName (nodeName: string, node: any) { // node is JSON
        let reduce = [].reduce;

        function runner (result: any, node: any): any { // result, node are JSON
            if (result || !node) {
                return result;
            }

            return node.nodeName === nodeName && node || // target found?
                runner(null, node.childNodes) || // if not, search the children
                reduce.call(Object(node), runner, result) // iterate through each node's contents
        }

        let resultNode: any =  runner(null, node);
        return resultNode
    }

    static readRoomIndex(building: Building, json: JSON) {

    }
}