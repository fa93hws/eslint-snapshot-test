export function assertExist<T>(
  para: T | undefined | null,
  message: string = 'parameter must exist',
): asserts para is T {
  if (para == null) {
    throw new Error(message)
  }
}
