import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlwares/notFound';
import router from './app/router';
import globalErrorHandel from './app/middlwares/globalErrorHandeling';

const app: Application = express();

app.use(express.json());
app.use(cors());

//--->application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('EduTech Server is running successfully...');
});

//---> global error handle
app.use(globalErrorHandel);

//---> Not Found
app.use(notFound);

export default app;
