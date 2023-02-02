import { ErrorRequestHandler } from 'express';

import { ApiError } from '../error/ApiError.js';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Unknown Error' });
};

export default errorHandler;
