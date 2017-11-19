/**
 * Condition - some function without arguments
 * which returns boolean value
 */
interface Condition {
    (): boolean;
}

/** Dictionary simple structure */
interface Dictionary<T> {
    /** "Key-Value" pair */
    [key: string]: T;
}

/**
 * Action - object which provides some code for some conditions
 */
export interface Action {
    /** Conditions which must be "true" to do action */
    whenTrue?: string[];
    /** Conditions which must be "false" to do action */
    whenFalse?: string[];
    /** Function which contains code to execute in action */
    execute: () => any;
}

if (process.env.NODE_ENV !== 'production') {
    console.warn(
        '[decision_table] You are using non-production version of library. ' +
        'It\'s provides some additional checks which mades library some slower.'
    );
}

/** Action testing result */
interface TestResult {
    /** Passed tests action flag */
    passed: boolean;
    /** Reason of failed test */
    reasons: string[];
}

/** Action testing sandbox */
class ActionTest {
    /** Run testing */
    public static run(action: Action): TestResult {
        let result: TestResult = {
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
    }
    /** Returns "true" if entity is not "null" or "undefined" */
    private static isNotNil_(value: any): value is undefined {
        return (value !== null) && (value !== undefined);
    }
    /** Returns "true" if entity is array */
    private static isArray_(value: any): value is any[] {
        return (Object.prototype.toString.call(value) === '[object Array]')
    }
    /** Returns "true" if entity is a function */
    private static isFunction_(value: any): value is Function {
        return (value instanceof Function);
    }
    /** Returns "true" if entity is array of strings */
    private static isArrayOfStrings_(value: any): value is string[] {
        let result: boolean = ActionTest.isNotNil_(value) && ActionTest.isArray_(value);
        if (result) {
            for (let i = 0; i < value.length; i++) {
                if (typeof value[i] !== 'string') {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }
}

/** Condition testing sandbox */
class ConditionTest {
    /** Run testing */
    public static run(name: string, func: Condition): TestResult {
        let result: TestResult = {
            passed: true,
            reasons: []
        };

        if(typeof name !== 'string') {
            result.passed = false;
            result.reasons.push('Condition name must be a string');
        }

        if(!(func instanceof Function)) {
            result.passed = false;
            result.reasons.push('Condition must be a function')
        }

        return result;
    }
}

/** Common class of decision table */
export class DecisionTable {
    /**
     * Previous value of field "window.dt" which using
     * in "noConflict" static method. In Node.JS always equals
     * "undefined"
     */
    private static PREVIOUS_GLOBAL_NAMESPACE_: any = (function() {
        try {
            return window.dt;
        } catch (e) {
            return undefined;
        }
    })();
    /** All available conditions */
    private conditions_: Dictionary<(Condition | undefined)>;
    /** All available actions */
    private actions_: Action[];
    /** @constructor */
    public constructor() {
        this.conditions_ = {};
        this.actions_ = [];
    }
    /**
     * Special static method which returns Decision Table constructor
     * and set previous value to field "window.dt.DecisionTable".
     * In Node.JS it's just returns Decision Table constructor.
     */
    public static noConflict(): DecisionTableConstructor {
        try {
            const currentItem: DecisionTableConstructor = window.dt.DecisionTable;
            window.dt = DecisionTable.PREVIOUS_GLOBAL_NAMESPACE_;
            return currentItem;
        } catch (e) {
            return DecisionTable;
        }
    }
    /**
     * Special static method which provides simple testing
     * for your actions. In development environment this method
     * will be run for each adding action.
     */
    public static testAction(action: Action): TestResult {
        const result: TestResult = ActionTest.run(action);
        if (!result.passed) {
            console.error(`[decision_table] Action test failed:\n\t${result.reasons.join('\t\n')}`);
        }
        return result;
    }
    /**
     * Special static method which provides simple testing
     * for your conditions. In development environment this method
     * will be run for each adding condition.
     */
    public static testCondition(name: string, condition: Condition): TestResult {
        const result: TestResult = ConditionTest.run(name, condition);
        if (!result.passed) {
            console.error(`[decision_table] Condition test failed:\n\t${result.reasons.join('\t\n')}`);
        }
        return result;
    }
    /** Add new condition to table (will be override if exists) */
    public addCondition(name: string, func: Condition): void {
        if (process.env.NODE_ENV !== 'production') {
            const result: TestResult = DecisionTable.testCondition(name, func);
            if (!result.passed) {
                throw new Error(result.reasons.join('\t\n'));
            }
        }
        this.conditions_[name] = func;
    }
    /** Remove condition from table */
    public removeCondition(name: string): void {
        this.conditions_[name] = undefined;
    }
    /**
     * Add new action to table and returns its index
     * which provides action removing and changing
     */
    public addAction(action: Action): void {
        if (process.env.NODE_ENV !== 'production') {
            const result: TestResult = DecisionTable.testAction(action);
            if (!result.passed) {
                throw new Error(result.reasons.join('\t\n'));
            }
        }
        this.actions_.push(action);
    }
    /** Removes action by it's link */
    public removeAction(action: Action): void {
        this.actions_ = this.actions_.filter((value) => (value !== action));
    }
    /** Run table */
    public run(): void {
        let conditionsResults: Dictionary<boolean> = {};
        Object.keys(this.conditions_).forEach((key: string) => {
            const condition: (Condition | undefined) = this.conditions_[key];
            if (condition !== undefined) {
                conditionsResults[key] = condition();
            }
        });
        this.actions_.forEach((action: Action) => this.doAction_(action, conditionsResults));
    }
    /** Action execition function */
    private doAction_(action: Action, conditionsResults: Dictionary<boolean>): void {
        const whenTrue: boolean[] = (action.whenTrue || []).map((key: string) => (
            (conditionsResults[key] !== undefined ? conditionsResults[key] : false)
        ));
        const whenFalse: boolean[] = (action.whenFalse || []).map((key: string) => (
            (conditionsResults[key] !== undefined ? !conditionsResults[key] : false)
        ));
        const resultsFull: boolean[] = whenTrue.concat(whenFalse);

        let isRunnable: boolean = false;

        if (resultsFull.length > 0) {
            isRunnable = resultsFull.reduce(
                (previous: boolean, result: boolean) => (previous && result),
                true
            );
        }

        if (isRunnable) {
            action.execute();
        }
    }
}

/** Decision table constructor */
export interface DecisionTableConstructor {
    new(): DecisionTable;
}

// Declare Decision Table constructor in global namespace
declare global {
    interface Window {
        dt: {
            DecisionTable: DecisionTableConstructor;
        }
    }
    var dt: {
        DecisionTable: DecisionTable;
    }
}