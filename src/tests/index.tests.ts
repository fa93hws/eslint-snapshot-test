import { EOL } from 'os';
import { SnapshotCreator } from '../index';

/* eslint-disable @typescript-eslint/no-var-requires */
const noUnusedVar = require('eslint/lib/rules/no-unused-vars');
const semi = require('eslint/lib/rules/semi');
const noElseReturn = require('eslint/lib/rules/no-else-return');
/* eslint-enable @typescript-eslint/no-var-requires */

describe('when marking error to snapshot', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });

  it('generates snapshot for one line code', () => {
    const code = 'var a = 1;';
    const { snapshot } = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .render();
    expect(snapshot).toMatchSnapshot();
  });

  it('generates snapshot with rule option', () => {
    const code = `a = 1;${EOL}var b = 2;`;
    const { snapshot } = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .withOptions([{ vars: 'local' }])
      .render();
    expect(snapshot).toMatchSnapshot();
  });

  it('generates snapshot for multiple one line error', () => {
    const code = `var a = 1;${EOL}var b = 1;${EOL}var foo = 1;${EOL}fn(b);`;
    const { snapshot, lintMessages } = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .render();
    expect(lintMessages.length).toEqual(2);
    expect(snapshot).toMatchSnapshot();
  });

  it('generates snapshot for the error at last column', () => {
    const code = 'var a = 1';
    const { snapshot } = snapshotCreator
      .mark({ code, ruleName: 'semi', rule: semi })
      .render();
    expect(snapshot).toMatchSnapshot();
  });

  it('generates snapshot for multiple lines error', () => {
    const code = [
      'function test(a) {',
      '  if (a) {',
      '    return 2;',
      '  } else {',
      '    return 3;',
      '  }',
      '}',
    ].join(EOL);
    const { snapshot, lintMessages } = snapshotCreator
      .mark({ code, ruleName: 'no-else', rule: noElseReturn })
      .render();
    expect(lintMessages.length).toEqual(1);
    expect(snapshot).toMatchSnapshot();
  });
});
