/**
 * Typing Animation System for Portfolio Website
 * Handles typewriter effects and text animations
 */

class TypingAnimation {
    constructor() {
        this.typingElements = [];
        this.isInitialized = false;
        this.defaultSettings = {
            typeSpeed: 50,
            deleteSpeed: 30,
            pauseDuration: 1000,
            loop: false,
            cursor: true,
            cursorChar: '|'
        };
    }

    /**
     * Initialize typing animations
     */
    init() {
        if (this.isInitialized) return;
        
        this.findTypingElements();
        this.setupTypingAnimations();
        this.isInitialized = true;
    }

    /**
     * Find all elements with typing animation
     */
    findTypingElements() {
        const elements = document.querySelectorAll('[data-text]');
        
        elements.forEach(element => {
            const settings = this.getElementSettings(element);
            this.typingElements.push({
                element,
                settings,
                status: 'pending'
            });
        });
    }

    /**
     * Get settings for specific element
     */
    getElementSettings(element) {
        return {
            text: element.getAttribute('data-text') || '',
            delay: parseInt(element.getAttribute('data-delay')) || 0,
            typeSpeed: parseInt(element.getAttribute('data-type-speed')) || this.defaultSettings.typeSpeed,
            deleteSpeed: parseInt(element.getAttribute('data-delete-speed')) || this.defaultSettings.deleteSpeed,
            pauseDuration: parseInt(element.getAttribute('data-pause')) || this.defaultSettings.pauseDuration,
            loop: element.getAttribute('data-loop') === 'true',
            cursor: element.getAttribute('data-cursor') !== 'false',
            cursorChar: element.getAttribute('data-cursor-char') || this.defaultSettings.cursorChar
        };
    }

    /**
     * Setup typing animations with delays
     */
    setupTypingAnimations() {
        this.typingElements.forEach((item, index) => {
            setTimeout(() => {
                this.startTyping(item);
            }, item.settings.delay);
        });
    }

    /**
     * Start typing animation for element
     */
    async startTyping(item) {
        const { element, settings } = item;
        
        // Clear element content and reset
        element.innerHTML = '';
        element.textContent = '';
        
        // Simple character-by-character typing without cursor complications
        await this.typeTextSimple(element, settings.text, settings.typeSpeed);
        
        // Handle looping
        if (settings.loop) {
            setTimeout(() => {
                this.handleLoop(item);
            }, settings.pauseDuration);
        }

        item.status = 'completed';
    }

    /**
     * Type text character by character
     */
    typeText(element, text, speed) {
        return new Promise(resolve => {
            let index = 0;
            const cursor = element.querySelector('.typing-cursor');
            
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    const char = text.charAt(index);
                    
                    if (cursor && cursor.parentNode === element) {
                        const textNode = document.createTextNode(char);
                        element.insertBefore(textNode, cursor);
                    } else {
                        element.textContent += char;
                    }
                    
                    index++;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, speed);
        });
    }

    /**
     * Simple typing without cursor complications
     */
    typeTextSimple(element, text, speed) {
        return new Promise(resolve => {
            let index = 0;
            element.textContent = '';
            
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, speed);
        });
    }

    /**
     * Delete text character by character
     */
    deleteText(element, speed) {
        return new Promise(resolve => {
            const cursor = element.querySelector('.typing-cursor');
            const textNodes = Array.from(element.childNodes).filter(node => 
                node.nodeType === Node.TEXT_NODE
            );
            
            let nodeIndex = textNodes.length - 1;
            
            const deleteInterval = setInterval(() => {
                if (nodeIndex >= 0) {
                    const currentNode = textNodes[nodeIndex];
                    const text = currentNode.textContent;
                    
                    if (text.length > 1) {
                        currentNode.textContent = text.slice(0, -1);
                    } else {
                        element.removeChild(currentNode);
                        nodeIndex--;
                    }
                } else {
                    clearInterval(deleteInterval);
                    resolve();
                }
            }, speed);
        });
    }

    /**
     * Handle looping animation
     */
    async handleLoop(item) {
        const { element, settings } = item;
        
        // Delete current text
        await this.deleteText(element, settings.deleteSpeed);
        
        // Wait before typing again
        setTimeout(() => {
            this.typeText(element, settings.text, settings.typeSpeed)
                .then(() => {
                    setTimeout(() => {
                        this.handleLoop(item);
                    }, settings.pauseDuration);
                });
        }, 500);
    }

    /**
     * Add cursor to element
     */
    addCursor(element, cursorChar) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = cursorChar;
        cursor.style.animation = 'typingBlink 1s infinite';
        element.appendChild(cursor);
    }

    /**
     * Remove cursor from element
     */
    removeCursor(element) {
        const cursor = element.querySelector('.typing-cursor');
        if (cursor) {
            cursor.style.animation = 'none';
            cursor.style.opacity = '0';
        }
    }

    /**
     * Add new typing element dynamically
     */
    addElement(element, settings = {}) {
        const mergedSettings = { ...this.defaultSettings, ...settings };
        const item = {
            element,
            settings: mergedSettings,
            status: 'pending'
        };
        
        this.typingElements.push(item);
        this.startTyping(item);
    }

    /**
     * Stop all typing animations
     */
    stopAll() {
        this.typingElements.forEach(item => {
            item.status = 'stopped';
        });
    }

    /**
     * Restart all typing animations
     */
    restartAll() {
        this.typingElements.forEach(item => {
            if (item.status === 'stopped') {
                item.status = 'pending';
                this.startTyping(item);
            }
        });
    }
}

