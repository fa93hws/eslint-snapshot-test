import { BaseWorker } from "./base";

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  render() {
    if (this.rule == null) {
      throw new Error('rule is not provided');
    }
    this.linter.defineRule('rule-name', this.rule);
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { 'rule-name': 'error' },
    });
    console.log(lintResult);
    return '';
  }
}
