
import test from "node:test";
import assert from "node:assert/strict";

import { BASE_POINT, CURVE } from "../js/config.js";

import {
    generateDataset,
    coordinateFrequency,
    bitDistribution,
    correlation,
    hammingDistance,
    avalancheAnalysis,
    summarizeStatistics
} from "../js/statistics.js";


const dataset = generateDataset(BASE_POINT, 8);


test("dataset contains eight points", () => {
    assert.equal(dataset.length, 8);
});


test("x coordinate frequencies are correct", () => {
    const frequencies = coordinateFrequency(
        dataset, "x", CURVE.p
    );

    assert.equal(frequencies[1], 2);
    assert.equal(frequencies[2], 2);
    assert.equal(frequencies[5], 2);
    assert.equal(frequencies[12], 2);

    assert.equal(
        frequencies.reduce((a, b) => a + b, 0),
        8
    );
});


test("bit distribution has correct total", () => {
    const bits = bitDistribution(dataset, "x");

    assert.equal(bits.zeros + bits.ones, 40);
    assert.equal(bits.zeros, 28);
    assert.equal(bits.ones, 12);
});


test("Hamming distance is correct", () => {
    assert.equal(
        hammingDistance("00101", "01101"),
        1
    );
});


test("correlations are valid", () => {
    const cx = correlation(dataset, "x");
    const cy = correlation(dataset, "y");

    assert.ok(cx >= -1 && cx <= 1);
    assert.ok(cy >= -1 && cy <= 1);
});


test("avalanche pairs differ by one input bit", () => {
    const results = avalancheAnalysis(dataset);

    assert.ok(results.length > 0);

    for (const item of results) {
        const difference =
            item.originalKey ^ item.changedKey;

        assert.equal(
            difference.toString(2).replaceAll("0", ""),
            "1"
        );
    }
});


test("statistical summary is consistent", () => {
    const summary = summarizeStatistics(dataset);

    assert.equal(summary.sampleSize, 8);
    assert.equal(summary.uniqueX, 4);
    assert.equal(summary.uniqueY, 8);

    assert.equal(summary.xOnesPercentage, 30);

    assert.ok(
        Math.abs(summary.correlationX) < 1e-12
    );

    assert.ok(summary.avalanchePairs > 0);
});

