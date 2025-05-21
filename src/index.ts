import express from 'express';
import router from './routes/users';
const app = express();

app.use(express.json());
app.use('/', router);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);