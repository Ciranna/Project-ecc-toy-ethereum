
import {
    CURVE,
    BASE_POINT,
    DEFAULT_PRIVATE_KEY
} from "./config.js";

import {
    scalarMultiply
} from "./ellipticCurve.js";

import {
    displayCurve,
    getPrivateKey,
    displayResult,
    displayError,
    clearError,
    initializeStepVisualizer,
    nextStep,
    previousStep,
    resetSteps
} from "./ui.js";


import {
    generateDataset,
    coordinateFrequency,
    bitDistribution,
    correlation,
    avalancheAnalysis
} from "./statistics.js";

import { displayStatistics } from "./ui.js";



// Initialize application
function init() {
    displayCurve(CURVE, BASE_POINT);

    const input = document.getElementById(
        "private-key"
    );

    input.value = DEFAULT_PRIVATE_KEY;

    const form = document.getElementById("key-form");

    form.addEventListener("submit", handleGenerateKey);


    document.getElementById("analyze-button")
        .addEventListener("click", handleStatistics);

    
    document.getElementById("next-step")
        .addEventListener("click", nextStep);

    document.getElementById("previous-step")
        .addEventListener("click", previousStep);

    document.getElementById("reset-steps")
        .addEventListener("click", resetSteps);

}


// Handle public key generation
function handleGenerateKey(event) {
    event.preventDefault();

    clearError();

    try {
        const k = getPrivateKey();

        const result = scalarMultiply(k, BASE_POINT);

        displayResult(result);

        initializeStepVisualizer(result.steps);

    } catch (error) {
        document.getElementById(
            "results-section"
        ).hidden = true;

        displayError(error.message);
    }
}


function handleStatistics() {
    const dataset = generateDataset(BASE_POINT, 8);

    const stats = {
        xFrequency: coordinateFrequency(
            dataset, "x", CURVE.p
        ),

        yFrequency: coordinateFrequency(
            dataset, "y", CURVE.p
        ),

        xBits: bitDistribution(dataset, "x"),

        yBits: bitDistribution(dataset, "y"),

        correlationX: correlation(dataset, "x"),

        correlationY: correlation(dataset, "y"),

        avalanche: avalancheAnalysis(dataset)
    };

    displayStatistics(stats);
}



// Start application
init();
