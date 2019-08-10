# How to use
```
import { SnapshotCreator } from 'eslint-snapshot-tester';
import { semi } from 'eslint/rules/semi';

// eslint option: https://eslint.org/docs/user-guide/configuring
const eslintOptions = {};
const snapshotCreator = SnapshotCreator(eslintOptions);

const code = "const a = 1";
const option = ["always"];
snapshotCreator
  .mark(code)
  .withOption(option)
  .onRule(semi)
  .toString();

snapshotCreator
  .fix(code)
  .withOption(option)
  .onRule(semi)
  .toString();
```
