import { Condition } from './Condition';
import { ConditionType } from './ConditionType';

/** Returns "true" if value is "null" or "undefined" */
const isNil = (value?: any): value is null | undefined => value === null || value === undefined;

export interface Action {
    (...args: any[]): any;
}

/** Special mark to skip condition to run */
export const SKIP: symbol = Symbol('SKIP');

/** Check actions */
export class DecisionTable {
    /** Conditions */
    private conditions: Condition[];
    /** Conditions results tuple */
    private conditionsResults: any[][];
    /** Actions */
    private actions: Action[];
    /** Actions running flags tuple */
    private actionsRunFlags: boolean[][];
    /** @constructor */
    private constructor() {
        this.conditions = [];
        this.conditionsResults = [];
        this.actions = [];
        this.actionsRunFlags = [];
    }
    /** Create decision table */
    public static create(): DecisionTable {
        return new DecisionTable();
    }
    public condition(condition: Condition, ...values: any[]): DecisionTable {
        const index: number = this.conditions.push(condition) - 1;
        for (let i = 0; i < values.length; i = i + 1) {
            if (isNil(this.conditionsResults[i])) {
                this.conditionsResults[i] = [];
            }
            this.conditionsResults[i][index] = values[i];
        }
        return this;
    }
    public action(action: Action, ...runFlags: boolean[]): DecisionTable {
        const index: number = this.actions.push(action) - 1;
        for (let i = 0; i < runFlags.length; i = i + 1) {
            if (isNil(this.actionsRunFlags[i])) {
                this.actionsRunFlags[i] = [];
            }
            this.actionsRunFlags[i][index] = runFlags[i];
        }
        return this;
    }
    /** Run table */
    public async run(...args: any[][]): Promise<void> {
        const results: any[] = await Promise.all(
            this.conditions.map((condition, index) => condition.check(...args[index])),
        );
        this.runInternal(results);
    }
    /** Run synchronous */
    public runSync(...args: any[][]): void {
        if (!this.canBeRunSync()) {
            throw new Error('Every condition must be synchronous');
        }
        const results: any[] = this.conditions.map((condition, index) => condition.check(...args[index]));
        this.runInternal(results);
    }
    /** Common table resolving method */
    protected runInternal(results: any[]): void {
        const matchesIndex: number = this.conditionsResults.findIndex(matches => this.matchPatterns(results, matches));
        if (matchesIndex !== -1) {
            const matches = this.conditionsResults[matchesIndex];
            const runFlags = this.actionsRunFlags[matchesIndex];
            for (let i = 0; i < this.actions.length; i = i + 1) {
                if (runFlags[i]) {
                    this.actions[i](...matches);
                }
            }
        } else {
            console.warn('NO MATCHES');
        }
    }
    /** Returns "true" if all conditions are synchronous */
    private canBeRunSync(): boolean {
        return this.conditions.every(({ type }) => type === ConditionType.SYNC);
    }
    /** Match patterns */
    private matchPatterns(values: any[], samples: any[]): boolean {
        return values.reduce((previous, current, index) => this.isPassed(current, samples[index]) && previous, true);
    }
    /** Is passed */
    private isPassed(value: any, sample: any = SKIP): boolean {
        let result: boolean;
        if (sample === SKIP) {
            result = true;
        } else {
            result = value === sample;
        }
        return result;
    }
}
