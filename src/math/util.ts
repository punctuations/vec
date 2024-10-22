import { VectorNLike } from '../N/index.ts';

// 2D, 3D, ..., nD
export const _vectorizeLike = (v: VectorNLike): number[] => {
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
		// nD
		if (v instanceof Float32Array || v instanceof Float64Array) {
			v = Array.from(v);
		}

		return v;
	}
};
