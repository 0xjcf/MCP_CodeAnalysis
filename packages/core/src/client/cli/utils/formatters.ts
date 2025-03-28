import chalk from 'chalk';
import figures from 'figures';

export function formatOutput(result: any, format: string): string {
  if (format === 'json') {
    return JSON.stringify(result, null, 2);
  }
  
  // Default text format
  let output = '\n';
  
  // Handle different result types
  if (result && result.content && Array.isArray(result.content)) {
    for (const content of result.content) {
      if (content.type === 'text') {
        if (content._metadata?.format === 'mermaid') {
          output += chalk.magenta('>>> Mermaid Diagram <<<\n');
          output += content.text + '\n';
          output += chalk.magenta('>>> End Mermaid Diagram <<<\n\n');
        } else if (content._metadata?.format === 'dot') {
          output += chalk.magenta('>>> DOT Graph <<<\n');
          output += content.text + '\n';
          output += chalk.magenta('>>> End DOT Graph <<<\n\n');
        } else {
          output += formatTextContent(content.text);
        }
      } else {
        output += `Content type '${content.type}' not supported in text mode\n`;
      }
    }
  } else {
    // Fallback if result format is unexpected
    output += `${chalk.yellow(figures.warning)} Unexpected result format\n`;
    output += JSON.stringify(result, null, 2);
  }
  
  return output;
}

function formatTextContent(text: string): string {
  try {
    // Try to parse as JSON for prettier formatting
    const data = JSON.parse(text);
    return formatJsonData(data);
  } catch (e) {
    // Not JSON, return as is
    return text;
  }
}

function formatJsonData(data: any, indent = 0): string {
  let output = '';
  const pad = ' '.repeat(indent);
  
  // Handle different data types
  if (Array.isArray(data)) {
    if (data.length === 0) {
      output += `${pad}[]\n`;
    } else {
      for (let i = 0; i < data.length; i++) {
        output += `${pad}${chalk.gray(i)}: ${formatJsonData(data[i], indent + 2)}`;
      }
    }
  } else if (data !== null && typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        output += `${pad}${chalk.cyan(key)}:\n`;
        output += formatJsonData(value, indent + 2);
      } else {
        output += `${pad}${chalk.cyan(key)}: ${formatValue(value)}\n`;
      }
    }
  } else {
    output += `${formatValue(data)}\n`;
  }
  
  return output;
}

function formatValue(value: any): string {
  if (typeof value === 'string') {
    return chalk.green(`"${value}"`);
  } else if (typeof value === 'number') {
    return chalk.yellow(value.toString());
  } else if (typeof value === 'boolean') {
    return chalk.blue(value.toString());
  } else if (value === null) {
    return chalk.red('null');
  } else {
    return value.toString();
  }
} 