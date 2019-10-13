import { SnapshotCreator } from '../snapshot-creator';
const semiRule = require('eslint/lib/rules/semi');

describe('when set the config', () => {
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

  it.skip('should combine the config to worker', () => {
    snapshotCreator
      .mark(code)
      .onRule('semi', semiRule)
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

  it('throws if rule is not provided', () => {
    const fn = () => snapshotCreator.mark('').render();
    expect(fn).toThrowError();
  });

  it('throws if rule name is not provided', () => {
    const fn = () => snapshotCreator.mark('').onRule(undefined as any as string, semiRule).render();
    expect(fn).toThrowError();
  });
});
