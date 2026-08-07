const normalizeGrade = (g) => {
  if (!g) return '';
  let str = g.toUpperCase().trim();
  if (str.startsWith('XII') || str.startsWith('12')) return 'XII';
  if (str.startsWith('XI') || str.startsWith('11')) return 'XI';
  if (str.startsWith('X') || str.startsWith('10')) return 'X';
  return str.split(' ')[0];
}
console.log(normalizeGrade("X 1. Ibnu Sina"));
console.log(normalizeGrade("X-IPA 1"));
console.log(normalizeGrade("10 MIPA"));
console.log(normalizeGrade("XII 2. Ibnu"));
console.log(normalizeGrade("12 IPS"));
