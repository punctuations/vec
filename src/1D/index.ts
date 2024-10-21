import { Vec2 } from '../2D';
import { Vector } from '../3D';

export type Vector1Like = Vector | [number] | number;

export class Vec1 {
	private _coord: number;

	constructor(v: Vector1Like) {
		if (
			Array.isArray(v) ||
			v instanceof Float32Array ||
			v instanceof Float64Array
		) {
			this._coord = v[0];
		} else {
			this._coord = v;
		}

		Vec1.prototype.dimensions, (Vec1.prototype.length = 2);
		Vec1.prototype.isVector1 = true;
	}

	private _vectorize(v: Vector1Like): number {
		if (
			!(v instanceof Float32Array) &&
			!(v instanceof Float64Array) &&
			!Array.isArray(v)
		) {
			return v;
		} else {
			if (v.length == 1) {
				return v[0];
			} else {
				throw new Error('Unable to vectorize input: exceeded vector length.');
			}
		}
	}

	get coord(): number {
		return this._coord;
	}

	set coord(value: number) {
		this._coord = value;
	}

	/**
	 *
	 * Clone this vector into a new vector.
	 *
	 * @returns new Vec1
	 */
	clone() {
		return new Vec1(this._coord);
	}

	/**
	 *
	 * Copy the information of another vector to this vector.
	 *
	 * @param v Vector
	 * @returns Vec1
	 */
	copy(v: Vector1Like) {
		v = this._vectorize(v);

		this._coord = v;

		return this;
	}

	/**
	 *
	 * Zero all coordinates: [0]
	 *
	 * @returns Vec1
	 */
	zero() {
		this._coord = 0;

		return this;
	}

	/**
	 *
	 * Normalize to a unit vector.
	 *
	 * @returns Vec1
	 */
	unit() {
		this._coord = 1;

		return this;
	}

	/**
	 *
	 * Reverse the direction of all axis, such that it is anti-parallel
	 *
	 * @returns Vec1
	 */
	antiparalell() {
		this._coord = -this._coord;

		return this;
	}

	/**
	 *
	 * Reverse the direction of all axis, such that it is anti-parallel
	 * (alias function for {@link antiparallel})
	 *
	 * @returns Vec1
	 */
	oppose() {
		return this.antiparalell();
	}

	/**
	 *
	 * Max between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec1
	 */
	max(v1: Vector1Like) {
		v1 = this._vectorize(v1);

		this._coord = Math.max(this._coord, v1);

		return this;
	}

	/**
	 *
	 * Min between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec1
	 */
	min(v1: Vector1Like) {
		v1 = this._vectorize(v1);

		this._coord = Math.min(this._coord, v1);

		return this;
	}

	/**
	 *
	 * Round all coords up
	 *
	 * @returns Vec1
	 */
	ceil() {
		this._coord = Math.ceil(this._coord);

		return this;
	}

	/**
	 *
	 * Round all coords down
	 *
	 * @returns Vec1
	 */
	floor() {
		this._coord = Math.floor(this._coord);

		return this;
	}

	/**
	 *
	 * Round all coords
	 *
	 * @returns Vec1
	 */
	round() {
		this._coord = Math.round(this._coord);

		return this;
	}

	/**
	 *
	 * Clamp coordinates between two vectors, min and max.
	 *
	 * @param min minimum vector
	 * @param max maximum vector
	 * @returns Vec1
	 */
	clamp(min: Vector1Like, max: Vector1Like) {
		min = this._vectorize(min);
		max = this._vectorize(max);

		// assumes min < max, componentwise

		this._coord = Math.max(min, Math.min(max, this._coord));

		return this;
	}

	/**
	 *
	 * Add together two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec1
	 */
	add(v: Vector1Like) {
		v = this._vectorize(v);

		this._coord += v;

		return this;
	}

	/**
	 *
	 * Subtract two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec1
	 */
	sub(v: Vector1Like) {
		v = this._vectorize(v);

		this._coord -= v;

		return this;
	}

	/**
	 *
	 * Multiply this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec1
	 */
	multiply(s: number) {
		this._coord *= s;

		return this;
	}

	/**
	 *
	 * Divide this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec1
	 */
	divide(s: number) {
		this._coord /= s;

		return this;
	}

	/**
	 *
	 * Extend a 1D vector into a 2D space.
	 *
	 * @returns Vec2
	 */
	extend(): Vec2 {
		return new Vec2(this._coord, 0);
	}

	*[Symbol.iterator]() {
		yield this._coord;
	}
}

export interface Vec1 {
	dimensions: number;
	length: number;
	isVector1: boolean;

	/**
	 * Iterating through a Vector1 instance will yield its single component.
	 */
	[Symbol.iterator](): Iterator<number>;
}

// no backwards compat. for three as far as im aware.
