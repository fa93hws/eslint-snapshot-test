import { SnapshotCreator } from '../snapshot-creator';
const semiRule = require('eslint/lib/rules/semi');

describe.skip('when set the config', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });
  const code = 'const a = 1';
  const options = ['always'];
  const config = {};

  it('should combine the config to worker', () => {
    snapshotCreator
      .mark(code)
      .onRule(semiRule)
      .withOptions(options)
      .overrideConfig(config);

    expect((snapshotCreator as any).config).toEqual({
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
      parser: '@typescript-eslint/parser',
      options: ['always'],
    });
  });
});
