
import { explainPointAddition } from "./curveExplanation.js";
import { BASE_POINT, CURVE } from "./config.js";

export function displayCurve(curve, basePoint) {
    const equation = document.getElementById(
        "curve-equation"
    );

    const point = document.getElementById(
        "base-point"
    );

    equation.textContent =
        `y² = x³ + ${curve.a}x + ${curve.b} (mod ${curve.p})`;

    point.textContent =
        `Base Point G = (${basePoint.x}, ${basePoint.y})`;
}


export function getPrivateKey() {
    const input = document.getElementById("private-key");

    if (input.value.trim() === "") {
        throw new Error("Please enter a private key.");
    }

    const k = Number(input.value);

    if (!Number.isSafeInteger(k) || k < 1 || k > 8) {
        throw new Error(
            "Private key must be an integer between 1 and 8."
        );
    }

    return k;
}


export function displayResult(result) {
    const section = document.getElementById(
        "results-section"
    );

    const tbody = document.getElementById(
        "steps-body"
    );

    const publicKey = document.getElementById(
        "public-key-result"
    );

    tbody.replaceChildren();

    for (const step of result.steps) {
        const row = document.createElement("tr");

        const stepCell = document.createElement("td");
        stepCell.textContent = `${step.multiplier}G`;

        const pointCell = document.createElement("td");

        const point = step.point;

        pointCell.textContent = point === null
            ? "Point at infinity"
            : `(${point.x}, ${point.y})`;

        row.append(stepCell, pointCell);
        tbody.appendChild(row);
    }

    const Q = result.publicKey;

    publicKey.textContent = Q === null
        ? "Point at infinity"
        : `(${Q.x}, ${Q.y})`;

    section.hidden = false;
}


export function displayError(message) {
    document.getElementById(
        "error-message"
    ).textContent = message;
}


export function clearError() {
    displayError("");
}


function renderFrequency(containerId, frequencies) {
    const container = document.getElementById(containerId);
    container.replaceChildren();

    const max = Math.max(...frequencies, 1);

    frequencies.forEach((frequency, value) => {
        const row = document.createElement("div");
        row.className = "frequency-row";

        const label = document.createElement("span");
        label.textContent = value;

        const bar = document.createElement("div");
        bar.className = "frequency-bar";
        bar.style.width = `${(frequency / max) * 100}%`;

        const count = document.createElement("span");
        count.textContent = frequency;

        row.append(label, bar, count);
        container.appendChild(row);
    });
}


export function displayStatistics(stats) {
    renderFrequency("x-frequency", stats.xFrequency);
    renderFrequency("y-frequency", stats.yFrequency);

    const bitResults = document.getElementById("bit-results");

    bitResults.textContent =
        `X: ${stats.xBits.ones} ones, ${stats.xBits.zeros} zeros. ` +
        `Y: ${stats.yBits.ones} ones, ${stats.yBits.zeros} zeros.`;

    const correlations = document.getElementById(
        "correlation-results"
    );

    const formatCorrelation = value =>
        value === null ? "undefined" : value.toFixed(4);

    correlations.textContent =
        `Correlation(k, x): ${formatCorrelation(stats.correlationX)} | ` +
        `Correlation(k, y): ${formatCorrelation(stats.correlationY)}`;

    const avalanche = document.getElementById(
        "avalanche-results"
    );

    avalanche.replaceChildren();

    const table = document.createElement("table");
    const header = document.createElement("tr");

    for (const name of ["k", "Modified k", "Changed bits", "Percentage"]) {
        const th = document.createElement("th");
        th.textContent = name;
        header.appendChild(th);
    }

    table.appendChild(header);

    for (const item of stats.avalanche) {
        const row = document.createElement("tr");

        const values = [
            item.originalKey,
            item.changedKey,
            `${item.changedBits}/${item.totalBits}`,
            `${item.percentage.toFixed(1)}%`
        ];

        for (const value of values) {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        }

        table.appendChild(row);
    }

    avalanche.appendChild(table);

    document.getElementById(
        "statistics-results"
    ).hidden = false;
}


// State of the step-by-step visualizer
let visualizationSteps = [];
let currentStepIndex = 0;


// Initialize visualization with new calculation
export function initializeStepVisualizer(steps) {
    visualizationSteps = steps;
    currentStepIndex = 0;

    updateStepVisualizer();
}


