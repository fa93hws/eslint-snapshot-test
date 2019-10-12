import { RuleTesterConfig } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { ErrorMarker } from './workers/error-marker';

export class SnapshotCreator {
  private readonly config: RuleTesterConfig;
  public constructor(config: RuleTesterConfig) {
    this.config = config;
  }

  public mark<TOption extends readonly any[]>(code: string) {
    return new ErrorMarker<TOption>(this.config, code);
  }
}
