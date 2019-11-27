import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper, Range } from '../position-helper';

function createLintResult({
  column,
  line,
  endColumn,
  endLine,
}: {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}): Linter.LintMessage {
  return {
    column,
    line,
    endColumn,
    endLine,
    ruleId: null,
    message: '',
    nodeType: '',
    severity: 0,
    source: null,
  };
}

describe('PositionHelper', () => {
  describe('getRange', () => {
    it('offsets the line and column by -1', () => {
      const result = createLintResult({
        column: 2,
        line: 3,
        endColumn: 4,
        endLine: 5,
      });
      const position = PositionHelper.getRange(result);
      expect(position).toEqual(
        expect.objectContaining({
          line: { start: 2, end: 4 },
          column: { start: 1, end: 3 },
        }),
      );
    });
  });

  describe('parsePosition', () => {
    const positionHelper = new PositionHelper([
      'a'.repeat(5),
      'a'.repeat(7),
      'a'.repeat(9),
      'a'.repeat(5),
      'a'.repeat(14),
    ]);

    it('returns the start and end if both are given for one line error', () => {
      const range: Range = {
        line: { start: 1, end: 1 },
        column: { start: 2, end: 6 },
      };
      const got = positionHelper.parsePosition(range);
      expect(got).toEqual([{ column: { end: 6, start: 2 }, line: 1 }]);
    });

    it('ends at length if the column end is not given for one line error', () => {
      const range: Range = {
        line: { start: 1, end: 1 },
        column: { start: 2, end: undefined },
      };
      const got = positionHelper.parsePosition(range);
      expect(got).toEqual([{ line: 1, column: { start: 2, end: 7 } }]);
    });

    it('parses the error across multiple lines without end column', () => {
      const range: Range = {
        line: { start: 1, end: 3 },
        column: { start: 2, end: undefined },
      };
      const got = positionHelper.parsePosition(range);
      expect(got).toEqual([
        { line: 1, column: { start: 2, end: 7 } },
        { line: 2, column: { start: 0, end: 9 } },
        { line: 3, column: { start: 0, end: 5 } },
      ]);
    });

    it('parses the error across multiple lines', () => {
      const range: Range = {
        line: { start: 1, end: 3 },
        column: { start: 2, end: 2 },
      };
      const got = positionHelper.parsePosition(range);
      expect(got).toEqual([
        { line: 1, column: { start: 2, end: 7 } },
        { line: 2, column: { start: 0, end: 9 } },
        { line: 3, column: { start: 0, end: 2 } },
      ]);
    });

    it('parses the error across multiple without line end', () => {
      const range: Range = {
        line: { start: 1, end: undefined },
        column: { start: 2, end: undefined },
      };
      const got = positionHelper.parsePosition(range);
      expect(got).toEqual([
        { line: 1, column: { start: 2, end: 7 } },
        { line: 2, column: { start: 0, end: 9 } },
        { line: 3, column: { start: 0, end: 5 } },
        { line: 4, column: { start: 0, end: 14 } },
      ]);
    });
  });
});
