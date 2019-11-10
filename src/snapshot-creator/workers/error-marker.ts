import { Linter } from 'eslint';
import { assertExist } from '../../utils/preconditions';
import { EOL } from 'os';
import { BaseWorker } from "./base";

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  // EOL will be inserted at the first line
  private lineAdded: number = 1;

  render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { [this.ruleName]: this.ruleOption },
    }, this.filename);
    return this.markError(lintResult);
  }

  private static getPosition(result: Linter.LintMessage) {
    return {
      line: {
        start: result.line,
        end: result.endLine,
      },
      column: {
        // column start with 1 in eslint
        start: result.column - 1,
        end: result.endColumn ? result.endColumn - 1 : result.endColumn,
      },
    };
  }

  private markError(lintResults: Linter.LintMessage[]) {
    const codeLines = [EOL, ...this.code.split(EOL), EOL];
    lintResults.forEach(lintResult => {
      const position = ErrorMarker.getPosition(lintResult);
      const startLine = position.line.start + this.lineAdded;
      const columnEnd = position.column.end ?? codeLines[startLine - 1].length;
      const waveString = ErrorMarker.getWaveString(position.column.start, columnEnd);
      const { message } = lintResult;
      const newLine = `${waveString}    [${message}]`;

      codeLines.splice(startLine, 0, newLine);
      this.lineAdded++;
    });
    return codeLines.join(EOL);
  }

  private static getWaveString(column: number, columnEnd: number) {
    const leadingSpaces = ' '.repeat(column);
    const waveLength = Math.max((columnEnd - column), 1)
    const waves = "~".repeat(waveLength);

    return leadingSpaces + waves;
  }
}
