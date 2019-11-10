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

snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .render();

snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .withOptions(["always"], "warn")
  .render();

snapshotCreator
  .mark(code)
  .onRule('semi', semi)
  .overrideConfig({ settings: { foo: 'foo' } })
  .render();

snapshotCreator
  .mark({ code, ruleName: 'semi', rule: semi })
  .withFileName('filename.ts')
  .render();
```
