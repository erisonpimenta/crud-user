export class StringUtils {
  public static isNullOrEmpty(val: string): boolean {
    if (val === undefined || val === null || val.trim() === '') {
      return true;
    }
    return false;
  }

  public static onlyNumber(number: string): string {
    return number.replace(/[^0-9]/g, '');
  }

  public static toDateDatabase(date: string): string {
    const dateParts = date.split('/');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  public static dateDatabaseToPtBr(date: string): string {
    const dateParts = date.split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }
}
