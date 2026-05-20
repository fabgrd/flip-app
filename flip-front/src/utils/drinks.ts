export function drinkUnit(count: number, drinksEnabled: boolean): string {
  if (drinksEnabled) return `${count} GORGÉE${count > 1 ? 'S' : ''}`;
  return `${count} POINT${count > 1 ? 'S' : ''}`;
}

export function drinkUnitLower(count: number, drinksEnabled: boolean): string {
  if (drinksEnabled) return `${count} gorgée${count > 1 ? 's' : ''}`;
  return `${count} point${count > 1 ? 's' : ''}`;
}

export function drinkColumnLabel(drinksEnabled: boolean): string {
  return drinksEnabled ? 'GORGÉES' : 'POINTS';
}

export function drinkSoberLabel(drinksEnabled: boolean): string {
  return drinksEnabled ? 'SOBRE' : '0';
}
