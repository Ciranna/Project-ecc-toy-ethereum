
import test from "node:test";
import assert from "node:assert/strict";

import { BASE_POINT, CURVE } from "../js/config.js";
import {
    pointAdd,
    scalarMultiply
} from "../js/ellipticCurve.js";

import { mod } from "../js/math.js";


function isOnCurve(P) {
    if (P === null) return true;

    const { p, a, b } = CURVE;

    return mod(P.y ** 2, p) ===
        mod(P.x ** 3 + a * P.x + b, p);
}


test("base point belongs to the curve", () => {
    assert.equal(isOnCurve(BASE_POINT), true);
});


test("point doubling computes 2G", () => {
    assert.deepEqual(
        pointAdd(BASE_POINT, BASE_POINT),
        { x: 2, y: 10 }
    );
});


test("point addition computes 3G", () => {
    const twoG = pointAdd(BASE_POINT, BASE_POINT);

    assert.deepEqual(
        pointAdd(twoG, BASE_POINT),
        { x: 5, y: 9 }
    );
});


test("scalar multiplication computes 6G", () => {
    const result = scalarMultiply(6, BASE_POINT);

    assert.deepEqual(
        result.publicKey,
        { x: 5, y: 8 }
    );

    assert.equal(result.steps.length, 6);
});


test("9G is the point at infinity", () => {
    const result = scalarMultiply(9, BASE_POINT);

    assert.equal(result.publicKey, null);
});


test("all generated points belong to the curve", () => {
    for (let k = 1; k <= 18; k++) {
        const result = scalarMultiply(k, BASE_POINT);

        assert.equal(
            isOnCurve(result.publicKey),
            true
        );
    }
});


test("point at infinity is the identity", () => {
    assert.deepEqual(
        pointAdd(BASE_POINT, null),
        BASE_POINT
    );

    assert.deepEqual(
        pointAdd(null, BASE_POINT),
        BASE_POINT
    );
});


test("scalar multiplication is periodic with order 9", () => {
    for (let k = 1; k <= 18; k++) {
        const first = scalarMultiply(k, BASE_POINT);
        const second = scalarMultiply(k + 9, BASE_POINT);

        assert.deepEqual(
            first.publicKey,
            second.publicKey
        );
    }
});

