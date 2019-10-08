import { BaseWorker } from "./base";

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  render() {
    return '';
  }
}
