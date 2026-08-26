export class TimeSystem {
  static getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[(month - 1) % 12] || 'Enero';
  }

  static getSemesterName(month: number): string {
    return month <= 6 ? '1er Semestre (Ene - Jun)' : '2do Semestre (Jul - Dic)';
  }

  static getCycleLabel(month: number, year: number): string {
    const semester = month <= 6 ? 'S1' : 'S2';
    return `${semester} ${year}`;
  }

  static advanceTime(currentYear: number, currentMonth: number): { year: number; month: number; isNewYear: boolean } {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    let isNewYear = false;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
      isNewYear = true;
    }

    return {
      year: nextYear,
      month: nextMonth,
      isNewYear
    };
  }

  static advanceMonths(
    currentYear: number,
    currentMonth: number,
    count: number
  ): { year: number; month: number; yearsPassed: number; isNewYearCrossed: boolean } {
    let y = currentYear;
    let m = currentMonth;
    let isNewYearCrossed = false;

    for (let i = 0; i < count; i++) {
      m++;
      if (m > 12) {
        m = 1;
        y++;
        isNewYearCrossed = true;
      }
    }

    return {
      year: y,
      month: m,
      yearsPassed: y - currentYear,
      isNewYearCrossed
    };
  }

  static calculateAge(birthYear: number, currentYear: number): number {
    if (!birthYear || isNaN(birthYear)) return 18;
    return Math.max(0, currentYear - birthYear);
  }

  static calculateCareerLengthYears(careerStartYear: number, currentYear: number): number {
    if (!careerStartYear || isNaN(careerStartYear)) return 0;
    return Math.max(0, currentYear - careerStartYear);
  }
}
