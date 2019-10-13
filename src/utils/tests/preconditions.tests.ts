import { assertExist } from '../preconditions';

describe('assertExist', () => {
  it('return the value for 0', () => {
    const zero = assertExist(0);
    expect(zero).toEqual(0);
  });

  it('return the value for false', () => {
    const negative = assertExist(false);
    expect(negative).toEqual(false);
  });

  it('return the value for empty object', () => {
    const emptyObject = assertExist({});
    expect(emptyObject).toEqual({});
  });

  it('return the value for empty array', () => {
    const emptyArray = assertExist([]);
    expect(emptyArray).toEqual([]);
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
