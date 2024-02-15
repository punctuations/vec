import {Vec, Vec3} from './src';

let v = new Vec3([1, 1, 1]); // => [1, 1, 1]

let v1 = v.clone().rotate(90, 0, "deg");

v.dot(v1); // 0

for (let i in v) { // test iteration
    console.log(i)
}

v.between('i');


// projection 3D -> 2D
// https://math.stackexchange.com/questions/164700/how-to-transform-a-set-of-3d-vectors-into-a-2d-plane-from-a-view-point-of-anoth


