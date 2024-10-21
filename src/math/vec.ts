import { Vector2Like } from '../2D';
import { Vector3Like } from '../3D';
import { VecN, VectorNLike } from '../N';
import { _vectorizeLike } from './util';

export const vec = (domain?: [number, number], range?: [number, number]) => {
	domain = domain || [2, 3];
	range = range || [2, 3];

	return {
		add: (v1: Vector2Like | Vector3Like, v2: Vector2Like | Vector3Like) => {
			// into a more managable form -- is inefficient taking up memory for no reason
			let u1 = _vectorizeLike(v1);
			let u2 = _vectorizeLike(v2);

			if (u1.length != u2.length)
				return new RangeError('Vectors must be same length');
			return new VecN(u1).add(u2);
		},
		sub: (v1: Vector2Like | Vector3Like, v2: Vector2Like | Vector3Like) => {
			let u1 = _vectorizeLike(v1);
			let u2 = _vectorizeLike(v2);

			if (u1.length != u2.length)
				return new RangeError('Vectors must be same length');
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
			if (span instanceof VecN) span = span.coords;

			span = _vectorizeLike(span);
			v = _vectorizeLike(v);

			// Check if vectors have the same dimension
			if (span.length !== v.length) return false;

			// Find to see if either of vectors is a zero vector
			if (v.every(val => val === 0)) return false; // v is a zero vector
			if (span.every(val => val === 0)) return true; // span is a zero vector

			// there is atleast one non-zero element in v and span
			const index = v.findIndex(val => val !== 0);
			const gcf = span[index] / v[index];

			for (let i = 0; i < span.length; i++) {
				if (i == index) continue; // Skip the reference element
				if (span[i] / v[i] !== gcf) return false; // if not all same ratio, then not collinear
				continue;
			}

			// vectors are collinear
			return true;
		},
		normalize: (vec: VectorNLike) => {
			return _normalize(vec);
		},
		zero: (n: number) => {
			// return a zero vector in R^n
			return new VecN(Array(n).fill(0));
		},
	};
};

function _normalize(vec: VectorNLike | VecN): number[] {
	// TODO
	return [];
}

// vec.span([v, u]);
