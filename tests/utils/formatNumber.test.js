import formatNumber from '../../src/utils/formatNumber';

describe('Util formatNumber', () => {
  it('Valid value', () => {
    expect(formatNumber(0)).toBe(0);
    expect(formatNumber(0.00)).toBe(0);
    expect(formatNumber(0.)).toBe(0);
    expect(formatNumber(1.111)).toBe('1.11');
    expect(formatNumber(1.111)).toBe('1.11');
    expect(formatNumber(1.434905435783345345987435111)).toBe('1.43');
    expect(formatNumber(5786754342342342)).toBe('5786754342342342');
    expect(formatNumber("458723043569383204234364")).toBe('458723043569383204234364');
    expect(formatNumber("345.45")).toBe('345.45');
    expect(formatNumber("345.45546576")).toBe('345.45');
    expect(formatNumber("345.45546576")).toBe('345.45');
    expect(formatNumber('1..')).toBe('1.');
    expect(formatNumber('.')).toBe('');
  });

  it('Valid prestine', () => {
    expect(formatNumber(1.333, 1)).toBe('1.3');
    expect(formatNumber(1.333, 2)).toBe('1.33');
    expect(formatNumber(1.12345678901234567890, 10)).toBe('1.1234567890');
    expect(formatNumber("34565345656345345.345657234234", 12)).toBe('34565345656345345.345657234234');
    expect(() => {
      formatNumber(1.333, 0);
    }).toThrowError();
    expect(() => {
      formatNumber(1.333, -45);
    }).toThrowError();
  })
});
