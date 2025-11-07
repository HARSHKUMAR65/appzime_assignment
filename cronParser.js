/**
 * 
 * @param {*} field which is the cron field to validate
 * @param {*} min the minimum value for the field
 * @param {*} max the maximum value for the field
 * @param {*} fieldName the name of the field
 * @returns an object with a valid property and an error property if the field is invalid
 */
const validateCronField = (field, min, max, fieldName) => {
    if (!field) return { valid: false, error: `${fieldName} is required` };
    if (field === '*') return { valid: true };
  
    if (field.includes(',')) {
      const parts = field.split(',');
      for (let part of parts) {
        const result = validateSinglePart(part.trim(), min, max, fieldName);
        if (!result.valid) return result;
      }
      return { valid: true };
    }
  
    return validateSinglePart(field, min, max, fieldName);
  };
  
  /**
   * 
   * @param {*} part the part of the field to validate
   * @param {*} min the minimum value for the part
   * @param {*} max the maximum value for the part
   * @param {*} fieldName the name of the part
   * @returns an object with a valid property and an error property if the part is invalid
   */
  const validateSinglePart = (part, min, max, fieldName) => {
    if (part.includes('/')) {
      const [base, stepStr] = part.split('/');
      const step = parseInt(stepStr);
  
      if (isNaN(step) || step < 1 || step > max) {
        return { valid: false, error: `Invalid step value in ${fieldName}: ${part}` };
      }
  
      if (base === '*') {
        return { valid: true };
      } else if (base.includes('-')) {
        return validateRange(base, min, max, fieldName);
      } else {
        const num = parseInt(base);
        if (isNaN(num) || num < min || num > max) {
          return { valid: false, error: `Invalid base value in ${fieldName}: ${part}` };
        }
        return { valid: true };
      }
    }
  
    if (part.includes('-')) {
      return validateRange(part, min, max, fieldName);
    }
  
    const num = parseInt(part);
    if (isNaN(num) || num < min || num > max) {
      return { valid: false, error: `Invalid value in ${fieldName}: ${part} (must be ${min}-${max})` };
    }
  
    return { valid: true };
  };
  
  /**
   * 
   * @param {*} range the range to validate
   * @param {*} min the minimum value for the range
   * @param {*} max the maximum value for the range
   * @param {*} fieldName the name of the range
   * @returns an object with a valid property and an error property if the range is invalid
   */
  const validateRange = (range, min, max, fieldName) => {
    const parts = range.split('-');
  
    if (parts.length !== 2) {
      return { valid: false, error: `Invalid range format in ${fieldName}: ${range}` };
    }
  
    const start = parseInt(parts[0]);
    const end = parseInt(parts[1]);
  
    if (isNaN(start) || isNaN(end)) {
      return { valid: false, error: `Invalid range values in ${fieldName}: ${range}` };
    }
  
    if (start < min || end > max) {
      return { valid: false, error: `Range out of bounds in ${fieldName}: ${range} (must be ${min}-${max})` };
    }
  
    if (start > end) {
      return { valid: false, error: `Invalid range in ${fieldName}: ${range} (start > end)` };
    }
  
    return { valid: true };
  };
  
  /**
   * 
   * @param {*} cmd the command to validate
   * @returns an object with a valid property and an error property if the command is invalid
   */
  const validateCommand = (cmd) => {
    if (!cmd || cmd.trim() === '') {
      return { valid: false, error: 'Command is required' };
    }
    return { valid: true };
  };
  /**
   * 
   * @param {*} field the field which needs to be expanded
   * @param {*} min  the minimum value for the field
   * @param {*} max the maximum value for the field
   * @returns an array of all matching numbers for the field
   */
  const expandCronField = (field, min, max) => {
    const values = new Set();
    const parts = field.split(',');
  
    for (const part of parts) {
      if (part === '*') {
        for (let i = min; i <= max; i++) {
          values.add(i);
        }
      } else if (part.includes('/')) {
        const [range, step] = part.split('/');
        let start = min;
        let end = max;
  
        if (range !== '*') {
          if (range.includes('-')) {
            [start, end] = range.split('-').map(Number);
          } else {
            start = Number(range);
          }
        }
  
        for (let i = start; i <= end; i += Number(step)) {
          if (i >= min && i <= max) {
            values.add(i);
          }
        }
      } else if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= min && i <= max) {
            values.add(i);
          }
        }
      } else {
        const num = Number(part);
        if (num >= min && num <= max) {
          values.add(num);
        }
      }
    }
  
    return Array.from(values).sort((a, b) => a - b).slice(0, 14);
  };
  
  /**
   * 
   * @param {*} expanded set of all expanded values of cron string
   * @returns formatted expanded cron data into a tabular format
   */
  const formatOutput = (expanded) => {
    const fields = [
      { name: 'minute', values: expanded.minute },
      { name: 'hour', values: expanded.hour },
      { name: 'day of month', values: expanded.dayOfMonth },
      { name: 'month', values: expanded.month },
      { name: 'day of week', values: expanded.dayOfWeek },
      { name: 'command', values: [expanded.command] }
    ];
  
    let output = '';
    for (const field of fields) {
      const name = field.name.padEnd(14);
      const values = field.values.join(' ');
      output += `${name}${values}\n`;
    }
  
    return output.trimEnd();
  };
  
  /**
   * 
   * @param {*} cronString argument passed in cli interface to parse
   * @returns return a parsed, validated cron expression into a readable format
   */
  const cronParser = (cronString) => {
    if (!cronString || cronString.trim() === '') {
      console.log('Error: Empty cron string');
      return false;
    }
  
    const parts = cronString.trim().split(/\s+/);
  
    if (parts.length < 6) {
      console.log('Error: Invalid number of fields (expected 6, got ' + parts.length + ')');
      return false;
    }
  
    const [minute, hour, dayOfMonth, month, dayOfWeek, ...commandParts] = parts;
    const command = commandParts.join(' ');
  
    const validations = [
      validateCronField(minute, 0, 59, 'minute'),
      validateCronField(hour, 0, 23, 'hour'),
      validateCronField(dayOfMonth, 1, 31, 'day of month'),
      validateCronField(month, 1, 12, 'month'),
      validateCronField(dayOfWeek, 0, 6, 'day of week'),
      validateCommand(command)
    ];
    for (let result of validations) {
      if (!result.valid) {
        console.log('Error: ' + result.error);
        return false;
      }
    }
  
    const expanded = {
      minute: expandCronField(minute, 0, 59),
      hour: expandCronField(hour, 0, 23),
      dayOfMonth: expandCronField(dayOfMonth, 1, 31),
      month: expandCronField(month, 1, 12),
      dayOfWeek: expandCronField(dayOfWeek, 0, 6),
      command: command
    };
  
    console.log(formatOutput(expanded));
    return true;
  };
  if (require.main === module) {
    const cronString = process.argv[2];

    if (!cronString) {
      console.error('Please pass a valid cron string as and argument. For example: "*/15 0 1,15 * 1-5 /usr/bin/find"');
      process.exit(1);
    }
    cronParser(cronString);
  }

  module.exports = { cronParser, validateCronField, expandCronField, formatOutput };
