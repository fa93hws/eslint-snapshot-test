import { EOL } from 'os';
import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper } from './position-helper';

type MarkedLine = {
  // To be inserted in the original code, start from 0
  afterLine: number;
  text: string;
};

export type MarkResultFn = (param: {
  lintResult: readonly Linter.LintMessage[];
  positionHelper: PositionHelper;
  codeLines: readonly string[];
}) => string;

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

const sortFn = (a: MarkedLine, b: MarkedLine) => a.afterLine - b.afterLine;

function markErrorOnCode(
  markedResult: readonly MarkedLine[],
  codeLines: readonly string[],
) {
  if (markedResult.length === 0) {
    return EOL + codeLines.join(EOL);
  }

  const markedCodes = [''];
  let markedIterIdx = 0;
  for (let i = 0; i < codeLines.length; i += 1) {
    markedCodes.push(codeLines[i]);
    if (
      markedIterIdx < markedResult.length &&
      i === markedResult[markedIterIdx].afterLine
    ) {
      markedCodes.push(markedResult[markedIterIdx].text);
      markedIterIdx += 1;
    }
  }
  return markedCodes.join(EOL);
}

export const markResult: MarkResultFn = ({
  codeLines,
  lintResult,
  positionHelper,
}) => {
  const result: MarkedLine[] = [];
  lintResult.forEach(r => {
    const range = PositionHelper.getRange(r);
    const positions = positionHelper.parsePosition(range);
    positions.forEach(position => {
      const waveString = drawWaveString(position.column);
      result.push({
        afterLine: position.line,
        text: `${waveString}    [${r.message}]`,
      });
    });
  });
  result.sort(sortFn);
  return markErrorOnCode(result, codeLines);
};
