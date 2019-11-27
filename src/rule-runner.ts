import { EOL } from 'os';
import {
  ValidTestCase,
  RuleTesterConfig,
  Linter,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper } from './position-helper';
import { assertExist } from './utils/preconditions';
import { markResult as _markResult, MarkResultFn } from './mark-result';

import merge = require('lodash.merge');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TestConfig<TOption extends readonly any[]> = Omit<
  ValidTestCase<TOption>,
  'code' | 'options' | 'filename'
> &
  Partial<RuleTesterConfig>;

export type RenderResult = {
  snapshot: string;
  lintMessages: Linter.LintMessage[];
  fixedOutput: string | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RuleRunner<TOption extends readonly any[]> {
  private _codeLines?: readonly string[];

  private ruleName: string;

  private ruleOption: Linter.RuleLevelAndOptions = ['error'];

  private filename?: string;

  private config: RuleTesterConfig;

  private readonly code: string;

  private readonly linter: Linter;

  private readonly positionHelper: PositionHelper;

  private readonly markResult: MarkResultFn;

  public constructor({
    code,
    config,
    linter,
    ruleName,
    markResult = _markResult,
  }: {
    code: string;
    linter: Linter;
    ruleName: string;
    config: RuleTesterConfig;
    markResult?: MarkResultFn;
  }) {
    this.code = code;
    this.config = config;
    this.linter = linter;
    this.ruleName = ruleName;
    this.markResult = markResult;
    this.positionHelper = new PositionHelper(this.codeLines);
  }

  private get codeLines() {
    if (this._codeLines == null) {
      this._codeLines = this.code.split(EOL);
    }
    return this._codeLines;
  }

  public withOptions(options: TOption) {
    this.ruleOption = ['error', ...options];
    return this;
  }

  public overrideConfig(config: TestConfig<TOption>) {
    this.config = merge(this.config, config);
    return this;
  }

  public withFileName(fileName: string) {
    this.filename = fileName;
    return this;
  }

  private get parameter(): [string, Linter.Config, string | undefined] {
    return [
      this.code,
      {
        ...this.config,
        rules: { [this.ruleName]: this.ruleOption },
      },
      this.filename,
    ];
  }

  public render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const lintResult = this.linter.verify(...this.parameter);
    const fixReport =
      this.linter.getRules().get(this.ruleName)?.meta?.fixable != null
        ? this.linter.verifyAndFix(...this.parameter)
        : undefined;
    const markedResult = this.markResult({
      lintResult,
      positionHelper: this.positionHelper,
      codeLines: this.codeLines,
    });
    return {
      lintMessages: lintResult,
      snapshot: markedResult,
      fixedOutput: fixReport?.output,
    };
  }
}
