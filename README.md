# decision_table

Simple implementation of [Decision Tables](https://en.wikipedia.org/wiki/Decision_table).

## Installation

For Node.JS or bundlers (Wepback, Browserify):

```bash
# By NPM
npm i decision_table --save
# By Yarn
yarn add decision_table --save
```

For browser (compressed library at file `lib/decision-table.js`):

```html
<!-- Development environment version -->
<script src="path/to/decision-table.dev.js"></script>
<!-- Production environment version -->
<script src="path/to/decision-table.prod.js"></script>
```

## Usage

### Importing

For Node.JS or bundlers you just need to import `DecisionTable` class:

```javascript
const {DecisionTable} = require('decision-table');
// or
import {DecisionTable} from 'decision-table';
```

In browsers you can get it from global variable:

```javascript
window.dt.DecisionTable;
```

### Environment

Library uses standard Node.JS environment variable (`NODE_ENV`).
In development mode (`NODE_ENV !== 'production'`) library runs some
tests for each adding action and condition.

Browser versions of library has defined environment:
* `lib/decision-table.dev.js` - development environment (all test running always, not compressed);
* `lib/decision-table.prod.js` - development environment (all test running always, compressed);

### API

#### new DecisionTable()

Creates new instance of Decision Table. No arguments.

Example:
```javascript
var table = new window.dt.DecisionTable();
```

#### DecisionTable.noConflict()

Static method which returns Decision Table constructor and returns
a previous value of `window.dt` field.

Example:
```javascript
window.mynamespace.DecisionTable = window.dt.DecisionTable.noConflict();
console.log(window.dt); // Must be a previous value now
```

In Node.JS this method just returns Decision Table constructor.

#### DecisionTable.testAction(action)

Special static method which provides simple testing
for your actions. In "development" environment this method
will be run for each adding action.

#### DecisionTable.testCondition(name, func)

Special static method which provides simple testing
for your conditions. In development environment this method
will be run for each adding condition.

#### DecisionTable.prototype.addCondition(name, func)

Instance method which adds new condition to table. If condition
with this name was already added it will be overriden.

Arguments:
* `name` - string identifier of condition;
* `func` - condition function, must have no arguments and return a boolean value;

Example:
```javascript
var A = true, B = false;
table.addCondition('A', function() { return A; });
table.addCondition('B', function() { return B; });
```

#### DecisionTable.prototype.removeCondition(name)

Removes condition from table. For any actions which requires condition with this
name it will be automaticaly equals "false".

```javascript
table.removeCondition('A');
table.removeCondition('B');
```

#### DecisionTable.prototype.addAction(action)

Adds new action to table. Argument action must be an object which contains fields:
* `whenTrue` - array of conditions names which must be a "true" to do action;
* `whenFalse` - array of conditions names which must be a "false" to do action;
* `execute` - action's body, code to execute on this action.

If `whenTrue` or `whenFalse` will be both not defined or empty, action will
never be executed.

If one of actions in `whenTrue` or `whenFalse` is not defined in table
(or removed from it), action will never be executed.

Example:
```javascript
table.addAction({
    whenTrue: ['A'],
    execute: function() {
        console.log('Executed only if A is true');
    }
});
table.addAction({
    whenFalse: ['A'],
    execute: function() {
        console.log('Executed only if A is false');
    }
});
table.addAction({
    whenTrue: ['B'],
    execute: function() {
        console.log('Executed only if B is true');
    }
});
table.addAction({
    whenFalse: ['B'],
    execute: function() {
        console.log('Executed only if B is false');
    }
});
table.addAction({
    whenTrue: ['A', 'B'],
    execute: function() {
        console.log('Executed only if A and B are true');
    }
});
table.addAction({
    whenFalse: ['A', 'B'],
    execute: function() {
        console.log('Executed only if A and B are false');
    }
});
table.addAction({
    whenTrue: ['A'],
    whenFalse: ['B'],
    execute: function() {
        console.log('Executed only if A is true and B is false');
    }
});
table.addAction({
    whenTrue: ['B'],
    whenFalse: ['A'],
    execute: function() {
        console.log('Executed only if B is true and A is false');
    }
});
```

#### DecisionTable.prototype.removeAction(action)

Removes action from table. Please note, that this method just equals pointes to objects.

#### DecisionTable.prototype.run();

Check all conditions and execute all approved actions.

Example:

```javascript
table.run();
```

#### Full example (for browser)

```javascript
var table = new window.dt.DecisionTable();
var A, B;

table.addCondition('A', function() { return A; });
table.addCondition('B', function() { return B; });

table.addAction({
    whenTrue: ['A'],
    execute: function() {
        console.log('Executed only if A is true');
    }
});
table.addAction({
    whenFalse: ['A'],
    execute: function() {
        console.log('Executed only if A is false');
    }
});
table.addAction({
    whenTrue: ['B'],
    execute: function() {
        console.log('Executed only if B is true');
    }
});
table.addAction({
    whenFalse: ['B'],
    execute: function() {
        console.log('Executed only if B is false');
    }
});
table.addAction({
    whenTrue: ['A', 'B'],
    execute: function() {
        console.log('Executed only if A and B are true');
    }
});
table.addAction({
    whenFalse: ['A', 'B'],
    execute: function() {
        console.log('Executed only if A and B are false');
    }
});
table.addAction({
    whenTrue: ['A'],
    whenFalse: ['B'],
    execute: function() {
        console.log('Executed only if A is true and B is false');
    }
});
table.addAction({
    whenTrue: ['B'],
    whenFalse: ['A'],
    execute: function() {
        console.log('Executed only if B is true and A is false');
    }
});

A = true;
B = true;
table.run();

A = false;
B = true;
table.run();

A = true;
B = false;
table.run();

A = false;
B = false;
table.run();
```

## Roadmap

* Version *0.5.0* - optional conditions ("OR" logic);
* Version *0.9.0* - asynchronous conditions;

## For developers

See https://github.com/AlexanderSychev/decision-table/blob/master/DEVELOPMENT.md