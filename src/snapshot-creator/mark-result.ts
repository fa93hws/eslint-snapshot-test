import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper } from './position-helper';

export type MarkedLine = {
  // To be inserted in the original code, start from 0
  afterLine: number;
  text: string;
};

export type MarkResultFn = (param: {
  lintResult: readonly Linter.LintMessage[];
  positionHelper: PositionHelper;
}) => MarkedLine[];

function drawWaveString({
  start: columnStart,
  end: columnEnd,
}: {
  start: number;
  end: number;
}) {
  const leadingSpaces = ' '.repeat(columnStart);
  const waveLength = Math.max(columnEnd - columnStart, 1);
  const waves = '~'.repeat(waveLength);

  return leadingSpaces + waves;
}

export const markResult: MarkResultFn = ({ lintResult, positionHelper }) =>
  lintResult.map(r => {
    const position = PositionHelper.getPosition(r);
    // TODO: an error across multiple lines
    const errorPositionColumn = positionHelper.getColumnOnLine(position);
    const waveString = drawWaveString(errorPositionColumn);
    return {
      afterLine: position.line.start,
      text: `${waveString}    [${r.message}]`,
    };
  });
