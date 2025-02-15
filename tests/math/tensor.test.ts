import { beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Tensor } from "../../src/math/tensor.ts";

describe('Tensor', () => {
    let tensorA: Tensor;
    let tensorB: Tensor;

    beforeEach(() => {
        tensorA = new Tensor([[1, 2], [3, 4]]);
        tensorB = new Tensor([[5, 6], [7, 8]]);
    });

    it('should add two tensors correctly', () => {
        const result = tensorA.add(tensorB);
        expect(result.data).toEqual([[6, 8], [10, 12]]);
    });

    it('should subtract two tensors correctly', () => {
        const result = tensorA.subtract(tensorB);
        expect(result.data).toEqual([[-4, -4], [-4, -4]]);
    });

    it('should multiply two tensors correctly', () => {
        const result = tensorA.multiply(tensorB);
        expect(result.data).toEqual([[5, 12], [21, 32]]);
    });

    it('should divide two tensors correctly', () => {
        const result = tensorA.divide(tensorB);
        expect(result.data).toEqual([[0.2, 0.3333333333333333], [0.42857142857142855, 0.5]]);
    });

    it('should throw an error when adding tensors of different shapes', () => {
        const tensorC = new Tensor([[1, 2, 3], [4, 5, 6]]);
        expect(() => tensorA.add(tensorC)).toThrow('Tensors must have the same shape');
    });
});