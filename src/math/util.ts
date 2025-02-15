import {
	Vec1,
	Vec2,
	Vec3,
	VecN,
	Vector1Like,
	Vector2Like,
	Vector3Like,
} from '../mod.ts';
import { VectorNLike } from '../N/index.ts';

export type Vecs = Vec1 | Vec2 | Vec3 | VecN;
export type VectorLikes = VectorNLike | Vector1Like | Vector2Like | Vector3Like;
export type Vector = Vecs | VectorLikes;

// 2D, 3D, ..., nD
export const _vectorizeLike = (
	v: Vector,
): number[] => {
	if (typeof v == 'number') return new Array(v);

	if (
		!(v instanceof Float32Array) &&
		!(v instanceof Float64Array) &&
		!Array.isArray(v)
	) {
		if (
			v instanceof Vec1 || v instanceof Vec2 || v instanceof Vec3 ||
			v instanceof VecN
		) {
			if (typeof v.coords == 'number') return [v.coords];
			return v.coords;
		}
		// Vector1Like has no obj input
		if ('x' in v && 'y' in v && !('z' in v)) {
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
		// nD -- arraylike
		if (v instanceof Float32Array || v instanceof Float64Array) {
			v = Array.from(v);
		}

		return v;
	}
};

export const factorial = (
	n: number,
): number => (n <= 1 ? 1 : n * factorial(n - 1));
