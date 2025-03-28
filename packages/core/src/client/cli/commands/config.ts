import { Command } from 'commander';
import chalk from 'chalk';
import figures from 'figures';
import { loadConfig, saveConfig, getConfigValue, setConfigValue } from '../utils/config.js';

export function registerConfigCommands(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage configuration settings');
  
  // Get configuration values
  configCommand
    .command('get [key]')
    .description('Get a configuration value')
    .action((key: string | undefined) => {
      try {
        if (key) {
          // Get specific configuration value
          const value = getConfigValue(key);
          console.log(`${key} = ${JSON.stringify(value, null, 2)}`);
        } else {
          // Show all configuration
          const config = loadConfig();
          console.log(JSON.stringify(config, null, 2));
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Error getting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
  
  // Set configuration values
  configCommand
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action((key: string, value: string) => {
      try {
        // Parse the value to the appropriate type
        let parsedValue: any = value;
        
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (!isNaN(Number(value)) && value.trim() !== '') parsedValue = Number(value);
        
        // Set the configuration value
        setConfigValue(key, parsedValue);
        
        console.log(chalk.green(`${figures.tick} Set ${key} = ${JSON.stringify(parsedValue)}`));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Error setting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
  
  // Reset configuration
  configCommand
    .command('reset [key]')
    .description('Reset configuration to defaults')
    .action((key: string | undefined) => {
      try {
        if (key) {
          // Reset specific configuration value
          setConfigValue(key, undefined);
          console.log(chalk.green(`${figures.tick} Reset ${key} to default`));
        } else {
          // Reset all configuration
          saveConfig({});
          console.log(chalk.green(`${figures.tick} Reset all configuration to defaults`));
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Error resetting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
    
  return configCommand;
} 