import { Vec2, Vector2Like } from '../2D/index.ts';
import { Vec3, Vector3Like, VectorF } from '../3D/index.ts';
import { Vec1 } from '../1D/index.ts';
import { VecN, VectorNLike } from '../N/index.ts';
import { _vectorizeLike, type Vector } from './util.ts';
import { Matrix } from './matrix.ts';

type Span = { basis: (VecN | Vec1 | Vec2 | Vec3)[]; dimension: number };

export const vec = () => {
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
			buffer: number[] | VectorF,
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
		span: (
			v: VectorNLike | Matrix,
		): Span => {
			if (v instanceof Matrix) {
				// would be nice to calculate basis on the fly
				//TODO(@punctuations)
				const basis = v.col();

				return { basis, dimension: basis.length };
			} else {
				return { basis: [new VecN(v)], dimension: 1 };
			}
		},

		/**
		 * Determines collinearity of two vectors. (Or if a vector is in the span of another vector)
		 *
		 * @param span span, or vector to compare against
		 * @param v vector
		 * @returns boolean
		 */
		collinear: (
			span: VectorNLike | VecN | Span,
			v: VectorNLike,
		): boolean => {
			if (
				span instanceof VecN || span instanceof Vec1 ||
				span instanceof Vec2 || span instanceof Vec3
			) span = span.coords;
			else if (
				typeof span === 'object' && !Array.isArray(span) &&
				span !== null
			) {
				if (!('basis' in span)) {
					throw new TypeError(`Span (${span}) must include basis.`);
				}

				span = span.basis.map((v) =>
					v instanceof VecN ? v : v.toVecN()
				).reduce(
					(acc, current) => acc.add(current),
					span.basis[0] instanceof VecN
						? span.basis[0]
						: span.basis[0].toVecN(),
				).coords;
			}

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

		/**
		 * Linearly spaced vector/array.
		 *
		 * @param start number to start from
		 * @param stop number to stop at
		 * @param num amount of numbers
		 * @returns VecN
		 */
		linspace: (start: number, stop: number, num: number): VecN => {
			const step = (stop - start) / (num - 1);
			const vec = Array(num).fill(start).map((val, i) => val + i * step);

			return new VecN(vec);
		},

		// vstack
		vstack: (v: Vector[]): Matrix => {
			// v is an array of vectors

			return new Matrix(v.map((vec) => {
				vec = _vectorizeLike(vec);
				return vec;
			}));
		},

		// hstack
		hstack: (v: Vector[]): Matrix => {
			// v is an array of vectors

			const stack = v.map((vec) => {
				vec = _vectorizeLike(vec);
				return vec;
			});

			// vstack matrix then transpose
			return new Matrix(stack).T;
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
