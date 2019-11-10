import merge = require('lodash.merge');
import { ValidTestCase, RuleTesterConfig, Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { PositionHelper } from '../position-helper';

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code' | 'options' | 'filename'> & Partial<RuleTesterConfig>;

export abstract class BaseWorker<TOption extends readonly any[]> {
  protected ruleName: string;
  protected ruleOption: Linter.RuleLevelAndOptions = ['error'];
  protected filename?: string;
  protected config: RuleTesterConfig;
  protected readonly code: string;
  protected readonly linter: Linter;
  protected readonly positionHelper: PositionHelper;

  public constructor({ config, code, linter, ruleName, positionHelper }: {
    code: string;
    linter: Linter;
    ruleName: string;
    config: RuleTesterConfig;
    positionHelper?: PositionHelper;
  }) {
    this.code = code;
    this.config = config;
    this.linter = linter;
    this.ruleName = ruleName;
    this.positionHelper = positionHelper ?? new PositionHelper(code);
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
