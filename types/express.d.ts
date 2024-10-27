// express.d.ts
import express from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: any;  // Make it optional
    }
    export interface Response {
      user?: any;  // Make it optional
    }
  }
}
