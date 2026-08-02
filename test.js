const announcements = [1,2,3,4,5];
const grouped = [];
for (let i = 0; i < announcements.length; i += 2) {
  grouped.push(announcements.slice(i, i + 2));
}
console.log(grouped);
