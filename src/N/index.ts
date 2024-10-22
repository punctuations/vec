import { Vector2Like } from '../2D/index.ts';
import { Vector, Vector3Like } from '../3D/index.ts';

export type VectorNLike = Vector | Vector2Like | Vector3Like | number[];

export class VecN {
	private _coords: Float64Array;

	private _mag: number = 0;

	readonly dimensions: number;
	readonly length: number;
	readonly isVectorN: boolean = true;

	constructor();
	constructor(v: VectorNLike);
	constructor(v?: VectorNLike) {
		if (v === undefined) {
			this._coords = new Float64Array([0, 0, 0, 0]);
		} else if (typeof v == 'object' && ('x' in v || 'i' in v)) {
			if ('z' in v) {
				// 3D x, y, z logic
				this.dimensions = 3;

				v = this._vectorize([v.x, v.y, v.z]);
			} else if ('k' in v) {
				// 3D i, j, k logic
				this.dimensions = 3;

				v = this._vectorize([v.i, v.j, v.k]);
			} else {
				// 2D x, y logic
				this.dimensions = 2;

				v = this._vectorize([v.x, v.y]);
			}

			this._coords = new Float64Array(v);
		} else if (
			Array.isArray(v) ||
			v instanceof Float32Array ||
			v instanceof Float64Array
		) {
			this.dimensions = v?.length || 0;

			v = this._vectorize(v);

			this._coords = new Float64Array(v);
		} else {
			throw new Error('Invalid arguments provided for VecN constructor');
		}

		this._mag = this._calculateMagnitude();

		this.dimensions = v?.length || 0;
		this.length = this.dimensions;
	}

	private _calculateMagnitude(): number {
		return Math.hypot(...Array.from(this._coords));
	}

	private _vectorize(v: VectorNLike): Vector | number[] {
		if (
			!(v instanceof Float32Array) &&
			!(v instanceof Float64Array) &&
			!Array.isArray(v)
		) {
			if ('x' in v && 'y' in v && 'z'! in v) {
				// 2D
				return [v.x, v.y];
			} else {
				// 3D
				if ('x' in v && 'y' in v && 'z' in v) {
					return [v.x, v.y, v.z as number];
				} else if ('i' in v) {
					return [v.i, v.j, v.k];
				} else {
					throw new Error('Not a valid Vector input.');
				}
			}
		} else {
			if (v.length == this.dimensions) {
				return v;
			} else {
				throw new Error(
					'Unable to vectorize input: exceeded vector length.',
				);
			}
		}
	}

	get coords(): number[] {
		return Array.from(this._coords);
	}

	set coords(value: number[]) {
		this._coords = new Float64Array(value);

		this._mag = this._calculateMagnitude();
	}

	get mag(): number {
		return this._mag;
	}

	/**
	 * Alias for {@link coords}.
	 *
	 * @returns Array
	 */
	toArray(): number[] {
		return this.coords;
	}

	/**
	 * Clone this vector into a new vector.
	 *
	 * @returns new VecN
	 */
	clone() {
		return new VecN(this._coords);
	}

	/**
	 * Copy the information of another vector to this vector.
	 *
	 * @param v Vector
	 * @returns VecN
	 */
	copy(v: VectorNLike) {
		v = this._vectorize(v);

		this._coords = new Float64Array(v);

		return this;
	}

	/**
	 * Zero all coordinates: [0, 0, 0, ...]
	 *
	 * @returns VecN
	 */
	zero() {
		for (let i = 0; i < this.dimensions; i++) {
			this._coords[i] = 0;
		}

		return this;
	}

