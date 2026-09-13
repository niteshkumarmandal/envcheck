// src/types.ts

// The Environment Contract is now dynamic.
// It can hold { "node": ">=20", "python": ">=3.10", "aws-cli": ">=2" }
export interface EnvContract {
    [toolName: string]: string; 
  }
  
  // System State is also dynamic.
  // It holds the collected facts: { "node": "20.14.0", "python": null }
  export interface SystemState {
    [toolName: string]: string | null;
  }
  
  export type FindingStatus = 'pass' | 'fail' | 'warn';
  
  export interface Finding {
    service: string;
    status: FindingStatus;
    expected: string;
    actual: string;
    message?: string;
  }
  
  // A generic Collector interface
  export interface Collector {
    name: string; // The key in the contract (e.g., 'postgres')
    displayName: string; // How it looks in the terminal (e.g., 'PostgreSQL')
    collect(): Promise<string | null>;
  }