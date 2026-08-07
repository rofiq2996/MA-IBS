const getGrade = (className) => {
    if (!className) return 'X'; // default? or unassigned?
    let firstPart = className.split(' ')[0].toUpperCase();
    if (firstPart === '10') return 'X';
    if (firstPart === '11') return 'XI';
    if (firstPart === '12') return 'XII';
    return firstPart;
}
console.log(getGrade("X 1. Ibnu Sina"));
console.log(getGrade("10"));
console.log(getGrade(""));
