import { ConditionType } from './ConditionType';

/** Condition execution body function */
export interface ConditionBody {
    (...args: any[]): Promise<any> | any;
}

/** Condition */
export class Condition {
    /** Type of condition */
    public readonly type: ConditionType;
    /** Condition body */
    private body: ConditionBody;
    /** @constructor */
    private constructor(type: ConditionType, body: ConditionBody) {
        this.type = type;
        this.body = body;
    }
    /** Create synchronous condition */
    public static createSync(body: ConditionBody): Condition {
        return new Condition(ConditionType.SYNC, body);
    }
    /** Create asynchronous condition */
    public static createAsync(body: ConditionBody): Condition {
        return new Condition(ConditionType.ASYNC, body);
    }
    /** Check conditions */
    public check(...args: any[]): Promise<any> | any {
        return this.body(...args);
    }
}
