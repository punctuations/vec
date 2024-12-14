import { Vec2, Vector2Like } from '../2D/index.ts';
import { Vec3, Vector, Vector3Like } from '../3D/index.ts';
import { Vec1 } from '../1D/index.ts';
import { VecN, VectorNLike } from '../N/index.ts';
import { _vectorizeLike } from './util.ts';

export const vec = (domain?: [number, number], range?: [number, number]) => {
	domain = domain || [2, 3];
	range = range || [2, 3];

	return {
		add: (
			v1: Vector2Like | Vector3Like,
			v2: Vector2Like | Vector3Like,
		): VecN => {
			// into a more managable form -- is inefficient taking up memory for no reason
			let u1 = _vectorizeLike(v1);
			let u2 = _vectorizeLike(v2);

			if (u1.length != u2.length) {
				throw new RangeError('Vectors must be same length');
			}
			return new VecN(u1).add(u2);
		},

		sub: (
			v1: Vector2Like | Vector3Like,
			v2: Vector2Like | Vector3Like,
		): VecN => {
			let u1 = _vectorizeLike(v1);
			let u2 = _vectorizeLike(v2);

			if (u1.length != u2.length) {
				throw new RangeError('Vectors must be same length');
			}
			return new VecN(v1).sub(v2);
		},

		multiply: (v1: Vector2Like | Vector3Like, s: number): VecN => {
			return new VecN(v1).multiply(s);
		},

		divide: (v1: Vector2Like | Vector3Like, s: number): VecN => {
			return new VecN(v1).divide(s);
		},

		fromArray: (
			buffer: number[] | Vector,
			stride: number,
		): (Vec1 | Vec2 | Vec3 | VecN)[] => {
			if (buffer.length % stride !== 0) {
				throw new Error(
					`Buffer length (${buffer.length}) is not divisible by stride (${stride}).`,
				);
			}

			const vecBuffer = [];

			for (let i = 0; i < buffer.length; i += stride) {
				if (stride == 1) vecBuffer.push(new Vec1(buffer[i]));
				else if (stride == 2) {
					vecBuffer.push(new Vec2(buffer[i], buffer[i + 1]));
				} else if (stride == 3) {
					vecBuffer.push(
						new Vec3(buffer[i], buffer[i + 1], buffer[i + 2]),
					);
				} else {
					const components = buffer.slice(i, i + stride);
					vecBuffer.push(new VecN(components));
				}
			}

			return vecBuffer;
		},

		/**
		 * Span of a vector, or matrix.
		 *
		 * @param v vector or matrix
		 * @returns VecN
		 */
		span: (v: VectorNLike): VecN => {
			// TODO(@punctuations): implement matrix span

			// dont know what to return a span as, since span([[1, 0], [0, 1]]) is whole plane in R^2
			/* for matricies like [[0, 1], [1, 0]]
			 *      two column vectors c_1[0, 1] + c_2[1, 0] = [c_1, c_2] which is all vectors in R^2
			 *
			 *      so maybe make an array of [1, 2] for mod values to compare against for each row of vector in dimension R^n
			 */

			return new VecN(v);
		},

		/**
		 * Determines collinearity of two vectors. (Or if a vector is in the span of another vector)
		 *
		 * @param span span, or vector to compare against
		 * @param v vector
		 * @returns boolean
		 */
		collinear: (span: VectorNLike | VecN, v: VectorNLike): boolean => {
			if (span instanceof VecN) span = span.coords;

			span = _vectorizeLike(span);
			v = _vectorizeLike(v);

			// Check if vectors have the same dimension
			if (span.length !== v.length) return false;

			// Find to see if either of vectors is a zero vector
			if (v.every((val) => val === 0)) return false; // v is a zero vector
			if (span.every((val) => val === 0)) return true; // span is a zero vector

			// there is atleast one non-zero element in v and span
			const index = v.findIndex((val) => val !== 0);
			const gcf = span[index] / v[index];

			for (let i = 0; i < span.length; i++) {
				if (i == index) continue; // Skip the reference element
				if (span[i] / v[i] !== gcf) return false; // if not all same ratio, then not collinear
				continue;
			}

			// vectors are collinear
			return true;
		},

		normalize: (vec: VectorNLike | VecN): VecN => {
			return new VecN(_normalize(vec));
		},

		zero: (n: number): VecN => {
			// return a zero vector in R^n
			return new VecN(Array(n).fill(0));
		},
	};
};

function _normalize(vec: VectorNLike | VecN): number[] {
	if (!(vec instanceof VecN)) vec = _vectorizeLike(vec);
	if (vec instanceof VecN) vec = vec.coords;

	// vec is Float32Array | Float64Array | number[] > 0
	const mag = Math.hypot(...vec);

	if (mag !== 0) return vec.map((c) => c / mag);

	return Array.from(vec);
}

// vec.span([v, u]);
