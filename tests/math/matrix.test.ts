import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Matrix } from '../../src/math/matrix.ts';

describe('Matrix', () => {
    it('transpose', () => {
        const m = new Matrix([[1, 2, 3], [4, 5, 6]])
		expect(m.transpose()).toEqual(new Matrix([[1, 4], [2, 5], [3, 6]]));
	});
});