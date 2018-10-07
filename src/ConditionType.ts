/** Type of condition */
export enum ConditionType {
    /** Synchronous condition (returns value directly) */
    SYNC = 'ConditionType.SYNC',
    /** Asynchronous condition (returns value as Promise) */
    ASYNC = 'ConditionType.ASYNC',
}
