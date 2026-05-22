console.time("toLocaleString");
for(let i=0; i<100000; i++) {
    (1234567).toLocaleString();
}
console.timeEnd("toLocaleString");

console.time("Intl.NumberFormat");
const formatter = new Intl.NumberFormat();
for(let i=0; i<100000; i++) {
    formatter.format(1234567);
}
console.timeEnd("Intl.NumberFormat");
