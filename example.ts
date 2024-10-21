import { Vec2, Vec3 } from './src';
import { vec } from './src';

let v = new Vec3([1, 1, 1]); // => [1, 1, 1]

let v1 = v.clone().rotate(90, 0, 'deg');

v.dot(v1); // 0

for (let i in v) {
	// test iteration
	console.log(i);
}

v.between('i'); // î unit vector

v.segvec([1, 1, 1], [2, 2, 2]); // [1, 1, 1]

// projection 3D -> 2D
// https://math.stackexchange.com/questions/164700/how-to-transform-a-set-of-3d-vectors-into-a-2d-plane-from-a-view-point-of-anoth
let u = new Vec3([1, 1, 1]);

let span = vec().span(u); // span of u

vec().colinear(span, [2, 2, 2]); // true

let zeroVector = vec().zero(3); // [0, 0, 0]

// to implement
// vec().colinear([[1, 0], [0, 1]], [1, 6]); // true
