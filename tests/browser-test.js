window.addEventListener('load', function() {
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
});