# Cron Parser

## Aim

A command-line application that parses a cron string and expands each field to show the times at which it will run. The parser supports the standard cron format with five time fields (minute, hour, day of month, month, and day of week) plus a command.

## Features

-Parses standard 5-field cron expressions
- Supports wildcards (`*`)
-  Supports ranges (`1-5`)
-  Supports step values (`*/15`, `1-30/5`)
-  Supports comma-separated lists (`1,15,30`)
-  Supports complex combinations (`1-5,10,20-25`)
-  Validates all fields with proper error messages
-  Handles commands with spaces
-  Formatted table output

## Tech Stack

- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js (v18)
- **Dependencies**: None (vanilla JavaScript)

## Installation

 Ensure you have Node.js installed on your machine

```bash
node --version  # Should be v14 or higher
```

## How to Run

### Basic Usage

```bash
node cronParser.js "<cron-string>"
```

### Examples

```bash
node cronParser.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

### Expected Output Format

```
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5

command       /usr/bin/find
```

## How to Run Test Cases

The test suite includes 20 comprehensive test cases covering valid and invalid scenarios.

```bash

node cronParser.test.js
```

##  Screenshots

<img width="495" height="707" alt="Screenshot 2025-11-07 at 17 26 02" src="https://github.com/user-attachments/assets/2ad6b0de-b8cb-4c4a-a33c-56bfad0dd72a" />
