/**
 * Array utility methods to work with arrays.
 *
 * @param msg
 */

export default class ArrayUtil {

    /**
     * Computes the union of two input arrays
     * @param {Array<any>} a1 is the first input
     * @param {Array<any>} a2 is the second input
     * @returns {Array<any>} the union of a1 and a2
     */
    public static union(a1: Array<any>, a2: Array<any>): Array<any> {
        let result: Array<any> = [];

        if (a1.length > a2.length) {
            // a1 is longer; filter for diffs with a2
            result = a1.concat(a2.filter((n) => !a1.includes(n)))

        } else {
            // a2 may be longer; filter for diffs with a1
            result = a2.concat(a1.filter((n) => !a2.includes(n)))

        }

        return result;
    }

    /**
     * Computes the intersection of two input arrays
     * @param {Array<any>} a1 is the first input
     * @param {Array<any>} a2 is the second input
     * @returns {Array<any>} the intersection of a1 and a2
     */
    public static intersection(a1: Array<any>, a2: Array<any>): Array<any> {
        let result: Array<any> = [];

        result = a1.filter((n) => a2.includes(n));

        return result;
    }

}
