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

  static getSemesterShort(month: number): string {
    return month <= 6 ? '1er Semestre' : '2do Semestre';
  }

  static isYearStart(month: number): boolean {
    return month <= 2;
  }

  static isMidYear(month: number): boolean {
    return month >= 6 && month <= 7;
  }

  static isYearEnd(month: number): boolean {
    return month >= 11;
  }

  static getSeasonDescription(month: number): string {
    if (month <= 2) return 'a comienzos de año';
    if (month <= 5) return 'durante el primer semestre';
    if (month <= 8) return 'a mitad de año (2do semestre)';
    if (month <= 10) return 'avanzado el segundo semestre';
    return 'en la recta final del año';
  }

  static getTimingPhrase(month: number, year?: number): string {
    const monthName = this.getMonthName(month);
    if (month <= 2) return year ? `A comienzos de ${year} (${monthName})` : 'A comienzos de año';
    if (month <= 5) return year ? `En pleno primer semestre de ${year} (${monthName})` : 'Durante el primer semestre';
    if (month <= 8) return year ? `A mitad del año ${year} (${monthName} / 2do Semestre)` : 'A mitad de año (2do semestre)';
    if (month <= 10) return year ? `Avanzado el segundo semestre de ${year} (${monthName})` : 'Avanzado el segundo semestre';
    return year ? `Justo antes de finalizar el año ${year} (${monthName})` : 'Justo antes de finalizar el año';
  }

  static getCalendarLabel(month: number, year: number): string {
    const monthName = this.getMonthName(month);
    const semester = month <= 6 ? '1er Semestre' : '2do Semestre';
    return `Año ${year} • M ${month} (${monthName} / ${semester})`;
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
