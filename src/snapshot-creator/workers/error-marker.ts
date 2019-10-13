import { assertExist } from '../../utils/preconditions';
import { BaseWorker } from "./base";

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  render() {
    const ruleName = assertExist(this.ruleName, 'rule name must not be empty');
    const rule = assertExist(this.rule, 'rule must not be empty')
    this.linter.defineRule(ruleName, rule);
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { [ruleName]: ['error'] },
    });
    console.log(lintResult);
    return '';
  }
}
