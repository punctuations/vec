import { Vector2Like } from "../2D";
import { Vector3Like } from "../3D";
import { VecN, VectorNLike } from "../N";

export const vec = (domain?: [number, number], range?: [number, number]) => {
    domain = domain || [2, 3];
    range = range || [2, 3];

    return {
        add: (v1: Vector2Like | Vector3Like, v2: Vector2Like | Vector3Like) => {
            return new VecN(v1).add(v2);
        },
        sub: (v1: Vector2Like | Vector3Like, v2: Vector2Like | Vector3Like) => {
            return new VecN(v1).sub(v2);
        },
        multiply: (v1: Vector2Like | Vector3Like, s: number) => {
            return new VecN(v1).multiply(s);
        },
        divide: (v1: Vector2Like | Vector3Like, s: number) => {
            return new VecN(v1).divide(s);
        },
        /**
         * 
         * Span of a vector, or matrix.
         * 
         * @todo: accept matricies.
         * 
         * @param v vector or matrix
         * @returns VecN
         */
        span: (v: VectorNLike) => {
            // dont know what to return a span as, since span([[1, 0], [0, 1]]) is whole plane in R^2
            /* for matricies like [[0, 1], [1, 0]]
            *      two column vectors c_1[0, 1] + c_2[1, 0] = [c_1, c_2] which is all vectors in R^2
            *    
            *      so maybe make an array of [1, 2] for mod values to compare against for each row of vector in dimension R^n
            */

            return new VecN(v);
        },
        /**
         * 
         * Determines colinearity of two vectors. (Or if a vector is in the span of another vector)
         * 
         * @param span span, or vector to compare against
         * @param v vector
         * @returns boolean
         */
        colinear: (span: VectorNLike | VecN, v: VectorNLike) => {
            if ('x' in v) {
                v = 'z' in v ? [v.x, v.y, v.z] : [v.x, v.y];
            } else if ('i' in v) {
                v = [v.i, v.j, v.k];
            }

            if (span instanceof VecN) {
                span = span.coords;
            }

            if ('x' in span) {
                span = 'z' in span ? [span.x, span.y, span.z] : [span.x, span.y];
            } else if ('i' in span) {
                span = [span.i, span.j, span.k];
            }

            // check if v is in the span of supplied span
            if (span.length === v.length) return false;

            let t = span[0]/v[0];

            for (let i = 1; i < span.length; i++) {
                if (span[i]/v[i] === t) {
                    continue;
                } else {
                    return false;
                }
            }

            return true

        },
        zero: (n: number) => {
            // return a zero vector in R^n
            return new VecN(Array(n).fill(0));
        }
    };
};

// vec.span([v, u]);