	/**
	 * Normalize to a unit vector.
	 *
	 * @returns VecN
	 */
	unit() {
		this._coords = this._coords.map((c) => c / this._mag);

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 *
	 * @returns VecN
	 */
	antiparalell() {
		for (let i = 0; i < this.dimensions; i++) {
			this._coords[i] = -this._coords[i];
		}

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 * (alias function for {@link antiparalell})
	 *
	 * @returns VecN
	 */
	oppose() {
		return this.antiparalell();
	}

	/**
	 * Performs the dot product against v0 and v1. (v0 ・ v1)
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	dot(v1: VectorNLike) {
		v1 = this._vectorize(v1);

		let s = [];

		for (let i = 0; i < this.dimensions; i++) {
			s.push(this._coords[i] * v1[i]);
		}

		return Math.hypot(...s);
	}

	// Cross product only exists in 3D and 7D, see: https://math.stackexchange.com/questions/720813/
	//
	// /**
	//  *
	//  * Calculate the nD determinate.
	//  *
	//  * @param v1 Vector
	//  * @returns Scalar value
	//  * @see https://math.stackexchange.com/questions/720813/
	//  */
	// cross(v1: VectorNLike) {
	//
	// }

	/**
	 * Find the distance between two vectors.
	 *
	 * @param v1 Vector
	 * @return distance
	 */
	distance(v1: VectorNLike): number {
		v1 = this._vectorize(v1);

		let s = [];

		for (let i = 0; i < this.dimensions; i++) {
			s.push(this._coords[i] ** 2 - v1[i] ** 2);
		}

		return Math.hypot(...s);
	}

	/**
	 * Max between two vectors
	 *
	 * @param v1 Vector
	 * @returns VecN
	 */
	max(v1: VectorNLike) {
		v1 = this._vectorize(v1);

		this._coords = this._coords.map((c, i) => Math.max(c, v1[i]));

		return this;
	}

	/**
	 * Min between two vectors
	 *
	 * @param v1 Vector
	 * @returns VecN
	 */
	min(v1: VectorNLike) {
		v1 = this._vectorize(v1);

		this._coords = this._coords.map((c, i) => Math.min(c, v1[i]));

		return this;
	}

	/**
	 * Round all coords up
	 *
	 * @returns VecN
	 */
	ceil() {
		this._coords = this._coords.map((c) => Math.ceil(c));

		return this;
	}

	/**
	 * Round all coords down
	 *
	 * @returns VecN
	 */
	floor() {
		this._coords = this._coords.map((c) => Math.floor(c));

		return this;
	}

	/**
	 * Round all coords
	 *
	 * @returns VecN
	 */
	round() {
		this._coords = this._coords.map((c) => Math.round(c));

		return this;
	}

	/**
	 * Clamp coordinates between two vectors, min and max.
	 *
	 * @param min minimum vector
	 * @param max maximum vector
	 * @returns VecN
	 */
	clamp(min: VectorNLike, max: VectorNLike) {
		min = this._vectorize(min);
		max = this._vectorize(max);

		// assumes min < max, componentwise

		this._coords = this._coords.map((c, i) =>
			Math.max(min[i], Math.min(max[i], c))
		);

		return this;
	}

	/**
	 * Segment vector between two points.
	 * From A to B
	 *
	 * @param A First Point
	 * @param B Second Point
	 * @returns VecN
	 */
	segvec(A: VectorNLike, B: VectorNLike) {
		A = this._vectorize(A);
		B = this._vectorize(B);

		this._coords = this._coords.map((_c, i) => B[i] - A[i]);

		return this;
	}

	/**
	 * Add together two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns VecN
	 */
	add(v: VectorNLike) {
		v = this._vectorize(v);

		this._coords = this._coords.map((c, i) => c + v[i]);

		return this;
	}

	/**
	 * Subtract two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns VecN
	 */
	sub(v: VectorNLike) {
		v = this._vectorize(v);

		this._coords = this._coords.map((c, i) => c - v[i]);

		return this;
	}

	/**
	 * Multiply this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns VecN
	 */
	multiply(s: number) {
		this._coords = this._coords.map((c) => c * s);

		return this;
	}

	/**
	 * Divide this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns VecN
	 */
	divide(s: number) {
		this._coords = this._coords.map((c) => c / s);

		return this;
	}

	*[Symbol.iterator]() {
		yield Array.from(this._coords);
	}
}

export interface VecN {
	readonly dimensions: number;
	readonly length: number;
	readonly isVectorN: boolean;

	/**
	 * Iterating through a VectorN instance will yield its components (x, y, ...) in the corresponding order.
	 */
	[Symbol.iterator](): Iterator<number[]>;
}