/**
 * Terminal-style typing effect
 */
class TerminalTyping {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseDuration: 2000,
            cursor: '█',
            prompt: '$',
            ...options
        };
        this.isTyping = false;
    }

    /**
     * Type a command with terminal styling
     */
    async typeCommand(command, output = '') {
        if (this.isTyping) return;
        this.isTyping = true;

        // Create command line
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = this.options.prompt + ' ';
        
        const commandText = document.createElement('span');
        commandText.className = 'terminal-command';
        
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = this.options.cursor;
        cursor.style.animation = 'typingBlink 1s infinite';
        
        commandLine.appendChild(prompt);
        commandLine.appendChild(commandText);
        commandLine.appendChild(cursor);
        this.element.appendChild(commandLine);

        // Type the command
        await this.typeText(commandText, command);
        
        // Remove cursor and add output if provided
        cursor.remove();
        
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-output';
            outputLine.innerHTML = output;
            this.element.appendChild(outputLine);
        }

        this.isTyping = false;
    }

    /**
     * Type text character by character
     */
    typeText(element, text) {
        return new Promise(resolve => {
            let index = 0;
            
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(resolve, this.options.pauseDuration);
                }
            }, this.options.typeSpeed);
        });
    }

    /**
     * Clear terminal
     */
    clear() {
        this.element.innerHTML = '';
    }
}

/**
 * Multiple text rotation typing effect
 */
class RotatingText {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentIndex = 0;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseDuration: 2000,
            loop: true,
            ...options
        };
        this.isActive = false;
    }

    /**
     * Start rotating text animation
     */
    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.rotateText();
    }

    /**
     * Stop rotating text animation
     */
    stop() {
        this.isActive = false;
    }

    /**
     * Rotate through texts
     */
    async rotateText() {
        while (this.isActive) {
            const currentText = this.texts[this.currentIndex];
            
            // Type current text
            await this.typeText(currentText);
            
            if (!this.isActive) break;
            
            // Pause
            await this.pause(this.options.pauseDuration);
            
            if (!this.isActive) break;
            
            // Delete current text
            await this.deleteText();
            
            // Move to next text
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            
            if (!this.options.loop && this.currentIndex === 0) {
                break;
            }
        }
    }

    /**
     * Type text
     */
    typeText(text) {
        return new Promise(resolve => {
            let index = 0;
            
            const typeInterval = setInterval(() => {
                if (index < text.length && this.isActive) {
                    this.element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, this.options.typeSpeed);
        });
    }

    /**
     * Delete text
     */
    deleteText() {
        return new Promise(resolve => {
            const text = this.element.textContent;
            let length = text.length;
            
            const deleteInterval = setInterval(() => {
                if (length > 0 && this.isActive) {
                    this.element.textContent = text.substring(0, length - 1);
                    length--;
                } else {
                    clearInterval(deleteInterval);
                    resolve();
                }
            }, this.options.deleteSpeed);
        });
    }

    /**
     * Pause execution
     */
    pause(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
}

// Add CSS for typing animations
const typingStyles = `
    @keyframes typingBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .typing-cursor {
        color: var(--accent-cyan, #00ffff);
        font-weight: bold;
    }
    
    .terminal-line {
        margin-bottom: 0.5rem;
        font-family: var(--font-mono, monospace);
    }
    
    .terminal-prompt {
        color: var(--accent-cyan, #00ffff);
        font-weight: bold;
    }
    
    .terminal-command {
        color: var(--neon-green, #39ff14);
    }
    
    .terminal-output {
        color: var(--text-primary, #e0e0e0);
        margin-bottom: 1rem;
        padding-left: 1rem;
    }
    
    .terminal-cursor {
        color: var(--accent-cyan, #00ffff);
        background: var(--accent-cyan, #00ffff);
        margin-left: 2px;
    }
`;

// Inject styles
if (!document.getElementById('typing-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'typing-styles';
    styleSheet.textContent = typingStyles;
    document.head.appendChild(styleSheet);
}

// Global typing animation instance
window.typingAnimation = new TypingAnimation();

// Initialize on DOM content loaded - disabled to prevent conflicts
// document.addEventListener('DOMContentLoaded', function() {
//     window.typingAnimation.init();
// });

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TypingAnimation,
        TerminalTyping,
        RotatingText
    };
}

// Add to global scope
window.TypingAnimation = TypingAnimation;
window.TerminalTyping = TerminalTyping;
window.RotatingText = RotatingText;
