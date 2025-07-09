import express from 'express';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import cors from 'cors';
const app = express();
app.use(cors())
app.use(express.json());
app.use('/', userRouter);
app.use('/', authRouter);
app.use('/', adminRouter);
const bcryptNewPassword = await Bun.password.hash('Unodostrescuatro', {
                algorithm: 'bcrypt',
                cost: 10
            });
app.listen(3000, () =>
  console.log('Example app listening on port 3000!', bcryptNewPassword),

);