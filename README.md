![GithubCI](https://github.com/fa93hws/eslint-snapshot-test/workflows/CI/badge.svg)
![Codecov](https://codecov.io/gh/fa93hws/eslint-snapshot-test/branch/master/graph/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/eslint-snapshot-test.svg)](https://badge.fury.io/js/eslint-snapshot-test)
![TypescriptStrict](https://camo.githubusercontent.com/41c68e9f29c6caccc084e5a147e0abd5f392d9bc/68747470733a2f2f62616467656e2e6e65742f62616467652f547970655363726970742f7374726963742532302546302539462539322541412f626c7565)

# How to use

```
import { SnapshotCreator } from 'eslint-snapshot-tester';
import { semi } from 'eslint/rules/semi';

const eslintOptions = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
};
const snapshotCreator = new SnapshotCreator(eslintOptions);

const code = "const a = 1";

const { snapshot } = snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .render();

const { snapshot } = snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .withOptions(["always"], "warn")
  .render();

const { snapshot } = snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .overrideConfig({ settings: { foo: 'foo' } })
  .render();

const { snapshot } = snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .withFileName('filename.ts')
  .render();
```
