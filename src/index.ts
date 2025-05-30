import express from 'express';
import userRouter from './routes/users';
import authRouter from './routes/auth';
const app = express();

app.use(express.json());
app.use('/', userRouter);
app.use('/', authRouter);
const bcryptNewPassword = await Bun.password.hash('Trepagamer11#', {
                algorithm: 'bcrypt',
                cost: 10
            });
app.listen(3000, () =>
  console.log('Example app listening on port 3000!', bcryptNewPassword),

);