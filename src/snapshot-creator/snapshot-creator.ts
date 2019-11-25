import {
  RuleTesterConfig,
  Linter,
  RuleModule,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { ErrorWorker } from './workers/error-worker';

export class SnapshotCreator {
  private readonly linter: Linter = new Linter();

  public constructor(private readonly config: RuleTesterConfig) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.linter.defineParser(config.parser, require(config.parser));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mark<TOption extends readonly any[]>({
    code,
    ruleName,
    rule,
  }: {
    code: string;
    ruleName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rule: RuleModule<any, TOption, any>;
  }) {
    if (!this.linter.getRules().has(ruleName)) {
      this.linter.defineRule(ruleName, rule);
    }

    return new ErrorWorker<TOption>({
      code,
      ruleName,
      linter: this.linter,
      config: this.config,
    });
  }
}
