var dt =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
if (true) {
    console.warn('[decision_table] You are using non-production version of library. ' +
        'It\'s provides some additional checks which mades library some slower.');
}
/** Action testing sandbox */
var ActionTest = (function () {
    function ActionTest() {
    }
    /** Run testing */
    ActionTest.run = function (action) {
        var result = {
            passed: true,
            reasons: []
        };
        if (ActionTest.isNotNil_(action.whenTrue) && !ActionTest.isArray_(action.whenTrue)) {
            result.passed = false;
            result.reasons.push('Action field "whenTrue" is not array of strings.');
        }
        if (ActionTest.isNotNil_(action.whenFalse) && !ActionTest.isArray_(action.whenFalse)) {
            result.passed = false;
            result.reasons.push('Action field "whenFalse" is not array of strings.');
        }
        if (ActionTest.isNotNil_(action.whenTrue) && !ActionTest.isArrayOfStrings_(action.whenTrue)) {
            result.passed = false;
            result.reasons.push('Action field "whenTrue" is not array of strings.');
        }
        if (ActionTest.isNotNil_(action.whenFalse) && !ActionTest.isArrayOfStrings_(action.whenFalse)) {
            result.passed = false;
            result.reasons.push('Action field "whenFalse" is not array of strings.');
        }
        if (!ActionTest.isFunction_(action.execute)) {
            result.passed = false;
            result.reasons.push('Action field "execute" is required and must be a function.');
        }
        return result;
    };
    /** Returns "true" if entity is not "null" or "undefined" */
    ActionTest.isNotNil_ = function (value) {
        return (value !== null) && (value !== undefined);
    };
    /** Returns "true" if entity is array */
    ActionTest.isArray_ = function (value) {
        return (Object.prototype.toString.call(value) === '[object Array]');
    };
    /** Returns "true" if entity is a function */
    ActionTest.isFunction_ = function (value) {
        return (value instanceof Function);
    };
    /** Returns "true" if entity is array of strings */
    ActionTest.isArrayOfStrings_ = function (value) {
        var result = ActionTest.isNotNil_(value) && ActionTest.isArray_(value);
        if (result) {
            for (var i = 0; i < value.length; i++) {
                if (typeof value[i] !== 'string') {
                    result = false;
                    break;
                }
            }
        }
        return result;
    };
    return ActionTest;
}());
/** Condition testing sandbox */
var ConditionTest = (function () {
    function ConditionTest() {
    }
    /** Run testing */
    ConditionTest.run = function (name, func) {
        var result = {
            passed: true,
            reasons: []
        };
        if (typeof name !== 'string') {
            result.passed = false;
            result.reasons.push('Condition name must be a string');
        }
        if (!(func instanceof Function)) {
            result.passed = false;
            result.reasons.push('Condition must be a function');
        }
        return result;
    };
    return ConditionTest;
}());
/** Common class of decision table */
var DecisionTable = (function () {
    /** @constructor */
    function DecisionTable() {
        this.conditions_ = {};
        this.actions_ = [];
    }
    /**
     * Special static method which returns Decision Table constructor
     * and set previous value to field "window.dt.DecisionTable".
     * In Node.JS it's just returns Decision Table constructor.
     */
    DecisionTable.noConflict = function () {
        try {
            var currentItem = window.dt.DecisionTable;
            window.dt = DecisionTable.PREVIOUS_GLOBAL_NAMESPACE_;
            return currentItem;
        }
        catch (e) {
            return DecisionTable;
        }
    };
    /**
     * Special static method which provides simple testing
     * for your actions. In development environment this method
     * will be run for each adding action.
     */
    DecisionTable.testAction = function (action) {
        var result = ActionTest.run(action);
        if (!result.passed) {
            console.error("[decision_table] Action test failed:\n\t" + result.reasons.join('\t\n'));
        }
        return result;
    };
    /**
     * Special static method which provides simple testing
     * for your conditions. In development environment this method
     * will be run for each adding condition.
     */
    DecisionTable.testCondition = function (name, condition) {
        var result = ConditionTest.run(name, condition);
        if (!result.passed) {
            console.error("[decision_table] Condition test failed:\n\t" + result.reasons.join('\t\n'));
        }
        return result;
    };
    /** Add new condition to table (will be override if exists) */
    DecisionTable.prototype.addCondition = function (name, func) {
        if (true) {
            var result = DecisionTable.testCondition(name, func);
            if (!result.passed) {
                throw new Error(result.reasons.join('\t\n'));
            }
        }
        this.conditions_[name] = func;
    };
    /** Remove condition from table */
    DecisionTable.prototype.removeCondition = function (name) {
        this.conditions_[name] = undefined;
    };
    /**
     * Add new action to table and returns its index
     * which provides action removing and changing
     */
    DecisionTable.prototype.addAction = function (action) {
        if (true) {
            var result = DecisionTable.testAction(action);
            if (!result.passed) {
                throw new Error(result.reasons.join('\t\n'));
            }
        }
        this.actions_.push(action);
    };
    /** Removes action by it's link */
    DecisionTable.prototype.removeAction = function (action) {
        this.actions_ = this.actions_.filter(function (value) { return (value !== action); });
    };
    /** Run table */
    DecisionTable.prototype.run = function () {
        var _this = this;
        var conditionsResults = {};
        Object.keys(this.conditions_).forEach(function (key) {
            var condition = _this.conditions_[key];
            if (condition !== undefined) {
                conditionsResults[key] = condition();
            }
        });
        this.actions_.forEach(function (action) { return _this.doAction_(action, conditionsResults); });
    };
    /** Action execition function */
    DecisionTable.prototype.doAction_ = function (action, conditionsResults) {
        var whenTrue = (action.whenTrue || []).map(function (key) { return ((conditionsResults[key] !== undefined ? conditionsResults[key] : false)); });
        var whenFalse = (action.whenFalse || []).map(function (key) { return ((conditionsResults[key] !== undefined ? !conditionsResults[key] : false)); });
        var resultsFull = whenTrue.concat(whenFalse);
        var isRunnable = false;
        if (resultsFull.length > 0) {
            isRunnable = resultsFull.reduce(function (previous, result) { return (previous && result); }, true);
        }
        if (isRunnable) {
            action.execute();
        }
    };
    /**
     * Previous value of field "window.dt" which using
     * in "noConflict" static method. In Node.JS always equals
     * "undefined"
     */
    DecisionTable.PREVIOUS_GLOBAL_NAMESPACE_ = (function () {
        try {
            return window.dt;
        }
        catch (e) {
            return undefined;
        }
    })();
    return DecisionTable;
}());
exports.DecisionTable = DecisionTable;


/***/ })
/******/ ]);