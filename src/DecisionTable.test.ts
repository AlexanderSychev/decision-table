import * as assert from 'assert';

import { DecisionTable, SKIP, Condition } from '../dist';

const DELAY: number = 150;
const sleep = (): Promise<void> => new Promise(resolve => setTimeout(resolve, DELAY));

const createCondition = (isAsync: boolean): Condition =>
    isAsync
        ? Condition.createAsync(async (arg: number) => {
              await sleep();
              return arg;
          })
        : Condition.createSync((arg: number) => arg);

const createConditions = (
    isAsyncA: boolean,
    isAsyncB: boolean,
    isAsyncC: boolean,
): [Condition, Condition, Condition] => [
    createCondition(isAsyncA),
    createCondition(isAsyncB),
    createCondition(isAsyncC),
];

const taskType = (isAsync: boolean): string => (isAsync ? 'async' : 'sync');

const makeTestCase = (isAsyncA: boolean, isAsyncB: boolean, isAsyncC: boolean) => {
    const description: string =
        `Condition A is ${taskType(isAsyncA)}, Condition B is ${taskType(isAsyncB)}, ` +
        `Condition C is ${taskType(isAsyncC)}`;
    describe(description, () => {
        const [conditionA, conditionB, conditionC] = createConditions(isAsyncA, isAsyncB, isAsyncC);

        let executed: number[];

        const table = DecisionTable.create()
            .condition(conditionA, 0, 2, SKIP, 2)
            .condition(conditionB, 1, SKIP, SKIP, 2)
            .condition(conditionC, 0, 0, 1, 2)
            .action(() => executed.push(1), true, false, true, false)
            .action(() => executed.push(2), false, true, true, false)
            .action(() => executed.push(3), false, true, false, false)
            .action(() => executed.push(4), false, false, false, true);
        it('A = 0, B = 1, C = 0', async () => {
            executed = [];
            await table.run([0], [1], [0]);
            assert.equal(executed.join(), '1');
        });
        it('A = 2, C = 0, B skipped', async () => {
            executed = [];
            await table.run([2], [], [0]);
            assert.equal(executed.join(), '2,3');
        });
        it('C = 1, A skipped, B skipped', async () => {
            executed = [];
            await table.run([], [], [1]);
            assert.equal(executed.join(), '1,2');
        });
        it('A = 2, B = 2, C = 2', async () => {
            executed = [];
            await table.run([2], [2], [2]);
            assert.equal(executed.join(), '4');
        });
    });
};

const makeSyncTest = () => {
    describe('Sync running', () => {
        const [conditionA, conditionB, conditionC] = createConditions(false, false, false);

        let executed: number[];

        const table = DecisionTable.create()
            .condition(conditionA, 0, 2, SKIP, 2)
            .condition(conditionB, 1, SKIP, SKIP, 2)
            .condition(conditionC, 0, 0, 1, 2)
            .action(() => executed.push(1), true, false, true, false)
            .action(() => executed.push(2), false, true, true, false)
            .action(() => executed.push(3), false, true, false, false)
            .action(() => executed.push(4), false, false, false, true);
        it('A = 0, B = 1, C = 0', () => {
            executed = [];
            table.runSync([0], [1], [0]);
            assert.equal(executed.join(), '1');
        });
        it('A = 2, C = 0, B skipped', () => {
            executed = [];
            table.runSync([2], [], [0]);
            assert.equal(executed.join(), '2,3');
        });
        it('C = 1, A skipped, B skipped', () => {
            executed = [];
            table.runSync([], [], [1]);
            assert.equal(executed.join(), '1,2');
        });
        it('A = 2, B = 2, C = 2', () => {
            executed = [];
            table.runSync([2], [2], [2]);
            assert.equal(executed.join(), '4');
        });
    });
};

const testSyncError = () => {
    it('Throws error if trying to "runSync" when table has async conditions', () => {
        const [conditionA, conditionB, conditionC] = createConditions(false, true, false);

        const executed: number[] = [];

        const table = DecisionTable.create()
            .condition(conditionA, 0, 2, SKIP, 2)
            .condition(conditionB, 1, SKIP, SKIP, 2)
            .condition(conditionC, 0, 0, 1, 2)
            .action(() => executed.push(1), true, false, true, false)
            .action(() => executed.push(2), false, true, true, false)
            .action(() => executed.push(3), false, true, false, false)
            .action(() => executed.push(4), false, false, false, true);
        try {
            table.runSync([0], [1], [0]);
        } catch (error) {
            assert.equal(String(error), 'Error: Every condition must be synchronous');
        }
    });
};

describe('DecisionTable', () => {
    makeTestCase(true, true, true);
    makeTestCase(true, true, false);
    makeTestCase(true, false, false);
    makeTestCase(true, false, true);
    makeTestCase(false, false, false);
    makeTestCase(false, false, true);
    makeSyncTest();
    testSyncError();
});
