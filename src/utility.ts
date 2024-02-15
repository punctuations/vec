import { GenericVector } from "./Generic";

export abstract class VecAbstract {
	private _vec: GenericVector = new Float32Array(0);

	/**
	 * oppose the vector (i.e. antiparallel)
	 */
	oppose() {
        for (let i = 0; i < this._vec.length; i++) {
            this._vec[i] = -this._vec[i];
		}
		
		return this;
	};

	/**
	 * alias for `oppose`
	 */
	antiparallel() {
		this.oppose();
	}

	zero() {
		/* Just get length of array and make a new array with only zeros rather than using for-loop */
		for (let i = 0; i < this._vec.length; i++) {
			this._vec[i] = 0;
		}

		return this;
	}

	min(v: GenericVector) {
		if (v.length != this._vec.length) {
            throw new Error("Vector Input and length of Vector dimensions do not match")
        }

        for (let i = 0; i < v.length; i++) {
            this._vec[i] = Math.min(this._vec[i], v[i]);
		}
		
		return this;
	}

	max(v: GenericVector) {
		if (v.length != this._vec.length) {
            throw new Error("Vector Input and length of Vector dimensions do not match")
        }

        for (let i = 0; i < v.length; i++) {
            this._vec[i] = Math.max(this._vec[i], v[i]);
		}
		
		return this;
	}
}