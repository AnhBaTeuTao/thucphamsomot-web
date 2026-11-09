export function uncertainOrderNote(note: string | null | undefined) {
  return /nhiều khả năng|co the|có thể|kiểm lại|kiem lai|có phải|co phai|chưa rõ|chua ro|cần xác nhận|can xac nhan|please confirm|possibly|maybe|待确认|可能|核实/i.test(note || '');
}

export function certainSkuName(sku: string, inputName: string, knownNames: string[], normalize: (value: string) => string) {
  const normalized = normalize(inputName);
  return !normalized || normalized === normalize(sku) || knownNames.includes(normalized);
}

export function certainUniqueName(matchCount: number, note: string | null | undefined) {
  return matchCount === 1 && !uncertainOrderNote(note);
}
