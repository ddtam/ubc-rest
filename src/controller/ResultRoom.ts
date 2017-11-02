/**
 * This is the course section object that all rooms will be represented as
 */
import {Result} from "./nodes/Result";

export class ResultRoom extends Result{
    [index: string]: string | number;

    rooms_fullname?: string;
    rooms_shortname?: string;
    rooms_number?: string;
    rooms_name?: string;
    rooms_address?: string;
    rooms_lat?: number;
    rooms_lon?: number;
    rooms_seats?: number;
    rooms_type?: string;
    rooms_furniture?: string;
    rooms_href?: string;

}