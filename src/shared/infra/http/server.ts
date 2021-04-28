import 'reflect-metadata';

import app from './app';

app.listen(parseInt(process.env.HTTP_PORT || '3333', 10), () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server Started on Port 3333!');
});
