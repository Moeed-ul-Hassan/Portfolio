/**
 * Matrix Digital Rain Effect for Portfolio Website
 * Creates the iconic falling green characters background
 */

class MatrixRain {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`Canvas element with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.animationId = null;
        
        // Default configuration
        this.config = {
            fontSize: 14,
            columns: 0,
            dropSpeed: 1,
            density: 0.95,
            color: '#00ff00',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?',
            glitchChance: 0.01,
            fadeSpeed: 0.05,
            ...options
        };
        
        this.drops = [];
        this.lastTime = 0;
        this.fps = 30;
        this.fpsInterval = 1000 / this.fps;
        
        this.init();
    }

    /**
     * Initialize the matrix effect
     */
    init() {
        this.setupCanvas();
        this.createDrops();
        this.setupEventListeners();
        this.start();
    }

    /**
     * Setup canvas dimensions and properties
     */
    setupCanvas() {
        const updateCanvasSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.config.columns = Math.floor(this.canvas.width / this.config.fontSize);
            this.createDrops();
        };

        updateCanvasSize();
        
        // Update canvas size on window resize
        window.addEventListener('resize', updateCanvasSize);
        
        // Set canvas styles
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-10';
        this.canvas.style.pointerEvents = 'none';
    }

    /**
     * Create initial drops array
     */
    createDrops() {
        this.drops = [];
        for (let i = 0; i < this.config.columns; i++) {
            this.drops[i] = {
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                opacity: Math.random(),
                character: this.getRandomCharacter(),
                glitch: false
            };
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Handle window focus/blur
        window.addEventListener('blur', () => this.pause());
        window.addEventListener('focus', () => this.resume());
    }

    /**
     * Get random character from character set
     */
    getRandomCharacter() {
        return this.config.characters[
            Math.floor(Math.random() * this.config.characters.length)
        ];
    }

    /**
     * Start the matrix animation
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();
    }

    /**
     * Pause the animation
     */
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Resume the animation
     */
    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }

    /**
     * Stop the animation completely
     */
    stop() {
        this.pause();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Main animation loop
     */
    animate(currentTime = performance.now()) {
        if (!this.isRunning) return;

        this.animationId = requestAnimationFrame((time) => this.animate(time));

        // Control frame rate
        const elapsed = currentTime - this.lastTime;
        if (elapsed < this.fpsInterval) return;

        this.lastTime = currentTime - (elapsed % this.fpsInterval);
        
        this.draw();
    }

    /**
     * Draw the matrix effect
     */
    draw() {
        // Create fade effect
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text properties
        this.ctx.font = `${this.config.fontSize}px monospace`;
        this.ctx.textAlign = 'center';

        // Draw each column
        for (let i = 0; i < this.config.columns; i++) {
            this.drawColumn(i);
        }
    }

    /**
     * Draw individual column
     */
    drawColumn(columnIndex) {
        const drop = this.drops[columnIndex];
        const x = columnIndex * this.config.fontSize + this.config.fontSize / 2;

        // Apply glitch effect randomly
        if (Math.random() < this.config.glitchChance) {
            drop.glitch = !drop.glitch;
            drop.character = this.getRandomCharacter();
        }

        // Set color with opacity
        if (drop.glitch) {
            this.ctx.fillStyle = `rgba(255, 0, 0, ${drop.opacity})`;
        } else {
            const [r, g, b] = this.hexToRgb(this.config.color);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drop.opacity})`;
        }

        // Draw character
        this.ctx.fillText(drop.character, x, drop.y);

        // Update drop position
        drop.y += drop.speed * this.config.dropSpeed;

        // Reset drop when it reaches bottom
        if (drop.y > this.canvas.height) {
            this.resetDrop(drop);
        }

        // Randomly reset drops to create varying column lengths
        if (Math.random() > this.config.density) {
            this.resetDrop(drop);
        }

        // Update opacity for fade effect
        drop.opacity = Math.max(0, drop.opacity - this.config.fadeSpeed);
        if (drop.opacity <= 0) {
            drop.opacity = 1;
            drop.character = this.getRandomCharacter();
        }
    }

    /**
     * Reset a drop to the top
     */
    resetDrop(drop) {
        drop.y = -this.config.fontSize;
        drop.speed = Math.random() * 3 + 1;
        drop.opacity = 1;
        drop.character = this.getRandomCharacter();
        drop.glitch = false;
    }

    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 255, 0];
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.config.columns = Math.floor(this.canvas.width / this.config.fontSize);
        this.createDrops();
    }

    /**
     * Toggle animation
     */
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Set matrix intensity
     */
    setIntensity(intensity) {
        // intensity should be between 0 and 1
        const clampedIntensity = Math.max(0, Math.min(1, intensity));
        
        this.updateConfig({
            density: 0.9 + (clampedIntensity * 0.09),
            dropSpeed: 0.5 + (clampedIntensity * 1.5),
            fadeSpeed: 0.02 + (clampedIntensity * 0.08)
        });
    }

    /**
     * Set matrix color
     */
    setColor(color) {
        this.updateConfig({ color });
    }

    /**
     * Add matrix text effect
     */
    addTextEffect(text, x, y, duration = 3000) {
        const textEffect = {
            text,
            x,
            y,
            opacity: 1,
            startTime: performance.now(),
            duration
        };

        // Add temporary text overlay
        const drawText = (currentTime) => {
            const elapsed = currentTime - textEffect.startTime;
            const progress = elapsed / textEffect.duration;

            if (progress < 1) {
                textEffect.opacity = 1 - progress;
                
                this.ctx.save();
                this.ctx.font = `${this.config.fontSize * 2}px monospace`;
                this.ctx.fillStyle = `rgba(0, 255, 255, ${textEffect.opacity})`;
                this.ctx.fillText(textEffect.text, textEffect.x, textEffect.y);
                this.ctx.restore();

                requestAnimationFrame(drawText);
            }
        };

        requestAnimationFrame(drawText);
    }
}

