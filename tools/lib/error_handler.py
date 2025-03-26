#!/usr/bin/env python3

"""Error Handler

This module provides standardized error handling for all scripts in the project.

Maturity: beta

Why:
- Consistent error handling across all scripts
- Better error reporting and debugging
- Proper handling of critical vs non-critical errors
- Improved user experience with clear error messages
"""

import sys
import logging
from enum import Enum
from typing import Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime

class ErrorSeverity(Enum):
    """Error severity levels."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    FATAL = "fatal"

class ErrorType(Enum):
    """Error types for categorization."""
    UNKNOWN = "unknown"
    FILE_NOT_FOUND = "file_not_found"
    INVALID_FORMAT = "invalid_format"
    VALIDATION_ERROR = "validation_error"
    PROCESSING_ERROR = "processing_error"
    CONNECTION_ERROR = "connection_error"
    TIMEOUT_ERROR = "timeout_error"
    PERMISSION_ERROR = "permission_error"
    CONFIGURATION_ERROR = "configuration_error"
    DEPENDENCY_ERROR = "dependency_error"

@dataclass
class ErrorDetails:
    """Details about an error."""
    message: str
    type: ErrorType
    severity: ErrorSeverity
    timestamp: datetime
    file: Optional[str] = None
    line: Optional[int] = None
    context: Optional[Dict[str, Any]] = None
    suggestion: Optional[str] = None
    retryable: bool = False

class ErrorHandler:
    """Handles errors consistently across the project."""
    
    def __init__(self, verbose: bool = False, exit_on_fatal: bool = True):
        self.verbose = verbose
        self.exit_on_fatal = exit_on_fatal
        self.logger = logging.getLogger("error_handler")
        
        # Configure logging
        if verbose:
            self.logger.setLevel(logging.DEBUG)
            handler = logging.StreamHandler(sys.stderr)
            handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
            self.logger.addHandler(handler)
    
    def handle_error(self, error: Exception, 
                    error_type: ErrorType = ErrorType.UNKNOWN,
                    severity: ErrorSeverity = ErrorSeverity.ERROR,
                    file: Optional[str] = None,
                    line: Optional[int] = None,
                    context: Optional[Dict[str, Any]] = None,
                    suggestion: Optional[str] = None,
                    retryable: bool = False) -> ErrorDetails:
        """Handle an error and return error details."""
        # Create error details
        details = ErrorDetails(
            message=str(error),
            type=error_type,
            severity=severity,
            timestamp=datetime.now(),
            file=file,
            line=line,
            context=context,
            suggestion=suggestion,
            retryable=retryable
        )
        
        # Log the error
        self._log_error(details)
        
        # Handle based on severity
        if severity == ErrorSeverity.FATAL and self.exit_on_fatal:
            self.logger.error("Fatal error occurred. Exiting...")
            sys.exit(1)
        
        return details
    
    def _log_error(self, details: ErrorDetails) -> None:
        """Log an error with appropriate level and details."""
        log_message = f"{details.type.value}: {details.message}"
        
        if details.file:
            log_message += f" in {details.file}"
            if details.line:
                log_message += f" at line {details.line}"
        
        if details.context:
            log_message += f"\nContext: {details.context}"
        
        if details.suggestion:
            log_message += f"\nSuggestion: {details.suggestion}"
        
        if details.retryable:
            log_message += "\nThis error is retryable."
        
        # Log based on severity
        if details.severity == ErrorSeverity.INFO:
            self.logger.info(log_message)
        elif details.severity == ErrorSeverity.WARNING:
            self.logger.warning(log_message)
        elif details.severity == ErrorSeverity.ERROR:
            self.logger.error(log_message)
        elif details.severity == ErrorSeverity.CRITICAL:
            self.logger.critical(log_message)
        elif details.severity == ErrorSeverity.FATAL:
            self.logger.critical(log_message)
    
    def create_file_not_found_error(self, file_path: str, suggestion: Optional[str] = None) -> ErrorDetails:
        """Create a file not found error."""
        return self.handle_error(
            FileNotFoundError(f"File not found: {file_path}"),
            error_type=ErrorType.FILE_NOT_FOUND,
            severity=ErrorSeverity.ERROR,
            context={"file_path": file_path},
            suggestion=suggestion or f"Check if the file exists at: {file_path}"
        )
    
    def create_invalid_format_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create an invalid format error."""
        return self.handle_error(
            ValueError(message),
            error_type=ErrorType.INVALID_FORMAT,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Check the format of the input data"
        )
    
    def create_validation_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a validation error."""
        return self.handle_error(
            ValueError(message),
            error_type=ErrorType.VALIDATION_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Verify the input data meets all requirements"
        )
    
    def create_processing_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a processing error."""
        return self.handle_error(
            Exception(message),
            error_type=ErrorType.PROCESSING_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Check the processing logic and input data"
        )
    
    def create_connection_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a connection error."""
        return self.handle_error(
            ConnectionError(message),
            error_type=ErrorType.CONNECTION_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Check network connectivity and server status",
            retryable=True
        )
    
    def create_timeout_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a timeout error."""
        return self.handle_error(
            TimeoutError(message),
            error_type=ErrorType.TIMEOUT_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Try again with a longer timeout or when server load is lower",
            retryable=True
        )
    
    def create_permission_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a permission error."""
        return self.handle_error(
            PermissionError(message),
            error_type=ErrorType.PERMISSION_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Check file permissions and user access rights"
        )
    
    def create_configuration_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a configuration error."""
        return self.handle_error(
            ValueError(message),
            error_type=ErrorType.CONFIGURATION_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Verify configuration settings and environment variables"
        )
    
    def create_dependency_error(self, message: str, context: Optional[Dict[str, Any]] = None) -> ErrorDetails:
        """Create a dependency error."""
        return self.handle_error(
            ImportError(message),
            error_type=ErrorType.DEPENDENCY_ERROR,
            severity=ErrorSeverity.ERROR,
            context=context,
            suggestion="Check if all required dependencies are installed"
        ) 