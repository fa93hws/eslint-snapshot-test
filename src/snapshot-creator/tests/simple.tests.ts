import { SnapshotCreator } from '../snapshot-creator';
const semiRule = require('eslint/lib/rules/semi');

describe('some', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });
  const code = 'const a = 1';
  const config = {
    options: ['always'],
  };

  it('should', () => {
    snapshotCreator
      .mark(code)
      .onRule(semiRule)
      .withConfig(config)
    console.log(snapshotCreator);
  });
});


// const code = "const a = 1";
// const ruleConfig = {
//   options: ["always"],
// };
// snapshotCreator
//   .mark(code)
//   .onRule(semi)
//   .withConfig(ruleConfig)
//   .toString();

// snapshotCreator
//   .fix(code)
//   .onRule(semi)
//   .withConfig(ruleConfig)
//   .toString();
