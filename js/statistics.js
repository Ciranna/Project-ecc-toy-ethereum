
import { scalarMultiply } from "./ellipticCurve.js";

// Generate the dataset for statistical analysis
export function generateDataset(G, maxKey = 8) {
    const dataset = [];

    for (let k = 1; k <= maxKey; k++) {
        const { publicKey } = scalarMultiply(k, G);

        if (publicKey !== null) {
            dataset.push({
                k,
                x: publicKey.x,
                y: publicKey.y
            });
        }
    }

    return dataset;
}


// Count the frequency of each coordinate value
export function coordinateFrequency(dataset, coordinate, p) {
    const frequencies = Array(p).fill(0);

    for (const point of dataset) {
        frequencies[point[coordinate]]++;
    }

    return frequencies;
}


// Count zero and one bits
export function bitDistribution(dataset, coordinate, width = 5) {
    let zeros = 0;
    let ones = 0;

    for (const point of dataset) {
        const binary = point[coordinate]
            .toString(2)
            .padStart(width, "0");

        for (const bit of binary) {
            if (bit === "0") zeros++;
            else ones++;
        }
    }

    return { zeros, ones };
}


// Pearson correlation coefficient
export function correlation(dataset, coordinate) {
    const n = dataset.length;

    const meanK = dataset.reduce(
        (sum, point) => sum + point.k, 0
    ) / n;

    const meanCoordinate = dataset.reduce(
        (sum, point) => sum + point[coordinate], 0
    ) / n;

    let numerator = 0;
    let denominatorK = 0;
    let denominatorCoordinate = 0;

    for (const point of dataset) {
        const dk = point.k - meanK;
        const dc = point[coordinate] - meanCoordinate;

        numerator += dk * dc;
        denominatorK += dk ** 2;
        denominatorCoordinate += dc ** 2;
    }

    const denominator = Math.sqrt(
        denominatorK * denominatorCoordinate
    );

    return denominator === 0
        ? null
        : numerator / denominator;
}


// Hamming distance between two binary strings
export function hammingDistance(a, b) {
    if (a.length !== b.length) {
        throw new Error("Binary strings must have equal length");
    }

    let distance = 0;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) distance++;
    }

    return distance;
}


// Explore output changes after flipping one input bit
export function avalancheAnalysis(dataset, width = 5) {
    const byKey = new Map(
        dataset.map(point => [point.k, point])
    );

    const results = [];

    for (const point of dataset) {
        for (let bit = 0; bit < 4; bit++) {
            const changedKey = point.k ^ (1 << bit);

            // Analyze each unordered pair only once
            if (changedKey <= point.k) continue;

            const other = byKey.get(changedKey);
            if (!other) continue;

            const originalBits =
                point.x.toString(2).padStart(width, "0") +
                point.y.toString(2).padStart(width, "0");

            const changedBits =
                other.x.toString(2).padStart(width, "0") +
                other.y.toString(2).padStart(width, "0");

            const changed = hammingDistance(
                originalBits,
                changedBits
            );

            results.push({
                originalKey: point.k,
                changedKey,
                changedBits: changed,
                totalBits: width * 2,
                percentage: (changed / (width * 2)) * 100
            });
        }
    }

    return results;
}


export function summarizeStatistics(dataset, width = 5) {
    if (dataset.length === 0) {
        throw new Error("Dataset cannot be empty");
    }

    const xBits = bitDistribution(dataset, "x", width);
    const yBits = bitDistribution(dataset, "y", width);

    const avalanche = avalancheAnalysis(dataset, width);

    const averageAvalanche = avalanche.length === 0
        ? null
        : avalanche.reduce(
            (sum, item) => sum + item.percentage,
            0
        ) / avalanche.length;

    return {
        sampleSize: dataset.length,

        uniqueX: new Set(
            dataset.map(point => point.x)
        ).size,

        uniqueY: new Set(
            dataset.map(point => point.y)
        ).size,

        xOnesPercentage:
            (xBits.ones / (dataset.length * width)) * 100,

        yOnesPercentage:
            (yBits.ones / (dataset.length * width)) * 100,

        correlationX: correlation(dataset, "x"),
        correlationY: correlation(dataset, "y"),

        avalanchePairs: avalanche.length,
        averageAvalanchePercentage: averageAvalanche
    };
}

