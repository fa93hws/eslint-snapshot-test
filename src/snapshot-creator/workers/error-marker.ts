import { Linter } from 'eslint';
import { assertExist } from '../../utils/preconditions';
import { EOL } from 'os';
import { BaseWorker } from "./base";

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  // An EOL will be inserted at the beginning.
  private lineAdded: number = 1;

  render() {
    const ruleName = assertExist(this.ruleName, 'rule name must not be empty');
    const rule = assertExist(this.rule, 'rule must not be empty')
    this.linter.defineRule(ruleName, rule);
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { [ruleName]: ['error'] },
    });
    return this.markError(lintResult);
  }

  private getPosition(result: Linter.LintMessage) {
    return {
      line: {
        start: result.line,
        end: result.endLine,
      },
      column: {
        start: result.column,
        end: result.endColumn,
      },
    };
  }

  private markError(lintResults: Linter.LintMessage[]) {
    const codeLines = [EOL, ...this.code.split(EOL), EOL];
    lintResults.forEach(lintResult => {
      const position = this.getPosition(lintResult);
      const startLine = position.line.start + this.lineAdded;
      const columnEnd = position.column.end || codeLines[startLine - 1].length;
      const waveString = ErrorMarker.getWaveString(position.column.start, columnEnd);
      const { message } = lintResult;
      const newLine = `${waveString}    [${message}]`;

      codeLines.splice(startLine, 0, newLine);
      this.lineAdded++;
    });
    return codeLines.join(EOL);
  }

  static getWaveString(column: number, columnEnd: number) {
    const leadingSpaces = ' '.repeat(column - 1);
    const waves = "~".repeat(columnEnd - column);

    return leadingSpaces + waves;
  }
}
