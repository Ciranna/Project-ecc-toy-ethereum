
import test from "node:test";
import assert from "node:assert/strict";

import {
    mod,
    modInverse
} from "../js/math.js";


test("mod returns positive residues", () => {
    assert.equal(mod(20, 17), 3);
    assert.equal(mod(-7, 17), 10);
    assert.equal(mod(34, 17), 0);
});


test("modInverse computes correct inverses", () => {
    assert.equal(modInverse(3, 17), 6);
    assert.equal(modInverse(10, 17), 12);
    assert.equal(modInverse(4, 17), 13);
});


test("modInverse rejects zero", () => {
    assert.throws(() => modInverse(0, 17));
});


test("inverse satisfies multiplicative identity", () => {
    for (let n = 1; n < 17; n++) {
        const inverse = modInverse(n, 17);

        assert.equal(
            mod(n * inverse, 17),
            1
        );
    }
});
