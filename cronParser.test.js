const { cronParser } = require('./cronParser');

console.log("CRON PARSER TEST CASES");
console.log("=".repeat(30));
// Test 1 - Valid basic expression with step values
console.log("Input: */15 0 1,15 * 1-5 /usr/bin/find");
console.log("Expected:", cronParser("*/15 0 1,15 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 2 - Valid with command containing spaces
console.log("Input: */15 0 1,15 * 1-5 /usr/bin/find -name test");
console.log("Expected: ", cronParser("*/15 0 1,15 * 1-5 /usr/bin/find -name test"));

console.log("=".repeat(30));

// Test 3 - Valid with complex ranges
console.log("Input: 1-5,10,20-25 */2 1-15/2 * 0,6 /backup.sh");
console.log("Expected: ", cronParser("1-5,10,20-25 */2 1-15/2 * 0,6 /backup.sh"));

console.log("=".repeat(30));

// Test 4 - Invalid minute (out of range)
console.log("Input: 60 0 1,15 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("60 0 1,15 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 5 - Invalid hour (out of range)
console.log("Input: */15 24 1,15 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("*/15 24 1,15 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 6 - Invalid day of month (out of range)
console.log("Input: */15 0 32 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("*/15 0 32 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 7 - Invalid step value
console.log("Input: */0 0 1 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("*/0 0 1 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 8 - Invalid range (start > end)
console.log("Input: 0 0 15-10 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("0 0 15-10 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 9 - Empty command
console.log("Input: 0 0 1 * 1-5 ");
console.log("Expected: ", cronParser("0 0 1 * 1-5 "));

console.log("=".repeat(30));

//Test 10 invalid data
console.log("Input: 0 0 1 *");
console.log("Expected: ", cronParser("0 0 1 *"));

console.log("=".repeat(30));

// Test 11 - Valid with range and step
console.log("Input: 1-30/5 0 1 * 1-5 /usr/bin/find");
console.log("Expected: ", cronParser("1-30/5 0 1 * 1-5 /usr/bin/find"));

console.log("=".repeat(30));

// Test 12 - All value included
console.log("Input: * * * * * /usr/bin/backup");
console.log("Expected: ", cronParser("* * * * * /usr/bin/backup"));

console.log("=".repeat(30));

// Test 13 - Equal range
console.log("Input: 5-5 12 15 6 * /command");
console.log("Expected: ", cronParser("5-5 12 15 6 * /command"));

console.log("=".repeat(30));

// Test 14 - Boundary values
console.log("Input: 59 23 31 12 6 /max-values");
console.log("Expected: ", cronParser("59 23 31 12 6 /max-values"));

console.log("=".repeat(30));

// Test 15 - Minimum values
console.log("Input: 0 0 1 1 0 /min-values");
console.log("Expected: ", cronParser("0 0 1 1 0 /min-values"));
