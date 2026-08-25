export class TimeSystem {
  static getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[(month - 1) % 12] || 'Enero';
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

  static calculateAge(birthYear: number, currentYear: number): number {
    return Math.max(16, currentYear - birthYear);
  }

  static calculateCareerLengthYears(careerStartYear: number, currentYear: number): number {
    return Math.max(0, currentYear - careerStartYear);
  }
}
