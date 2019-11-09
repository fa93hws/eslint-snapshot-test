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
const ruleConfig = {
  options: ["always"],
  filename: string,
};
snapshotCreator
  .mark(code)
  .onRule('semi', semi)
  .withOption(ruleConfig)
  .render();

snapshotCreator
  .fix(code)
  .onRule('semi', semi)
  .withOption(ruleConfig)
  .render();
```