/**
 * Matrix Code Rain - Alternative implementation with more features
 */
class MatrixCodeRain {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.streams = [];
        this.isActive = true;
        
        this.settings = {
            fontSize: 12,
            speed: 1,
            density: 20,
            color: '#0f0',
            highlightColor: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            characters: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
            minStreamLength: 10,
            maxStreamLength: 30,
            ...options
        };
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createStreams();
        this.animate();
    }

    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createStreams();
        };
        
        resize();
        window.addEventListener('resize', resize);
    }

    createStreams() {
        this.streams = [];
        const columns = Math.floor(this.canvas.width / this.settings.fontSize);
        
        for (let i = 0; i < columns; i++) {
            if (Math.random() < this.settings.density / 100) {
                this.createStream(i * this.settings.fontSize);
            }
        }
    }

    createStream(x) {
        const length = Math.floor(
            Math.random() * (this.settings.maxStreamLength - this.settings.minStreamLength) + 
            this.settings.minStreamLength
        );
        
        const stream = {
            x,
            y: -length * this.settings.fontSize,
            length,
            speed: Math.random() * 2 + this.settings.speed,
            characters: Array(length).fill().map(() => this.getRandomCharacter())
        };
        
        this.streams.push(stream);
    }

    getRandomCharacter() {
        return this.settings.characters[
            Math.floor(Math.random() * this.settings.characters.length)
        ];
    }

    animate() {
        if (!this.isActive) return;
        
        // Clear with fade effect
        this.ctx.fillStyle = this.settings.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.settings.fontSize}px monospace`;
        
        // Update and draw streams
        this.streams.forEach((stream, index) => {
            this.drawStream(stream);
            this.updateStream(stream, index);
        });
        
        // Create new streams randomly
        if (Math.random() < 0.02) {
            const x = Math.floor(Math.random() * (this.canvas.width / this.settings.fontSize)) * this.settings.fontSize;
            this.createStream(x);
        }
        
        requestAnimationFrame(() => this.animate());
    }

    drawStream(stream) {
        for (let i = 0; i < stream.length; i++) {
            const y = stream.y + i * this.settings.fontSize;
            
            if (y > 0 && y < this.canvas.height) {
                // Highlight the leading character
                if (i === stream.length - 1) {
                    this.ctx.fillStyle = this.settings.highlightColor;
                } else {
                    // Fade effect for trailing characters
                    const opacity = (stream.length - i) / stream.length;
                    this.ctx.fillStyle = this.settings.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                }
                
                this.ctx.fillText(stream.characters[i], stream.x, y);
                
                // Randomly change characters
                if (Math.random() < 0.1) {
                    stream.characters[i] = this.getRandomCharacter();
                }
            }
        }
    }

    updateStream(stream, index) {
        stream.y += stream.speed;
        
        // Remove stream when it's completely off screen
        if (stream.y > this.canvas.height + stream.length * this.settings.fontSize) {
            this.streams.splice(index, 1);
        }
    }

    setActive(active) {
        this.isActive = active;
        if (active) {
            this.animate();
        }
    }

    destroy() {
        this.isActive = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Initialize matrix effect when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        // Choose implementation based on preferences
        window.matrixEffect = new MatrixRain('matrix-canvas', {
            fontSize: 14,
            color: '#00d4ff',
            density: 0.96,
            dropSpeed: 0.8,
            fadeSpeed: 0.03,
            glitchChance: 0.005
        });
        
        // Add control functions to window
        window.toggleMatrix = () => window.matrixEffect.toggle();
        window.setMatrixIntensity = (intensity) => window.matrixEffect.setIntensity(intensity);
        window.setMatrixColor = (color) => window.matrixEffect.setColor(color);
    }
});

// Performance optimization: pause matrix when not needed
let matrixPaused = false;
document.addEventListener('visibilitychange', function() {
    if (window.matrixEffect) {
        if (document.hidden && !matrixPaused) {
            window.matrixEffect.pause();
            matrixPaused = true;
        } else if (!document.hidden && matrixPaused) {
            window.matrixEffect.resume();
            matrixPaused = false;
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MatrixRain,
        MatrixCodeRain
    };
}

// Add to global scope
window.MatrixRain = MatrixRain;
window.MatrixCodeRain = MatrixCodeRain;
