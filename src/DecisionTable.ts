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
    /** Add new condition to table (will be override if exists) */
    public addCondition(name: string, func: Condition): void {
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
        this.lintAction_(action);
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
    /** Analise and check action for correct signature */
    private lintAction_(action: Action): void {
        const isNotNilAndNotArray = (item: any) => (
            (item !== null && item !== undefined && !Array.isArray(item))
        );
        if (isNotNilAndNotArray(action.whenTrue)) {
            throw new Error('Action field "whenTrue" must be array of strings!');
        }
        if (isNotNilAndNotArray(action.whenFalse)) {
            throw new Error('Action field "whenFalse" must be array of strings!');
        }
        if (!(action.execute instanceof Function)) {
            throw new Error('Action field "execute" is required and must be a function!');
        }
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