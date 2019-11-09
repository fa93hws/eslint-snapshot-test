import { assertExist } from '../preconditions';

describe('assertExist', () => {
  it('does not throw for 0', () => {
    expect(() => assertExist(0)).not.toThrow();
  });

  it('does not throw for false', () => {
    expect(() => assertExist(false)).not.toThrow();
  });

  it('does not throw for empty object', () => {
    expect(() => assertExist({})).not.toThrow();
  });

  it('does not throw for empty array', () => {
    expect(() => assertExist([])).not.toThrow();
  });

  it('throws for the undefined', () => {
    const fn = () => assertExist(undefined);
    expect(fn).toThrowError();
  });

  it('throws for the null', () => {
    const fn = () => assertExist(null);
    expect(fn).toThrowError();
  });

  it('throws the exact message as input', () => {
    const message = 'message';
    const fn = () => assertExist(undefined, message);
    expect(fn).toThrowError('message');
  });
});
