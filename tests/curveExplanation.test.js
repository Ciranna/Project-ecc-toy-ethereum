
import test from "node:test";
import assert from "node:assert/strict";

import { BASE_POINT } from "../js/config.js";
import { explainPointAddition } from "../js/curveExplanation.js";
import { pointAdd } from "../js/ellipticCurve.js";


test("explains point doubling correctly", () => {
    const result = explainPointAddition(
        BASE_POINT,
        BASE_POINT
    );

    assert.equal(result.type, "doubling");
    assert.equal(result.inverse, 12);
    assert.equal(result.lambda, 2);

    assert.deepEqual(
        result.result,
        { x: 2, y: 10 }
    );
});


test("explains ordinary point addition", () => {
    const twoG = pointAdd(BASE_POINT, BASE_POINT);

    const result = explainPointAddition(twoG, BASE_POINT);

    assert.equal(result.type, "addition");

    assert.deepEqual(
        result.result,
        { x: 5, y: 9 }
    );
});


test("explains the identity element", () => {
    const result = explainPointAddition(null, BASE_POINT);

    assert.equal(result.type, "identity");
    assert.deepEqual(result.result, BASE_POINT);
});


test("explains opposite points", () => {
    const negativeG = { x: 1, y: 12 };

    const result = explainPointAddition(
        BASE_POINT,
        negativeG
    );

    assert.equal(result.type, "infinity");
    assert.equal(result.result, null);
});
