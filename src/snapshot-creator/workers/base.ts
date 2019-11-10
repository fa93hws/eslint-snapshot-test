import { ValidTestCase, RuleTesterConfig, Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code' | 'options' | 'filename'> & Partial<RuleTesterConfig>;

export abstract class BaseWorker<TOption extends readonly any[]> {
  protected ruleName: string;
  protected ruleOption: Linter.RuleLevelAndOptions = ['error'];
  protected filename?: string;
  protected config: RuleTesterConfig;
  protected readonly code: string;
  protected readonly linter: Linter;

  public constructor({ config, code, linter, ruleName }: {
    code: string;
    linter: Linter;
    ruleName: string;
    config: RuleTesterConfig;
  }) {
    this.code = code;
    this.config = config;
    this.linter = linter;
    this.ruleName = ruleName;
  }

  public withOptions(options: TOption) {
    this.ruleOption = ['error', ...options];
    return this;
  }

  // public overrideConfig(config: TestConfig<TOption>) {
  //   this.config = merge(this.config, config);
  //   return this;
  // }

  public withFileName(fileName: string) {
    this.filename = fileName;
    return this;
  }

  abstract render(): string;
}
