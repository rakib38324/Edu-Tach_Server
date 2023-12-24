import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const ValidateRequest = (schema: AnyZodObject) => {
  return async (req: Request, response: Response, next: NextFunction) => {
    try {
      //====> validation
      // if everything is all right => next()=>
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default ValidateRequest;
