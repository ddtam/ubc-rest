import {Section} from "./Section";
import {Room} from "./Room";
import {isNull} from "util";

export class ApplyUtil {
    static max(entries: Array<Section|Room>, onKey: string): number {
        let maxSoFar: number = null;

        for (let e of entries) {
            if (isNull(maxSoFar)) {
                maxSoFar = e[onKey]

            } else {
                if (maxSoFar < e[onKey]) {
                    maxSoFar = e[onKey];
                }
            }
        }

        return maxSoFar;
    }

    static min(entries: Array<Section|Room>, onKey: string): number {
        let minSoFar: number = null;

        for (let e of entries) {
            if (isNull(minSoFar)) {
                minSoFar = e[onKey]

            } else {
                if (minSoFar > e[onKey]) {
                    minSoFar = e[onKey];
                }
            }
        }

        return minSoFar;
    }

    static avg(entries: Array<Section|Room>, onKey: string): number {
        let sum: number = 0;
        let count: number = 0;

        for (let e of entries) {
            sum += e[onKey];
            count++;
        }

        return (sum / count);
    }

    static count(entries: Array<Section|Room>, onKey: string): number {
        let seen: Array<any> = [];

        for (let e of entries) {
            if (!seen.includes(e[onKey])) {
                seen.push(e[onKey])
            }
        }

        return seen.length;
    }

    static sum(entries: Array<Section|Room>, onKey: string): number {
        let sum: number = 0;

        for (let e of entries) {
            sum += e[onKey];
        }

        return sum;
    }


}