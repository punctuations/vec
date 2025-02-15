import { Vec2, Vec3 } from './src/mod.ts';
import { vec } from './src/mod.ts';

let v = new Vec3([1, 1, 1]); // => [1, 1, 1]

let v1 = v.clone().rotate(90, 0, 'deg');

v.dot(v1); // 0

// symbol.iterator test
const iter = [...v];
console.log(iter);

for (let i of v) {
	console.log(i);
}

v.between('i'); // î unit vector

v.segvec([1, 1, 1], [2, 2, 2]); // [1, 1, 1]

// projection 3D -> 2D
// https://math.stackexchange.com/questions/164700/how-to-transform-a-set-of-3d-vectors-into-a-2d-plane-from-a-view-point-of-anoth
let u = new Vec3([1, 1, 1]);

let span = vec().span(u); // span of u

vec().collinear(span, [2, 2, 2]); // true

let zeroVector = vec().zero(3); // [0, 0, 0]

// to implement
// vec().collinear([[1, 0], [0, 1]], [1, 6]); // true


// matrix
const m1 = vec().hstack([[1, 2, 3, 4], [4, 3, 2, 1]]);
const m2 = vec().vstack([[1, 2, 3, 4], [4, 3, 2, 1]]);

console.log(m1);
console.log(m2);

// vec utils

const x = vec().linspace(0, 1, 11); // [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]
console.log(x)
