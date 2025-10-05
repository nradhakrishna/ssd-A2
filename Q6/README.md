# Event Tracker - Q6

A comprehensive JavaScript function that captures **all click events and page views** across HTML tags and CSS objects, with detailed console logging.

## Features

### 📊 **Event Tracking:**
- ✅ **Click Events** - All clicks on HTML elements
- ✅ **Page Views** - Initial load and navigation
- ✅ **Form Submissions** - Form data capture
- ✅ **Input Changes** - Input, select, textarea changes
- ✅ **Mouse Movements** - Throttled mouse tracking
- ✅ **Scroll Events** - Scroll position and percentage
- ✅ **Keyboard Events** - Key presses and combinations
- ✅ **Visibility Changes** - Tab focus/blur
- ✅ **Page Unload** - Session duration and summary

### 🎯 **Data Captured:**

#### Click Events:
- Element tag name, ID, class, name
- Element text content and value
- Click position (x, y coordinates)
- DOM path to element
- CSS selector
- Computed CSS styles
- All element attributes

#### Page Views:
- URL and path
- Page title
- Referrer
- Screen resolution
- Viewport size
- User agent
- Timestamp

## Installation

### **Method 1: Add to Existing Projects (Q1-Q5)**

Add this line **before the closing `</body>` tag** in your HTML files:

```html
<!-- Add Event Tracker -->
<script src="../Q6/event-tracker.js"></script>
```

### **Method 2: Include in All Pages**

For Q1, Q2, Q3, Q4, Q5:

1. **Q1 (Todo List)**:
```html
<!-- In Q1/index.html, before </body> -->
<script src="../Q6/event-tracker.js"></script>
```

2. **Q2 (Expense Tracker)**:
```html
<!-- In Q2/index.html, before </body> -->
<script src="../Q6/event-tracker.js"></script>
```

3. **Q3 (Jigsaw Puzzle)**:
```html
<!-- In Q3/index.html, before </body> -->
<script src="../Q6/event-tracker.js"></script>
```

4. **Q4 (Stoplight Game)**:
```html
<!-- In Q4/index.html, before </body> -->
<script src="../Q6/event-tracker.js"></script>
```

5. **Q5 (Data Dictionary)**:
```html
<!-- In Q5/index.html, before </body> -->
<script src="../Q6/event-tracker.js"></script>
```

## Usage

### **Automatic Tracking**

Once included, the event tracker **automatically starts** tracking all events. No additional code needed!

### **Console Output**

Open **Developer Tools** (F12) and check the **Console** tab. You'll see:

#### **On Page Load:**
```
🎯 Event Tracker Initialized
Session ID: session_1234567890_abc123def
Start Time: 10/5/2025, 12:34:56 PM
-----------------------------------
📄 PAGE VIEW
URL: http://localhost:8000/Q1/index.html
Title: Todo List Application
Viewport: 1920x1080
-----------------------------------
```

#### **On Click:**
```
🖱️ CLICK EVENT
Element: BUTTON .btn.btn-primary
ID: addTaskBtn
Class: btn btn-primary
Text: Add Task
Position: (450, 320)
Path: html > body > div.container > button.btn.btn-primary
Styles: {background-color: 'rgb(33, 150, 243)', ...}
-----------------------------------
```

#### **On Form Submit:**
```
📝 FORM SUBMISSION
Form: taskForm
Method: POST
Data: {task: 'Buy groceries', priority: 'high'}
-----------------------------------
```

#### **On Input Change:**
```
⌨️ INPUT CHANGE
Element: INPUT taskInput
Type: text
Value: Buy groceries
-----------------------------------
```

#### **On Scroll:**
```
📜 SCROLL
Position: (0, 450)
Percentage: 35%
-----------------------------------
```

### **Manual Functions**

Access these functions from the browser console:

#### **Get Event Summary:**
```javascript
getEventSummary()
```
Output:
```
📊 EVENT SUMMARY
Session Duration: 125.43 seconds
Page Views: 1
Total Events: 45
Clicks: 23
Form Submissions: 3
Input Changes: 12
```

#### **Get All Events:**
```javascript
const allData = getAllEvents()
console.log(allData)
```

#### **Export as JSON:**
```javascript
const json = exportEvents()
// Copy from console and save to file
```

#### **Clear Data:**
```javascript
clearEvents()
```

## Event Data Structure

### **Click Event Example:**
```json
{
  "type": "CLICK",
  "timestamp": "2025-10-05T12:34:56.789Z",
  "element": {
    "tagName": "BUTTON",
    "id": "addTaskBtn",
    "className": "btn btn-primary",
    "name": null,
    "type": "button",
    "text": "Add Task",
    "value": null,
    "href": null,
    "src": null
  },
  "position": {
    "x": 450,
    "y": 320,
    "pageX": 450,
    "pageY": 780
  },
  "path": "html > body > div.container > button#addTaskBtn.btn.btn-primary",
  "cssSelector": "#addTaskBtn",
  "computedStyles": {
    "background-color": "rgb(33, 150, 243)",
    "color": "rgb(255, 255, 255)",
    "padding": "10px 20px",
    "border-radius": "4px"
  },
  "attributes": {
    "id": "addTaskBtn",
    "class": "btn btn-primary",
    "type": "button"
  },
  "sessionId": "session_1234567890_abc123def"
}
```

