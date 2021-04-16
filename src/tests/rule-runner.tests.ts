import {
  Linter,
  RuleTesterConfig,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { RuleRunner } from '../rule-runner';
import { createAssertConfigRule } from '../utils/testing-rules/assert-config';

describe('ruleRunner', () => {
  describe('when providing configs', () => {
    const config = ({} as unknown) as RuleTesterConfig;
    const code = '';
    const ruleName = 'ruleName';
    let linter: Linter;

    beforeEach(() => {
      linter = new Linter();
    });

    it('overrides the filename', () => {
      const wantFileName = 'want.filename.tsx';
      const callback = jest.fn();
      const rule = createAssertConfigRule((context) =>
        callback(context.getFilename()),
      );
      linter.defineRule(ruleName, rule);
      new RuleRunner({ code, linter, ruleName, config })
        .withFileName(wantFileName)
        .render();
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(wantFileName);
    });

    it('produces <input> if the filename is not provided', () => {
      const callback = jest.fn();
      const rule = createAssertConfigRule((context) => {
        callback(context.getFilename());
      });
      linter.defineRule(ruleName, rule);
      new RuleRunner({ code, linter, ruleName, config }).render();
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith('<input>');
    });

    it('can add the settings', () => {
      const callback = jest.fn();
      const wantSetting = { a: 1, b: 2, c: 3 };
      const rule = createAssertConfigRule((context) => {
        callback(context.settings);
      });
      linter.defineRule(ruleName, rule);
      new RuleRunner({ code, linter, ruleName, config })
        .overrideConfig({ settings: wantSetting })
        .render();
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(wantSetting);
    });

    it('overrides ecmaVersion in parserOptions', () => {
      const callback = jest.fn();
      const wantParserOptions = {
        ecmaVersion: 6,
      };
      const rule = createAssertConfigRule((context) => {
        callback(context.parserOptions);
      });
      linter.defineRule(ruleName, rule);
      new RuleRunner({ code, linter, ruleName, config })
        .overrideConfig({ parserOptions: { ecmaVersion: 6 } })
        .render();
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(wantParserOptions);
    });
  });

  describe('when calling render', () => {
    const markResult = jest.fn();

    function mockLinter({
      lintMessages,
      fixReport,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lintMessages: readonly any[];
      fixReport?: { output: string };
    }): Linter {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const linter: any = {
        verify: () => lintMessages,
        verifyAndFix: () => fixReport,
        getRules: () => ({
          get: () => ({
            meta: {
              fixable: fixReport == null ? false : 'code',
            },
          }),
        }),
      };
      return (linter as unknown) as Linter;
    }

    function createRuleRunner({
      code = '',
      fixReport,
      lintMessages,
    }: {
      code?: string;
      fixReport?: { output: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lintMessages: readonly any[];
    }) {
      return new RuleRunner({
        code,
        config: { parser: 'any' },
        linter: mockLinter({ lintMessages, fixReport }),
        ruleName: 'any',
        markResult,
      });
    }

    beforeEach(() => {
      markResult.mockClear();
    });

    it('returns lintMessages if the rule is not fixable', () => {
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { lintMessages } = ruleRunner.render();
      expect(lintMessages).toEqual([{ a: 1 }]);
    });

    it('returns empty fixedOutput if the rule is not fixable', () => {
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { fixedOutput } = ruleRunner.render();
      expect(fixedOutput).toEqual(undefined);
    });

    it('returns the snapshot from markResult', () => {
      markResult.mockReturnValue('return value');
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { snapshot } = ruleRunner.render();
      expect(snapshot).toEqual('return value');
    });

    it('returns the lintMessages if the rule is fixable', () => {
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { lintMessages } = ruleRunner.render();
      expect(lintMessages).toEqual([{ a: 1 }]);
    });

    it('returns the fixedSnapshot if the rule is fixable', () => {
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { fixedOutput } = ruleRunner.render();
      expect(fixedOutput).toEqual('fixed');
    });

    it('returns the snapshot from markResult if the rule is fixable', () => {
      markResult.mockReturnValue('return value');
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { snapshot } = ruleRunner.render();
      expect(snapshot).toEqual('return value');
    });
  });
});
