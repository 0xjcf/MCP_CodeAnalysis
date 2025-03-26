/**
 * MCP Parameter Handler
 * 
 * A utility for standardized parameter handling across MCP client tools.
 * Supports command-line arguments, environment variables, and configuration files.
 */

/**
 * @typedef {Object} ParameterDefinition
 * @property {string} name - Parameter name
 * @property {string} [alias] - Short form alias
 * @property {string} description - Human-readable description
 * @property {'string'|'number'|'boolean'|'array'} type - Parameter data type
 * @property {any} [default] - Default value
 * @property {boolean} [required] - Whether parameter is required
 * @property {any[]} [choices] - Allowed values for validation
 * @property {string} [group] - Grouping for related parameters
 * @property {boolean} [hidden] - Hide from help output
 * @property {Function} [validator] - Custom validation function
 */

/**
 * @typedef {Object} CommandDefinition
 * @property {string} name - Command name
 * @property {string} description - Human-readable description
 * @property {ParameterDefinition[]} parameters - Command parameters
 * @property {CommandDefinition[]} [subcommands] - Nested commands
 * @property {Function} [handler] - Command implementation function
 */

class MCPParameterHandler {
  /**
   * Create a new parameter handler
   * @param {CommandDefinition} command - Command definition
   */
  constructor(command) {
    this.command = command;
    this.parsed = {};
    this.errors = [];
  }

  /**
   * Parse parameters from command line arguments
   * @param {string[]} args - Command line arguments
   * @returns {Object} Parsed parameters
   */
  parse(args) {
    this.errors = [];
    this.parsed = {};
    
    // Set default values first
    this._applyDefaults();
    
    // Process command line arguments
    this._parseArguments(args);
    
    // Apply environment variables
    this._applyEnvironmentVariables();
    
    // Validate required parameters and types
    this._validate();
    
    // If there are errors, throw or return empty object
    if (this.errors.length > 0) {
      if (this.parsed.help) {
        console.log(this.getHelpText());
        process.exit(0);
      }
      
      const errorMessage = this.errors.join('\n');
      console.error(`Error: ${errorMessage}`);
      console.log(this.getHelpText());
      process.exit(1);
    }
    
    return this.parsed;
  }
  
  /**
   * Apply default values from parameter definitions
   * @private
   */
  _applyDefaults() {
    // Add built-in help parameter
    this.parsed.help = false;
    
    // Apply defaults from parameter definitions
    for (const param of this.command.parameters) {
      if (param.default !== undefined) {
        this.parsed[param.name] = param.default;
      }
    }
  }
  
  /**
   * Parse command line arguments
   * @param {string[]} args - Command line arguments
   * @private
   */
  _parseArguments(args) {
    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      
      // Handle help flag
      if (arg === '--help' || arg === '-h') {
        this.parsed.help = true;
        i++;
        continue;
      }
      
      // Handle parameters with -- prefix
      if (arg.startsWith('--')) {
        const paramName = arg.slice(2);
        const param = this._findParameterByName(paramName);
        
        if (!param) {
          this.errors.push(`Unknown parameter: ${paramName}`);
          i++;
          continue;
        }
        
        if (param.type === 'boolean') {
          this.parsed[param.name] = true;
          i++;
        } else {
          // Next argument is the value
          if (i + 1 < args.length) {
            this.parsed[param.name] = this._convertValue(args[i + 1], param.type);
            i += 2;
          } else {
            this.errors.push(`Missing value for parameter: ${param.name}`);
            i++;
          }
        }
        continue;
      }
      
      // Handle parameters with - prefix (aliases)
      if (arg.startsWith('-')) {
        const alias = arg.slice(1);
        const param = this._findParameterByAlias(alias);
        
        if (!param) {
          this.errors.push(`Unknown parameter alias: ${alias}`);
          i++;
          continue;
        }
        
        if (param.type === 'boolean') {
          this.parsed[param.name] = true;
          i++;
        } else {
          // Next argument is the value
          if (i + 1 < args.length) {
            this.parsed[param.name] = this._convertValue(args[i + 1], param.type);
            i += 2;
          } else {
            this.errors.push(`Missing value for parameter: ${param.name}`);
            i++;
          }
        }
        continue;
      }
      
      // Handle positional arguments - could be expanded later
      i++;
    }
  }
  
  /**
   * Apply values from environment variables
   * @private
   */
  _applyEnvironmentVariables() {
    for (const param of this.command.parameters) {
      // Check for MCP_PARAM_NAME environment variable
      const envName = `MCP_${param.name.toUpperCase()}`;
      if (process.env[envName] !== undefined && this.parsed[param.name] === undefined) {
        this.parsed[param.name] = this._convertValue(process.env[envName], param.type);
      }
    }
  }
  
  /**
   * Validate all parameters
   * @private
   */
  _validate() {
    for (const param of this.command.parameters) {
      // Check required parameters
      if (param.required && this.parsed[param.name] === undefined) {
        this.errors.push(`Missing required parameter: ${param.name}`);
        continue;
      }
      
      // Skip validation if parameter not provided
      if (this.parsed[param.name] === undefined) {
        continue;
      }
      
      // Validate choices if specified
      if (param.choices && !param.choices.includes(this.parsed[param.name])) {
        this.errors.push(
          `Invalid value for ${param.name}: ${this.parsed[param.name]}. ` +
          `Allowed values: ${param.choices.join(', ')}`
        );
      }
      
      // Run custom validator if provided
      if (param.validator && typeof param.validator === 'function') {
        const result = param.validator(this.parsed[param.name]);
        if (result !== true && typeof result === 'string') {
          this.errors.push(result);
        }
      }
    }
  }
  
  /**
   * Convert string value to appropriate type
   * @param {string} value - Value to convert
   * @param {string} type - Target type
   * @returns {any} Converted value
   * @private
   */
  _convertValue(value, type) {
    switch (type) {
      case 'number':
        const num = Number(value);
        return isNaN(num) ? value : num;
      case 'boolean':
        return value === 'true' || value === '1' || value === 'yes';
      case 'array':
        return value.split(',').map(v => v.trim());
      case 'string':
      default:
        return value;
    }
  }
  
  /**
   * Find parameter by name
   * @param {string} name - Parameter name
   * @returns {ParameterDefinition|null} Found parameter or null
   * @private
   */
  _findParameterByName(name) {
    return this.command.parameters.find(p => p.name === name) || null;
  }
  
  /**
   * Find parameter by alias
   * @param {string} alias - Parameter alias
   * @returns {ParameterDefinition|null} Found parameter or null
   * @private
   */
  _findParameterByAlias(alias) {
    return this.command.parameters.find(p => p.alias === alias) || null;
  }
  
  /**
   * Generate help text
   * @returns {string} Formatted help text
   */
  getHelpText() {
    let help = `${this.command.name} - ${this.command.description}\n\n`;
    help += 'Usage: node ' + process.argv[1].split('/').pop() + ' [options]\n\n';
    help += 'Options:\n';
    
    // Add help option
    help += '  -h, --help    Show this help message\n';
    
    // Add all parameter options
    for (const param of this.command.parameters) {
      if (param.hidden) continue;
      
      const alias = param.alias ? `-${param.alias}, ` : '    ';
      const required = param.required ? ' (required)' : '';
      const defaultValue = param.default !== undefined ? ` (default: ${param.default})` : '';
      
      help += `  ${alias}--${param.name}`;
      help += '\t' + param.description + required + defaultValue + '\n';
    }
    
    return help;
  }
}

export default MCPParameterHandler; 