### **Page View Example:**
```json
{
  "type": "PAGE_VIEW",
  "timestamp": "2025-10-05T12:34:56.123Z",
  "url": "http://localhost:8000/Q1/index.html",
  "path": "/Q1/index.html",
  "title": "Todo List Application",
  "referrer": "Direct",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080",
  "viewport": "1920x937",
  "sessionId": "session_1234567890_abc123def"
}
```

## Testing on Q1-Q5

### **Q1 (Todo List) - Expected Events:**
- Page view on load
- Input changes in task field
- Button clicks (Add, Edit, Delete)
- Checkbox clicks for task completion
- Form submission events

### **Q2 (Expense Tracker) - Expected Events:**
- Page view on load
- Input changes in amount/description fields
- File upload clicks
- Button clicks (Add Expense, Export)
- Form submissions

### **Q3 (Jigsaw Puzzle) - Expected Events:**
- Page view on load
- File upload for image
- Difficulty selection clicks
- Mouse drag events for puzzle pieces
- Button clicks (Generate, Shuffle, Reset)

### **Q4 (Stoplight Game) - Expected Events:**
- Page view on load
- Game mode selection
- Button clicks (Go, Stop)
- Result display interactions
- Statistics updates

### **Q5 (Data Dictionary) - Expected Events:**
- Page view on load
- File upload for schema
- Input changes in JSON textarea
- Sample selection dropdown
- Button clicks (Generate, Export HTML/PDF)
- Scroll events on long dictionaries

## Console Styling

The tracker uses **color-coded console logs**:

- 🎯 **Green** - Initialization and summaries
- 📄 **Blue** - Page views
- 🖱️ **Red/Orange** - Click events
- 📝 **Purple** - Form submissions
- ⌨️ **Orange** - Input changes
- 📜 **Gray** - Scroll events
- 👁️ **Brown** - Visibility changes
- 👋 **Red** - Page unload

## Privacy & Performance

### **Privacy Considerations:**
- ❌ Does **NOT** capture password field values
- ✅ Stores data only in browser (localStorage)
- ✅ No external server communication
- ✅ Session-based tracking only

### **Performance Optimizations:**
- ⚡ Mouse movements throttled (1 event/second)
- ⚡ Scroll events throttled (1 event/0.5 seconds)
- ⚡ Efficient DOM traversal
- ⚡ Minimal memory footprint

## Advanced Features

### **Session Persistence:**
Data is saved to localStorage before page unload:
```javascript
// Retrieve previous sessions
const sessionKey = 'eventTracker_session_1234567890_abc123def';
const previousData = JSON.parse(localStorage.getItem(sessionKey));
```

### **Custom Event Filtering:**
```javascript
// Get only click events
const clicks = getAllEvents().events.filter(e => e.type === 'CLICK');

// Get events from last 5 minutes
const recent = getAllEvents().events.filter(e => {
    const time = new Date(e.timestamp);
    return (new Date() - time) < 5 * 60 * 1000;
});
```

### **Event Analysis:**
```javascript
// Most clicked elements
const clicks = getAllEvents().events.filter(e => e.type === 'CLICK');
const elementCounts = {};

clicks.forEach(click => {
    const selector = click.cssSelector;
    elementCounts[selector] = (elementCounts[selector] || 0) + 1;
});

console.table(elementCounts);
```

## Troubleshooting

### **No events showing:**
- Check if script is loaded: `console.log(window.eventTracker)`
- Verify console is open (F12)
- Check for JavaScript errors in console

### **Too many events:**
- Mouse and scroll events are throttled by default
- Use `clearEvents()` to reset
- Filter specific event types as needed

### **Performance issues:**
- Reduce throttle intervals in code
- Filter out mouse/scroll tracking if not needed
- Clear data periodically

## Example Integration

Here's a complete example for Q1:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Todo List with Event Tracking</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>My Tasks</h1>
        <form id="taskForm">
            <input type="text" id="taskInput" placeholder="Enter task">
            <button type="submit" id="addTaskBtn">Add Task</button>
        </form>
        <ul id="taskList"></ul>
    </div>

    <!-- Your application scripts -->
    <script src="script.js"></script>
    
    <!-- Event Tracker (ADD THIS LINE) -->
    <script src="../Q6/event-tracker.js"></script>
</body>
</html>
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## License

Free to use for educational purposes.

---

**Happy Tracking!** 📊✨

