import { TSESLint } from '@typescript-eslint/utils';
import { RuleRunner } from './rule-runner';

type SnapshotCreatorConfig = TSESLint.RuleTesterConfig & {
  cwd?: string;
};

export class SnapshotCreator {
  private readonly linter: TSESLint.Linter;

  public constructor(private readonly config: SnapshotCreatorConfig) {
    this.linter = new TSESLint.Linter({ cwd: config.cwd });
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
    rule: TSESLint.RuleModule<any, TOption, any>;
  }): RuleRunner<TOption> {
    if (!this.linter.getRules().has(ruleName)) {
      this.linter.defineRule(ruleName, rule);
    }

    return new RuleRunner<TOption>({
      code,
      ruleName,
      linter: this.linter,
      config: this.config,
    });
  }
}
