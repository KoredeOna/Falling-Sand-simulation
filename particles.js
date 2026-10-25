import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "purple";
        this.type = "sand";
    }

    swap(other) {
        // TODO make sand fall under the water
        return other.type == "water";
    }

    update(row, col) {
        let newRow = row + 1;

        if (!moveParticle(row, col, newRow, col)) {
            if (!moveParticle(row, col, row+1, col, this.swap)) {
                moveParticle(row, col, row, col-1, this.swap);
            }   
        }    
        
    }
}

export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        // Make water turn dirt into grass when it touches it
        if (getParticle(row+1, col)?.type == "dirt") {
            // Remove water and change dirt to grass
            setParticle(row+1, col, new Grass());
            setParticle(row, col, null);
            return;
        }
        // Try to move down
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        } 
        //trying to make water move upward
        if(getRandomInt(1,10) == 1){
            moveParticle(row, col, row-1, col, this.swap);
        }
        
        // Move left or right
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}
/**
 * Rock particle
 */
export class Stone extends Particle {
    constructor() {
        super(); // Call the constructor of the Particle class
        this.color = "gray";
        this.type = "stone";
    }
    
}
/**
 * Dirt particle
 */
export class Dirt extends Sand {
    constructor() {
        super(); // Call the constructor of the Sand class
        this.color = "brown";
        this.type = "dirt";
    }
    // No update or swap needed! It inherits from Sand.
}

/**
 * Grass
 */
export class Grass extends Sand {
    constructor() {
        super(); // Call the constructor of the Sand class
        this.color = "green";
        this.type = "Grass";
    }
    // No update or swap needed! It inherits from Sand.
}

/**
 * Fire
 */
export class Fire extends Particle {
    constructor() {
        super();
        this.color = "orangered";
        this.type = "fire";
        this.duration = 0;
        this.maxDuration = getRandomInt(30, 80);
    }

    update(row, col) {
        this.duration++;

        // Fire disappears after its lifetime
        if (this.duration >= this.maxDuration) {
            setParticle(row, col, null);
            return;
        }

        // Burn nearby wood
        const neighbors = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];

        for (const [nextRow, nextCol] of neighbors) {
            const particle = getParticle(nextRow, nextCol);

            if (particle?.type === "wood" && getRandomInt(1, 3) === 1) {
                setParticle(nextRow, nextCol, new Fire());
            }
        }

        // Fire rises upward
        if (!moveParticle(row, col, row - 1, col)) {
            // Try moving diagonally upward
            if (getRandomInt(0, 1) === 0) {
                moveParticle(row, col, row - 1, col - 1);
            } else {
                moveParticle(row, col, row - 1, col + 1);
            }
        }
    }
}

/**
 * Wood particle
 */

export class Wood extends Particle {
    constructor() {
        super();
        this.color = "saddlebrown";
        this.type = "wood";
    }

    update(row, col) {
        // Wood stays in place.
        // Fire can turn it into another Fire particle.
    }
}

/**
 * Steam particle
 */
export class Steam extends Particle {
    constructor() {
        super();
        this.color = "lightblue";
        this.type = "steam";
    }

    update(row, col) {
        // Small chance for steam to disappear
        if (getRandomInt(1, 100) === 1) {
            setParticle(row, col, null);
            return;
        }

        // Condense into water near the top
        if (row <= 1 && getRandomInt(1, 10) === 1) {
            setParticle(row, col, new Water());
            return;
        }

        // Try to rise
        if (!moveParticle(row, col, row - 1, col)) {
            // Try diagonally upward
            if (getRandomInt(0, 1) === 0) {
                moveParticle(row, col, row - 1, col - 1);
            } else {
                moveParticle(row, col, row - 1, col + 1);
            }
        }
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function checkParticleType(value) {
    if (value == "Sand") {
        return new Sand();
    } 
    else if(value == "Water"){
        return new Water();
    }else if (value == "Stone") { // Add this
        return new Stone();
    } else if (value == "Dirt") {   // Add this
        return new Dirt();
    }
    else if (value == "Grass") {   // Add this
        return new Grass();
    }
    else if (value == "Fire") {
        return new Fire();
    } 
    else if (value == "Wood") {
        return new Wood();
    } 
    else if (value == "Steam") {
        return new Steam();
    }

    return null;
}