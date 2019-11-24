import { EOL } from 'os';
import {
  ValidTestCase,
  RuleTesterConfig,
  Linter,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper } from '../position-helper';
import { MarkResultFn, markResult as _markResult } from '../mark-result';

import merge = require('lodash.merge');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestConfig<TOption extends readonly any[]> = Omit<
  ValidTestCase<TOption>,
  'code' | 'options' | 'filename'
> &
  Partial<RuleTesterConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseWorker<TOption extends readonly any[]> {
  private _codeLines?: readonly string[];

  protected ruleName: string;

  protected ruleOption: Linter.RuleLevelAndOptions = ['error'];

  protected filename?: string;

  protected config: RuleTesterConfig;

  protected readonly code: string;

  protected readonly linter: Linter;

  protected readonly positionHelper: PositionHelper;

  protected readonly markResult: MarkResultFn;

  public constructor({
    code,
    config,
    linter,
    ruleName,
    markResult,
    positionHelper,
  }: {
    code: string;
    linter: Linter;
    ruleName: string;
    config: RuleTesterConfig;
    markResult?: MarkResultFn;
    positionHelper?: PositionHelper;
  }) {
    this.code = code;
    this.config = config;
    this.linter = linter;
    this.ruleName = ruleName;
    this.positionHelper = positionHelper ?? new PositionHelper(this.codeLines);
    this.markResult = markResult ?? _markResult;
  }

  protected get codeLines() {
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

  abstract render(): string;
}