// Show the current step
function updateStepVisualizer() {
    const counter = document.getElementById("step-counter");
    const operation = document.getElementById("step-operation");
    const pointDisplay = document.getElementById("step-point");

    const previousButton = document.getElementById("previous-step");
    const nextButton = document.getElementById("next-step");

    const total = visualizationSteps.length;

    counter.textContent =
        `Step ${currentStepIndex} of ${total}`;

    if (currentStepIndex === 0) {
        operation.textContent = "Press Next Step to begin.";
        pointDisplay.textContent = "Ready";
    } else {
        const step = visualizationSteps[currentStepIndex - 1];

        operation.textContent = currentStepIndex === 1
            ? "Start from the base point G"
            : `${currentStepIndex - 1}G + G = ${currentStepIndex}G`;

        const point = step.point;

        pointDisplay.textContent = point === null
            ? "Point at infinity"
            : `${step.multiplier}G = (${point.x}, ${point.y})`;
    }

    updateMathExplanation();

    previousButton.disabled = currentStepIndex === 0;
    nextButton.disabled = currentStepIndex === total;
}


// Advance one step
export function nextStep() {
    if (currentStepIndex < visualizationSteps.length) {
        currentStepIndex++;
        updateStepVisualizer();
    }
}


// Go back one step
export function previousStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        updateStepVisualizer();
    }
}


// Restart the visualization
export function resetSteps() {
    currentStepIndex = 0;
    updateStepVisualizer();
}



function updateMathExplanation() {
    const container = document.getElementById(
        "math-explanation"
    );

    if (currentStepIndex === 0) {
        container.hidden = true;
        return;
    }

    const current = visualizationSteps[currentStepIndex - 1];

    const previousPoint = currentStepIndex === 1
        ? null
        : visualizationSteps[currentStepIndex - 2].point;

    const explanation = explainPointAddition(
        previousPoint,
        BASE_POINT
    );

    container.hidden = false;

    const type = document.getElementById("operation-type");
    const slopeFormula = document.getElementById("slope-formula");
    const slopeCalculation = document.getElementById("slope-calculation");
    const xCalculation = document.getElementById("x-calculation");
    const yCalculation = document.getElementById("y-calculation");

    if (explanation.type === "identity" ||
        explanation.type === "infinity") {

        type.textContent = explanation.description;

        slopeFormula.textContent = "";
        slopeCalculation.textContent = "";
        xCalculation.textContent = "";
        yCalculation.textContent = "";

        return;
    }

    const e = explanation;

    type.textContent = e.type === "doubling"
        ? "Point Doubling (P + P)"
        : "Point Addition (P + Q)";

    slopeFormula.textContent =
        e.type === "doubling"
            ? "λ = (3x₁² + a) / (2y₁) mod p"
            : "λ = (y₂ - y₁) / (x₂ - x₁) mod p";

    slopeCalculation.textContent =
        `λ = (${e.numerator} × ${e.inverse}) mod ${CURVE.p} = ${e.lambda}` +
        ` (inverse of ${e.normalizedDenominator} is ${e.inverse})`;

    xCalculation.textContent =
        `x₃ = (${e.lambda}² - ${e.P.x} - ${e.Q.x}) mod ${CURVE.p}` +
        ` = ${e.result.x}`;

    yCalculation.textContent =
        `y₃ = (${e.lambda} × (${e.P.x} - ${e.result.x}) - ${e.P.y})` +
        ` mod ${CURVE.p} = ${e.result.y}`;
}


export function displayStatisticalSummary(summary) {
    const setText = (id, value) => {
        document.getElementById(id).textContent = value;
    };

    setText("summary-sample", summary.sampleSize);

    setText("summary-unique-x", summary.uniqueX);

    setText("summary-unique-y", summary.uniqueY);

    setText(
        "summary-x-bits",
        `${summary.xOnesPercentage.toFixed(2)}%`
    );

    setText(
        "summary-y-bits",
        `${summary.yOnesPercentage.toFixed(2)}%`
    );

    const avalanche = summary.averageAvalanchePercentage;

    setText(
        "summary-avalanche",
        avalanche === null
            ? "N/A"
            : `${avalanche.toFixed(2)}%`
    );
}

