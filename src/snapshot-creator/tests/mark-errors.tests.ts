import { SnapshotCreator } from "../snapshot-creator";
import { EOL } from 'os';
const noUnusedVar = require('eslint/lib/rules/no-unused-vars');

describe('when marking error to snapshot', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });

  it('should generate the snapshot correctly for one line code', () => {
    const code = 'var a = 1;';
    const result = snapshotCreator
    .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
    .render();
    expect(result).toMatchSnapshot();
  });

  it('should generate the snapshot correctly with rule option', () => {
    const code = `a = 1;${EOL}var b = 2;`;
    const result = snapshotCreator
    .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
    .withOptions([{ vars: 'local' }])
    .render();
    expect(result).toMatchSnapshot();
  });

  it('should generate the snapshot correctly for errors in multiple lines', () => {
    const code = `var a = 1;${EOL}var b = 1;${EOL}var c = 1;${EOL}fn(b);`;
    const result = snapshotCreator
    .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
    .render();
    expect(result).toMatchSnapshot();
  });
});
