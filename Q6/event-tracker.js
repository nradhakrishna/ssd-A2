/**
 * Universal Event Tracker
 * Captures all click events and page views across HTML tags and CSS Objects
 * Works across Q1, Q2, Q3, Q4, Q5 implementations
 */

class EventTracker {
    constructor() {
        this.events = [];
        this.pageViews = [];
        this.startTime = new Date();
        this.sessionId = this.generateSessionId();
        
        console.log('%c🎯 Event Tracker Initialized', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
        console.log(`Session ID: ${this.sessionId}`);
        console.log(`Start Time: ${this.startTime.toLocaleString()}`);
        console.log('-----------------------------------');
        
        this.init();
    }
    
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Initialize all event listeners
     */
    init() {
        // Track page view on load
        this.trackPageView();
        
        // Track all click events
        this.trackClicks();
        
        // Track form submissions
        this.trackFormSubmissions();
        
        // Track input changes
        this.trackInputChanges();
        
        // Track mouse movements (throttled)
        this.trackMouseMovements();
        
        // Track scroll events (throttled)
        this.trackScrollEvents();
        
        // Track keyboard events
        this.trackKeyboardEvents();
        
        // Track page visibility changes
        this.trackVisibilityChanges();
        
        // Track before unload
        this.trackPageUnload();
        
        // Periodic summary
        this.startPeriodicSummary();
    }
    
    /**
     * Track page view
     */
    trackPageView() {
        const pageView = {
            type: 'PAGE_VIEW',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            sessionId: this.sessionId
        };
        
        this.pageViews.push(pageView);
        
        console.log('%c📄 PAGE VIEW', 'color: #2196F3; font-weight: bold;');
        console.log('URL:', pageView.url);
        console.log('Title:', pageView.title);
        console.log('Viewport:', pageView.viewport);
        console.log('-----------------------------------');
    }
    
    /**
     * Track all click events
     */
    trackClicks() {
        document.addEventListener('click', (e) => {
            const eventData = this.captureClickEvent(e);
            this.events.push(eventData);
            this.logClickEvent(eventData);
        }, true); // Use capture phase to catch all clicks
    }
    
    /**
     * Capture detailed click event information
     */
    captureClickEvent(e) {
        const target = e.target;
        
        return {
            type: 'CLICK',
            timestamp: new Date().toISOString(),
            element: {
                tagName: target.tagName,
                id: target.id || null,
                className: target.className || null,
                name: target.name || null,
                type: target.type || null,
                text: this.getElementText(target),
                value: target.value || null,
                href: target.href || null,
                src: target.src || null
            },
            position: {
                x: e.clientX,
                y: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY
            },
            path: this.getElementPath(target),
            cssSelector: this.getCSSSelector(target),
            computedStyles: this.getComputedStyles(target),
            attributes: this.getAttributes(target),
            sessionId: this.sessionId
        };
    }
    
    /**
     * Log click event to console
     */
    logClickEvent(eventData) {
        console.log('%c🖱️ CLICK EVENT', 'color: #FF5722; font-weight: bold;');
        console.log('Element:', eventData.element.tagName, eventData.cssSelector);
        
        if (eventData.element.id) {
            console.log('ID:', eventData.element.id);
        }
        
        if (eventData.element.className) {
            console.log('Class:', eventData.element.className);
        }
        
        if (eventData.element.text) {
            console.log('Text:', eventData.element.text);
        }
        
        console.log('Position:', `(${eventData.position.x}, ${eventData.position.y})`);
        console.log('Path:', eventData.path);
        
        if (Object.keys(eventData.computedStyles).length > 0) {
            console.log('Styles:', eventData.computedStyles);
        }
        
        console.log('-----------------------------------');
    }
    
    /**
     * Get element text content (truncated)
     */
    getElementText(element) {
        let text = element.textContent || element.innerText || '';
        text = text.trim();
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    
    /**
     * Get DOM path to element
     */
    getElementPath(element) {
        const path = [];
        let current = element;
        
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id) {
                selector += `#${current.id}`;
                path.unshift(selector);
                break; // ID is unique, stop here
            } else if (current.className) {
                const classes = current.className.split(' ').filter(c => c).join('.');
                if (classes) {
                    selector += `.${classes}`;
                }
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }
    
    /**
     * Get CSS selector for element
     */
    getCSSSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        let selector = element.tagName.toLowerCase();
        
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c).join('.');
            if (classes) {
                selector += `.${classes}`;
            }
        }
        
