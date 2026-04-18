// Jalali (Persian/Solar Hijri) Calendar Utilities
// Based on jalaali-js algorithm

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  let jy, jm, jd;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) -
    80 +
    gd +
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][gm - 1];

  jy = -1595 + 33 * div(days, 12053);
  days %= 12053;

  jy += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  jm = div(days, 31) + 1;
  jd = (days % 31) + 1;

  return { year: jy, month: jm, day: jd };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): GregorianDate {
  let gy, gm, gd;
  const jy2 = jm > 2 ? jy + 1 : jy;
  let days =
    365 * jy +
    div(jy2 + 3, 4) -
    div(jy2 + 99, 100) +
    div(jy2 + 399, 400) -
    355 +
    jd +
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][jm - 1];

  gy = 400 * div(days, 146097);
  days %= 146097;

  const flag = true;
  if (days >= 36525) {
    days--;
    gy += 100 * div(days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * div(days, 1461);
  days %= 1461;

  if (flag && days >= 366) {
    days--;
    gy += div(days, 365);
    days = (days % 365) + 1;
  }

  gm = div(days, 31) + 1;
  gd = (days % 31) + 1;

  return { year: gy, month: gm, day: gd };
}

export function formatJalaliDate(date: JalaliDate): string {
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  return `${date.day} ${months[date.month - 1]} ${date.year}`;
}

export function getTodayJalali(): JalaliDate {
  const today = new Date();
  return gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

export function convertToJalaliDateString(gregorianDate: string): string {
  const [year, month, day] = gregorianDate.split('-').map(Number);
  const jalali = gregorianToJalali(year, month, day);
  return `${jalali.year}-${String(jalali.month).padStart(2, '0')}-${String(jalali.day).padStart(2, '0')}`;
}

export function convertToGregorianDateString(jalaliDate: string): string {
  const [year, month, day] = jalaliDate.split('-').map(Number);
  const gregorian = jalaliToGregorian(year, month, day);
  return `${gregorian.year}-${String(gregorian.month).padStart(2, '0')}-${String(gregorian.day).padStart(2, '0')}`;
}
