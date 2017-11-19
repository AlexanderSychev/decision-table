# decision_table - development

Simple crib for developers (forkers, contributors etc).

## Terms

* Development environment - application and library running with environment variable
`NODE_ENV` which *not equals* `production`
* Production environment

## Revert from scratch

```bash
git clone git@github.com:AlexanderSychev/decision-table.git
cd decision-table
npm run prepare:dev
```

All source code in directory `./src`;

## Development stack
* TypeScript 2.4.2;
* Webpack 2.2.1;

## NPM lifecycle scripts

Just run `npm run <script name>`. All building and testing scripts defined
via custom NPM lifecycle scripts.

* *prepare:dev* - install development dependencies (not by "devDependencies" becaus that's guaratees that all this 
heavy shit *whill not be installed* by users and not ruin their dependencies tree)
* *compile:dev* - compile TypeScript code;
* *bundle:dev* - make development browser bundle (`lib/decision-table.dev.js`);
* *bundle:prod* - make production browser bundle (`lib/decision-table.dev.js`);
* *build:dev* - shortcut for `npm run compile:dev && npm run bundle:dev`;
* *build:prod* - shortcut for `npm run compile:dev && npm run bundle:prod`;
* *clean:dev* - removes all files from directories `dist/` and `lib/`,
* *test:dev* - run Node.JS test code in development environment;
* *test:prod* - run Node.JS test code in production environment;
* *prepublish* - before NPM publishing actions;