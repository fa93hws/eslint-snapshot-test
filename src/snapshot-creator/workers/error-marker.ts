import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { assertExist } from '../../utils/preconditions';
import { EOL } from 'os';
import { BaseWorker } from "./base";

export class ErrorWorker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { [this.ruleName]: this.ruleOption },
    }, this.filename);
    return this.markError(lintResult);
  }

  private markError(lintResult: Linter.LintMessage[]) {
    const resultMarker = this.markResult({ lintResult, positionHelper: this.positionHelper });
    if (resultMarker.length === 0) {
      return EOL + this.code;
    }

    const markedCodes = [''];
    let markedIterIdx = 0;
    for (let i = 0; i < this.codeLines.length; i++) {
      markedCodes.push(this.codeLines[i]);
      if (markedIterIdx < resultMarker.length && i === resultMarker[markedIterIdx].afterLine) {
        markedCodes.push(resultMarker[markedIterIdx].text);
        markedIterIdx++;
      }
    }
    return markedCodes.join(EOL);
  }
}
