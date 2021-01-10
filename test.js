const start_money = 10000
const monthly = 1000
let previous_year = (start_money + (monthly * 12)) * 1.1
for (i = 1; i < 5; i++) {
  previous_year = (previous_year + (monthly * 12)) * 1.1
}

console.log(previous_year)