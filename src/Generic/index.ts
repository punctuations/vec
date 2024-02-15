import { Vec3, Vector } from "../3D";
import { Vec2 } from '../2D';

export type GenericVector = number[] | Vector

// no inherit dimensions, could be 7D vector, etc.
export class Vec {
    private _vec: GenericVector;

    constructor(v: GenericVector) {
        this._vec = v;

        if (v.length === 3) {
            return new Vec3(v[0], v[1], v[2]);
        } else if (v.length === 2) {
            return new Vec2(v[0], v[1]);
        }

        Vec.prototype.dimensions = v.length;
    }

    dot(v: GenericVector) {

        if (v.length > this._vec.length) {
            throw new Error("Vector Input exceeded length of Vector dimensions")
        }

        for (let i = 0; i < v.length; i++) {
            this._vec[i] *= v[i];
        }

    }
}

export interface Vec {
	dimensions: number;
}