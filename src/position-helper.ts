import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';

export type Range = {
  line: {
    start: number;
    end: number | undefined;
  };
  column: {
    start: number;
    end: number | undefined;
  };
};

type Position = {
  line: number;
  column: {
    start: number;
    end: number;
  };
};

export class PositionHelper {
  private readonly lineWidths: readonly number[];

  public constructor(lines: readonly string[]) {
    this.lineWidths = lines.map(l => l.length);
  }

  public static getRange(result: Linter.LintMessage): Range {
    return {
      line: {
        // line starts from 1 in eslint
        start: Math.max(0, result.line - 1),
        end: result.endLine ? result.endLine - 1 : result.endLine,
      },
      column: {
        // column starts from 1 in eslint
        start: Math.max(0, result.column - 1),
        end: result.endColumn ? result.endColumn - 1 : result.endColumn,
      },
    };
  }

  private static getColumnStart(range: Range, lineNumber: number): number {
    return lineNumber === range.line.start ? range.column.start : 0;
  }

  private getColumnEnd(range: Range, lineNumber: number): number {
    return range.line.end != null && range.line.end === lineNumber
      ? range.column.end ?? this.lineWidths[lineNumber]
      : this.lineWidths[lineNumber];
  }

  private getColumn(range: Range, lineNumber: number) {
    return {
      start: PositionHelper.getColumnStart(range, lineNumber),
      end: this.getColumnEnd(range, lineNumber),
    };
  }

  public parsePosition(range: Range): Position[] {
    const endLine = range.line.end ?? this.lineWidths.length - 1;
    const result = [];
    for (let i = range.line.start; i <= endLine; i += 1) {
      result.push({
        line: i,
        column: this.getColumn(range, i),
      });
    }
    return result;
  }
}
