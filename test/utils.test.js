import { validateNumber } from '../src/utils';

describe('validateNumber', () => {
  describe('input contains alphabet', () => {
    it('should return false', () => {
      expect(validateNumber('1ab')).toBe(false);
    });
  });

  describe('input is number', () => {
    it('should return true', () => {
      expect(validateNumber('123')).toBe(true);
    });
  });

  describe('input is Boolean', () => {
    it('should return false', () => {
      expect(validateNumber(true)).toBe(false);
    });
  });

  describe('input is object', () => {
    it('should return false', () => {
      expect(validateNumber({})).toBe(false);
    });
  });

  describe('input is Array', () => {
    it('should return false', () => {
      expect(validateNumber([])).toBe(false);
    });
  });

  describe('input is null', () => {
    it('should return false', () => {
      expect(validateNumber(null)).toBe(false);
    });
  });

  describe('input is undefined', () => {
    it('should return false', () => {
      expect(validateNumber(undefined)).toBe(false);
    });
  });
});
