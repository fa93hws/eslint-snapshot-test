import { RuleTesterConfig, Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { ErrorMarker } from './workers/error-marker';

export class SnapshotCreator {
  protected readonly linter: Linter = new Linter();
  public constructor(private readonly config: RuleTesterConfig) {
    this.linter.defineParser(config.parser, require(config.parser));
  }

  public mark<TOption extends readonly any[]>(code: string) {
    return new ErrorMarker<TOption>({
      linter: this.linter,
      config: this.config,
      code,
    });
  }
}
