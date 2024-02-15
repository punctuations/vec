import { Vector } from ".";

export class Vec3List {
    buffer: Vector;

    constructor(v: Vector | number[]) {

        if (Array.isArray(v)) {
            v = new Float64Array(v)
        }

        this.buffer = v;
        
    }

}