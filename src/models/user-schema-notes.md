# User Schema Notes

This document outlines the fields in the User schema, indicating whether each field is required or optional.

## Fields

- **name**: String, Required, Trimmed
- **avatar**: String, Optional
- **email**: String, Required, Unique, Lowercase, Indexed, Trimmed
- **password**: String, Required, Minimum length 8
- **refreshToken**: String, Optional
- **role**: String, Optional, Enum: ['user', 'admin'], Default: 'user'
- **createdAt**: Date, Auto-generated (via timestamps)
- **updatedAt**: Date, Auto-generated (via timestamps)