export function assertExist<T>(
  para: T | undefined | null,
  message: string = 'parameter must exist',
) {
  if (para == null) {
    throw new Error(message)
  }
  return para;
}