        return selector;
    }
    
    /**
     * Get relevant computed styles
     */
    getComputedStyles(element) {
        const styles = window.getComputedStyle(element);
        const relevantStyles = {};
        
        // Capture important CSS properties
        const properties = [
            'display', 'position', 'width', 'height',
            'background-color', 'color', 'font-size',
            'border', 'padding', 'margin', 'z-index'
        ];
        
        properties.forEach(prop => {
            const value = styles.getPropertyValue(prop);
            if (value && value !== 'none' && value !== 'auto') {
                relevantStyles[prop] = value;
            }
        });
        
        return relevantStyles;
    }
    
    /**
     * Get element attributes
     */
    getAttributes(element) {
        const attributes = {};
        
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
        
        return attributes;
    }
    
    /**
     * Track form submissions
     */
    trackFormSubmissions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            const eventData = {
                type: 'FORM_SUBMIT',
                timestamp: new Date().toISOString(),
                formId: form.id || null,
                formName: form.name || null,
                action: form.action || null,
                method: form.method || 'GET',
                data: data,
                sessionId: this.sessionId
            };
            
            this.events.push(eventData);
            
            console.log('%c📝 FORM SUBMISSION', 'color: #9C27B0; font-weight: bold;');
            console.log('Form:', eventData.formId || eventData.formName || 'unnamed');
            console.log('Method:', eventData.method);
            console.log('Data:', eventData.data);
            console.log('-----------------------------------');
        }, true);
    }
    
    /**
     * Track input changes
     */
    trackInputChanges() {
        document.addEventListener('change', (e) => {
            const target = e.target;
            
            if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
                const eventData = {
                    type: 'INPUT_CHANGE',
                    timestamp: new Date().toISOString(),
                    element: {
                        tagName: target.tagName,
                        id: target.id || null,
                        name: target.name || null,
                        type: target.type || null,
                        value: target.value || null
                    },
                    sessionId: this.sessionId
                };
                
                this.events.push(eventData);
                
                console.log('%c⌨️ INPUT CHANGE', 'color: #FF9800; font-weight: bold;');
                console.log('Element:', eventData.element.tagName, eventData.element.id || eventData.element.name);
                console.log('Type:', eventData.element.type);
                console.log('Value:', eventData.element.value);
                console.log('-----------------------------------');
            }
        }, true);
    }
    
    /**
     * Track mouse movements (throttled)
     */
    trackMouseMovements() {
        let lastLog = 0;
        const throttleMs = 1000; // Log every 1 second
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            
            if (now - lastLog > throttleMs) {
                const eventData = {
                    type: 'MOUSE_MOVE',
                    timestamp: new Date().toISOString(),
                    position: {
                        x: e.clientX,
                        y: e.clientY
                    },
                    sessionId: this.sessionId
                };
                
                this.events.push(eventData);
                lastLog = now;
            }
        });
    }
    
    /**
     * Track scroll events (throttled)
     */
    trackScrollEvents() {
        let lastLog = 0;
        const throttleMs = 500; // Log every 0.5 seconds
        
        window.addEventListener('scroll', (e) => {
            const now = Date.now();
            
            if (now - lastLog > throttleMs) {
                const eventData = {
                    type: 'SCROLL',
                    timestamp: new Date().toISOString(),
                    scrollPosition: {
                        x: window.scrollX,
                        y: window.scrollY
                    },
                    scrollPercentage: this.getScrollPercentage(),
                    sessionId: this.sessionId
                };
                
                this.events.push(eventData);
                
                console.log('%c📜 SCROLL', 'color: #607D8B; font-weight: bold;');
                console.log('Position:', `(${eventData.scrollPosition.x}, ${eventData.scrollPosition.y})`);
                console.log('Percentage:', `${eventData.scrollPercentage}%`);
                console.log('-----------------------------------');
                
                lastLog = now;
            }
        });
    }
    
    /**
     * Calculate scroll percentage
     */
    getScrollPercentage() {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        
        return Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100) || 0;
    }
    
    /**
     * Track keyboard events
     */
    trackKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Don't log password fields or sensitive data
            if (e.target.type === 'password') return;
            
            const eventData = {
                type: 'KEYDOWN',
                timestamp: new Date().toISOString(),
                key: e.key,
                code: e.code,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                target: {
                    tagName: e.target.tagName,
                    id: e.target.id || null
                },
                sessionId: this.sessionId
            };
            
            this.events.push(eventData);
            
            if (e.key.length === 1 || ['Enter', 'Space', 'Backspace', 'Delete'].includes(e.key)) {
                console.log('%c⌨️ KEY PRESS', 'color: #00BCD4; font-weight: bold;');
                console.log('Key:', e.key);
                console.log('Target:', eventData.target.tagName, eventData.target.id || '');
                console.log('-----------------------------------');
            }
        });
    }
    
    /**
     * Track page visibility changes
     */
    trackVisibilityChanges() {
        document.addEventListener('visibilitychange', () => {
            const eventData = {
                type: 'VISIBILITY_CHANGE',
                timestamp: new Date().toISOString(),
                hidden: document.hidden,
                sessionId: this.sessionId
            };
            
            this.events.push(eventData);
            
            console.log('%c👁️ VISIBILITY CHANGE', 'color: #795548; font-weight: bold;');
            console.log('Page Hidden:', document.hidden);
            console.log('-----------------------------------');
        });
    }
    
    /**
     * Track page unload
     */
    trackPageUnload() {
        window.addEventListener('beforeunload', () => {
            const duration = (new Date() - this.startTime) / 1000;
            
            console.log('%c👋 PAGE UNLOAD', 'color: #F44336; font-weight: bold;');
            console.log('Session Duration:', `${duration.toFixed(2)} seconds`);
            console.log('Total Events Captured:', this.events.length);
            console.log('-----------------------------------');
            
            // Save to localStorage for persistence
            this.saveToStorage();
        });
    }
    
    /**
     * Start periodic summary
     */
    startPeriodicSummary() {
        setInterval(() => {
            this.printSummary();
        }, 30000); // Every 30 seconds
    }
    
    /**
     * Print event summary
     */
    printSummary() {
        const duration = (new Date() - this.startTime) / 1000;
        const clickCount = this.events.filter(e => e.type === 'CLICK').length;
        const formSubmits = this.events.filter(e => e.type === 'FORM_SUBMIT').length;
        const inputChanges = this.events.filter(e => e.type === 'INPUT_CHANGE').length;
        
        console.log('%c📊 EVENT SUMMARY', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
        console.log('Session Duration:', `${duration.toFixed(2)} seconds`);
        console.log('Page Views:', this.pageViews.length);
        console.log('Total Events:', this.events.length);
        console.log('Clicks:', clickCount);
        console.log('Form Submissions:', formSubmits);
        console.log('Input Changes:', inputChanges);
        console.log('-----------------------------------');
    }
    
    /**
     * Get all captured events
     */
    getAllEvents() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            pageViews: this.pageViews,
            events: this.events
        };
    }
    
    /**
     * Export events as JSON
     */
    exportAsJSON() {
        const data = this.getAllEvents();
        const json = JSON.stringify(data, null, 2);
        
        console.log('%c📥 EXPORT DATA', 'color: #3F51B5; font-weight: bold;');
        console.log(json);
        console.log('-----------------------------------');
        
        return json;
    }
    
    /**
     * Save to localStorage
     */
    saveToStorage() {
        try {
            const data = this.getAllEvents();
            localStorage.setItem('eventTracker_' + this.sessionId, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    
    /**
     * Clear all tracked data
     */
    clearData() {
        this.events = [];
        this.pageViews = [];
        console.log('%c🗑️ Data Cleared', 'color: #F44336; font-weight: bold;');
    }
}

// Auto-initialize when script loads
const eventTracker = new EventTracker();

// Expose globally for manual access
window.eventTracker = eventTracker;

// Helper functions accessible from console
window.getEventSummary = () => eventTracker.printSummary();
window.getAllEvents = () => eventTracker.getAllEvents();
window.exportEvents = () => eventTracker.exportAsJSON();
window.clearEvents = () => eventTracker.clearData();

console.log('%c💡 Helper Functions Available:', 'color: #4CAF50; font-weight: bold;');
console.log('- getEventSummary() - Show event summary');
console.log('- getAllEvents() - Get all captured events');
console.log('- exportEvents() - Export as JSON');
console.log('- clearEvents() - Clear all data');
console.log('===================================');

