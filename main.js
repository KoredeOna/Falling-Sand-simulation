import { redraw, getMouse, setUpMouseListeners, createParticle, getRandomLocation, getParticle } from "./canvas.js";

const speedSlider = document.getElementById("speedRange");

/**
 * Called every frame to run the simulation
 */
function update() {
    // Get mouse position
    const {isDragging, mousePosition} = getMouse();
    // If dragging (clicked) and a valid mouse position then create a new particle
    if (isDragging && mousePosition) {
        createParticle(mousePosition);
    }

    // Get value^2 random particles and update them
    for (let i = 0; i <= (speedSlider.value * speedSlider.value); i++) {
        const {row, col} = getRandomLocation();
        const particle = getParticle(row, col);
        // Make sure particles exists
        if (!particle) {
            continue;
        } 

        particle.update(row, col);
    }
    // Redraw grid
    redraw();
}

setUpMouseListeners();
setInterval(update, 1);