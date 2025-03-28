import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';

// Add this type at the top of the file
type CountsType = { errors: number; warnings: number; info: number };

export function registerQualityCommands(program: Command) {
  const qualityCommand = program
    .command('quality')
    .description('Analyze code quality and best practices');
  
  // Code quality analysis command
  qualityCommand
    .command('analyze <repository-path>')
    .description('Analyze code quality issues')
    .option('-i, --include <patterns...>', 'File patterns to include')
    .option('-e, --exclude <patterns...>', 'File patterns to exclude')
    .option('-m, --max-issues <number>', 'Maximum issues to report', parseInt)
    .option('-s, --min-severity <level>', 'Minimum severity level (error, warning, info)', 'warning')
    .option('-o, --output-file <file>', 'Save report to a file')
    .option('--html', 'Generate HTML report (requires output-file)')
    .action(async (repositoryPath, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing code quality...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-quality tool
        const result = await callTool('analyze-quality', {
          repositoryPath,
          includePaths: options.include,
          excludePaths: options.exclude,
          maxIssues: options.maxIssues,
          minSeverity: options.minSeverity
        }, debug);
        
        spinner.succeed('Quality analysis complete');
        
        // Parse the result content
        let qualityReport;
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              try {
                qualityReport = JSON.parse(item.text);
                break;
              } catch (e) {
                // Not JSON, use as is
              }
            }
          }
        }
        
        if (!qualityReport) {
          console.error(chalk.red('Failed to parse quality report'));
          process.exit(1);
        }
        
        // Calculate totals
        const totalIssues = qualityReport.issueCount.errors + 
                           qualityReport.issueCount.warnings + 
                           qualityReport.issueCount.info;
        
        // Display summary
        console.log(chalk.bold('\nQuality Report Summary:'));
        console.log(`Total issues found: ${chalk.bold(totalIssues)}`);
        console.log(`Errors: ${chalk.red(qualityReport.issueCount.errors)}`);
        console.log(`Warnings: ${chalk.yellow(qualityReport.issueCount.warnings)}`);
        console.log(`Info: ${chalk.blue(qualityReport.issueCount.info)}`);
        console.log(`Files analyzed: ${chalk.bold(qualityReport.metadata.analyzedFiles)}`);
        
        // Display top issues by rule
        console.log(chalk.bold('\nTop Issues by Rule:'));
        const ruleEntries = Object.entries(qualityReport.summary.byRule)
          .map(([rule, counts]) => ({
            rule,
            total: (counts as CountsType).errors + (counts as CountsType).warnings + (counts as CountsType).info,
            counts: counts as CountsType
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        
        for (const entry of ruleEntries) {
          console.log(`${chalk.bold(entry.rule)}: ${entry.total} issues`);
        }
        
        // Display top files with issues
        console.log(chalk.bold('\nTop Files with Issues:'));
        const fileEntries = Object.entries(qualityReport.summary.byFile)
          .map(([file, counts]) => ({
            file,
            total: (counts as CountsType).errors + (counts as CountsType).warnings + (counts as CountsType).info,
            counts: counts as CountsType
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        
        for (const entry of fileEntries) {
          console.log(`${chalk.bold(entry.file)}: ${entry.total} issues`);
        }
        
        // Display issues list (limited)
        if (qualityReport.issues.length > 0) {
          console.log(chalk.bold('\nIssues:'));
          const limitedIssues = qualityReport.issues.slice(0, 10);
          
          for (const issue of limitedIssues) {
            const severityColor = 
              issue.severity === 'error' ? chalk.red :
              issue.severity === 'warning' ? chalk.yellow : chalk.blue;
            
            console.log(`${severityColor(issue.severity.toUpperCase())} ${issue.file}:${issue.line || '?'} - ${issue.message} [${issue.rule}]`);
            if (issue.context) {
              console.log(`   ${chalk.gray(issue.context)}`);
            }
          }
          
          if (qualityReport.issues.length > 10) {
            console.log(chalk.gray(`\n...and ${qualityReport.issues.length - 10} more issues`));
          }
        }
        
        // Save report to file if requested
        if (options.outputFile) {
          const outputPath = path.resolve(options.outputFile);
          
          if (options.html) {
            // Generate HTML report
            const htmlReport = generateHtmlReport(qualityReport);
            fs.writeFileSync(outputPath, htmlReport);
          } else {
            // Save JSON report
            fs.writeFileSync(outputPath, JSON.stringify(qualityReport, null, 2));
          }
          
          console.log(chalk.green(`\nReport saved to: ${outputPath}`));
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Quality analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Quick summary command as suggested in the review
  qualityCommand
    .command('summary <repository-path>')
    .description('Generate a quick quality summary')
    .option('-s, --min-severity <level>', 'Minimum severity level (error, warning, info)', 'error')
    .action(async (repositoryPath, options, command) => {
      const { serverPath, debug } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Generating quick quality summary...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-quality tool with limited scope
        const result = await callTool('analyze-quality', {
          repositoryPath,
          maxIssues: 100,
          minSeverity: options.minSeverity
        }, debug);
        
        spinner.succeed('Quality summary complete');
        
        // Parse the result content
        let qualityReport;
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              try {
                qualityReport = JSON.parse(item.text);
                break;
              } catch (e) {
                // Not JSON, use as is
              }
            }
          }
        }
        
        if (!qualityReport) {
          console.error(chalk.red('Failed to parse quality report'));
          process.exit(1);
        }
        
        // Display compact summary
        console.log(chalk.bold('\nCode Quality Summary:'));
        console.log(`Files analyzed: ${chalk.bold(qualityReport.metadata.analyzedFiles)}`);
        console.log(`Issues: ${chalk.red(qualityReport.issueCount.errors)} errors, ${chalk.yellow(qualityReport.issueCount.warnings)} warnings`);
        
        // Most critical issues
        if (qualityReport.issues.length > 0) {
          console.log(chalk.bold('\nTop Issues:'));
          const criticalIssues = qualityReport.issues
            .filter((issue: {severity: string}) => issue.severity === 'error')
            .slice(0, 5);
          
          if (criticalIssues.length > 0) {
            for (const issue of criticalIssues) {
              console.log(`${chalk.red('ERROR')} ${issue.file}:${issue.line || '?'} - ${issue.message}`);
            }
          } else {
            console.log(chalk.green('No critical errors found!'));
          }
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Quality summary failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  // List quality rules command
  qualityCommand
    .command('rules')
    .description('List available quality rules')
    .action(async (options, command) => {
      const { serverPath, debug } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Fetching quality rules...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the list-quality-rules tool
        const result = await callTool('list-quality-rules', {}, debug);
        
        spinner.succeed('Quality rules retrieved');
        
        // Parse the result content
        let rules;
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              try {
                rules = JSON.parse(item.text);
                break;
              } catch (e) {
                // Not JSON, use as is
              }
            }
          }
        }
        
        if (!rules || !Array.isArray(rules)) {
          console.error(chalk.red('Failed to parse quality rules'));
          process.exit(1);
        }
        
        // Display rules
        console.log(chalk.bold('\nAvailable Quality Rules:'));
        console.log('-------------------------');
        
        for (const rule of rules) {
          const severityColor = 
            rule.severity === 'error' ? chalk.red :
            rule.severity === 'warning' ? chalk.yellow : chalk.blue;
          
          console.log(`\n${chalk.bold(rule.id)} [${severityColor(rule.severity)}]`);
          console.log(`${chalk.dim('Name:')} ${rule.name}`);
          console.log(`${chalk.dim('Description:')} ${rule.description}`);
          console.log(`${chalk.dim('Languages:')} ${rule.languages.join(', ')}`);
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to retrieve quality rules: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  return qualityCommand;
}

/**
 * Generate an HTML report from quality data
 */
function generateHtmlReport(data: any): string {
  // Implementation for HTML report generation
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Quality Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
    h1, h2, h3 { color: #2c3e50; }
    .summary { display: flex; gap: 20px; margin-bottom: 20px; }
    .summary-box { padding: 15px; border-radius: 5px; flex: 1; }
    .errors { background-color: #ffecec; border-left: 5px solid #f44336; }
    .warnings { background-color: #fffaec; border-left: 5px solid #ff9800; }
    .info { background-color: #ecf6ff; border-left: 5px solid #2196f3; }
    .tabs { display: flex; margin: 20px 0; border-bottom: 1px solid #ddd; }
    .tab { padding: 10px 20px; cursor: pointer; }
    .tab.active { border-bottom: 3px solid #3f51b5; color: #3f51b5; font-weight: bold; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .filters { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    .filters select, .filters input { padding: 8px; margin-right: 10px; }
    .issues-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .issues-table th, .issues-table td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
    .issues-table th { background-color: #f2f2f2; }
    .severity-error { color: #f44336; font-weight: bold; }
    .severity-warning { color: #ff9800; font-weight: bold; }
    .severity-info { color: #2196f3; font-weight: bold; }
    .context { background-color: #f9f9f9; padding: 5px; margin-top: 5px; border-radius: 3px; font-family: monospace; }
    .file-link { color: #3f51b5; text-decoration: none; }
    .file-link:hover { text-decoration: underline; }
    .chart-container { height: 300px; margin: 20px 0; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Code Quality Report</h1>
  
  <div class="summary">
    <div class="summary-box errors">
      <h3>Errors</h3>
      <p>${data.issueCount.errors}</p>
    </div>
    <div class="summary-box warnings">
      <h3>Warnings</h3>
      <p>${data.issueCount.warnings}</p>
    </div>
    <div class="summary-box info">
      <h3>Info</h3>
      <p>${data.issueCount.info}</p>
    </div>
  </div>
  
  <div class="tabs">
    <div class="tab active" data-tab="issues">Issues</div>
    <div class="tab" data-tab="files">Files</div>
    <div class="tab" data-tab="rules">Rules</div>
    <div class="tab" data-tab="charts">Charts</div>
  </div>
  
  <div class="tab-content active" id="issues-tab">
    <div class="filters">
      <label for="severity-filter">Severity:</label>
      <select id="severity-filter">
        <option value="all">All</option>
        <option value="error">Errors only</option>
        <option value="warning">Warnings and errors</option>
      </select>
      
      <label for="issue-search">Search:</label>
      <input type="text" id="issue-search" placeholder="Filter issues...">
    </div>
    
    <table class="issues-table" id="issues-table">
      <thead>
        <tr>
          <th>Severity</th>
          <th>File</th>
          <th>Line</th>
          <th>Rule</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (const issue of data.issues) {
    const severityClass = `severity-${issue.severity}`;
    html += `
      <tr data-severity="${issue.severity}">
        <td class="${severityClass}">${issue.severity.toUpperCase()}</td>
        <td><a href="#" class="file-link">${issue.file}</a></td>
        <td>${issue.line || ''}</td>
        <td>${issue.rule}</td>
        <td>${issue.message}${issue.context ? `<div class="context">${issue.context}</div>` : ''}</td>
      </tr>
    `;
  }
  
  html += `
      </tbody>
    </table>
  </div>
  
  <div class="tab-content" id="files-tab">
    <table class="issues-table">
      <thead>
        <tr>
          <th>File</th>
          <th>Total Issues</th>
          <th>Errors</th>
          <th>Warnings</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  const fileEntries = Object.entries(data.summary.byFile)
    .map(([file, counts]) => ({
      file,
      total: (counts as CountsType).errors + (counts as CountsType).warnings + (counts as CountsType).info,
      counts: counts as CountsType
    }))
    .sort((a, b) => b.total - a.total);
  
  for (const entry of fileEntries) {
    html += `
      <tr>
        <td><a href="#" class="file-link">${entry.file}</a></td>
        <td>${entry.total}</td>
        <td class="severity-error">${entry.counts.errors}</td>
        <td class="severity-warning">${entry.counts.warnings}</td>
        <td class="severity-info">${entry.counts.info}</td>
      </tr>
    `;
  }
  
  html += `
      </tbody>
    </table>
  </div>
  
  <div class="tab-content" id="rules-tab">
    <table class="issues-table">
      <thead>
        <tr>
          <th>Rule</th>
          <th>Total Issues</th>
          <th>Errors</th>
          <th>Warnings</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  const ruleEntries = Object.entries(data.summary.byRule)
    .map(([rule, counts]) => ({
      rule,
      total: (counts as CountsType).errors + (counts as CountsType).warnings + (counts as CountsType).info,
      counts: counts as CountsType
    }))
    .sort((a, b) => b.total - a.total);
  
  for (const entry of ruleEntries) {
    html += `
      <tr>
        <td>${entry.rule}</td>
        <td>${entry.total}</td>
        <td class="severity-error">${entry.counts.errors}</td>
        <td class="severity-warning">${entry.counts.warnings}</td>
        <td class="severity-info">${entry.counts.info}</td>
      </tr>
    `;
  }
  
  html += `
      </tbody>
    </table>
  </div>
  
  <div class="tab-content" id="charts-tab">
    <h2>Issues by Severity</h2>
    <div class="chart-container">
      <canvas id="severity-chart"></canvas>
    </div>
    
    <h2>Top 5 Rules</h2>
    <div class="chart-container">
      <canvas id="rules-chart"></canvas>
    </div>
    
    <h2>Top 5 Files</h2>
    <div class="chart-container">
      <canvas id="files-chart"></canvas>
    </div>
  </div>
  
  <script>
    // Tab navigation
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === tabId + '-tab') {
            content.classList.add('active');
          }
        });
      });
    });
    
    // Issue filtering
    const severityFilter = document.getElementById('severity-filter');
    const issueSearch = document.getElementById('issue-search');
    const issuesTable = document.getElementById('issues-table');
    
    function filterIssues() {
      const severity = severityFilter.value;
      const searchText = issueSearch.value.toLowerCase();
      
      const rows = issuesTable.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const rowSeverity = row.getAttribute('data-severity');
        const rowText = row.textContent.toLowerCase();
        
        let showBySeverity = true;
        if (severity === 'error') {
          showBySeverity = rowSeverity === 'error';
        } else if (severity === 'warning') {
          showBySeverity = rowSeverity === 'error' || rowSeverity === 'warning';
        }
        
        const showBySearch = searchText === '' || rowText.includes(searchText);
        
        row.style.display = showBySeverity && showBySearch ? '' : 'none';
      });
    }
    
    severityFilter.addEventListener('change', filterIssues);
    issueSearch.addEventListener('input', filterIssues);
    
    // Charts
    window.addEventListener('load', () => {
      // Severity chart
      const severityData = [
        ${data.issueCount.errors},
        ${data.issueCount.warnings},
        ${data.issueCount.info}
      ];
      
      new Chart(document.getElementById('severity-chart'), {
        type: 'pie',
        data: {
          labels: ['Errors', 'Warnings', 'Info'],
          datasets: [{
            data: severityData,
            backgroundColor: ['#f44336', '#ff9800', '#2196f3']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      // Top rules chart
      const topRules = ${JSON.stringify(ruleEntries.slice(0, 5).map(entry => ({
        rule: entry.rule,
        count: entry.total
      })))};
      
      new Chart(document.getElementById('rules-chart'), {
        type: 'bar',
        data: {
          labels: topRules.map(r => r.rule),
          datasets: [{
            label: 'Issues',
            data: topRules.map(r => r.count),
            backgroundColor: '#3f51b5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      
      // Top files chart
      const topFiles = ${JSON.stringify(fileEntries.slice(0, 5).map(entry => ({
        file: entry.file,
        count: entry.total
      })))};
      
      new Chart(document.getElementById('files-chart'), {
        type: 'bar',
        data: {
          labels: topFiles.map(f => f.file),
          datasets: [{
            label: 'Issues',
            data: topFiles.map(f => f.count),
            backgroundColor: '#4caf50'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  </script>
</body>
</html>
  `;
  
  return html;
} 