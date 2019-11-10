import { Linter } from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import { EOL } from "os";

export type Position = {
  line: {
    start: number;
    end: number | undefined;
  },
  column: {
    start: number;
    end: number | undefined;
  }
}

export class PositionHelper {
  private readonly lines: string[];
  public constructor(code: string) {
    this.lines = code.split(EOL);
  }

  public static getPosition(result: Linter.LintMessage): Position {
    return {
      line: {
        // line starts from 1 in eslint
        start: result.line - 1,
        end: result.endLine ? result.endLine - 1 : result.endLine,
      },
      column: {
        // column starts from 1 in eslint
        start: result.column - 1,
        end: result.endColumn ? result.endColumn - 1 : result.endColumn,
      },
    };
  }

  public getColumnOnLine(rawPosition: Position) {
    return {
      start: rawPosition.column.start,
      end: rawPosition.column.end ?? this.lines[rawPosition.line.start].length,
    };
  }
}
