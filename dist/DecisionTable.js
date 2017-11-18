Object.defineProperty(exports, "__esModule", { value: true });
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
    /** Add new condition to table (will be override if exists) */
    DecisionTable.prototype.addCondition = function (name, func) {
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
        this.lintAction_(action);
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
    DecisionTable.prototype.lintAction_ = function (action) {
        var isNotNilAndNotArray = function (item) { return ((item !== null && item !== undefined && !Array.isArray(item))); };
        if (isNotNilAndNotArray(action.whenTrue)) {
            throw new Error('Action field "whenTrue" must be array of strings!');
        }
        if (isNotNilAndNotArray(action.whenFalse)) {
            throw new Error('Action field "whenFalse" must be array of strings!');
        }
        if (!(action.execute instanceof Function)) {
            throw new Error('Action field "execute" is required and must be a function!');
        }
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
