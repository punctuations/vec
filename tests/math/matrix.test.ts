import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Matrix } from '../../src/math/matrix.ts';
import { Vec2 } from '../../src/mod.ts';

describe('Matrix', () => {
    it('transpose', () => {
        const m = new Matrix([[1, 2, 3], [4, 5, 6]])
		expect(m.transpose()).toEqual(new Matrix([[1, 4], [2, 5], [3, 6]]));
    });
    
    it('column space', () => {
        const m = new Matrix([[1, 3], [2, 4]]);

        const col = m.col();

        expect(col).toEqual([new Vec2(1, 3), new Vec2(2, 4)]);
    });


    it('range', () => {
        const m = new Matrix([[1, 3], [2, 4]]);

        const range = m.range();

        expect(range).toEqual([new Vec2(1, 2), new Vec2(3, 4)]);
    });
    // it('inverse', () => {
    //     const m = new Matrix([[1, 2], [3, 4]]);
    //     const inverse = m.clone().inverse();

    //     m.multiply(inverse);

    //     expect(m).toEqual(new Matrix([[1, 0], [0, 1]]));
    // })
});