import * as dotenv from 'dotenv';
import express from 'express';
import sequelize from './db';
// const models = require('./models/models');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');
// const router = require('./routes/index');
// const errorHandler = require('./middleware/ErrorHandlingMiddleware');
// const path = require('path');

dotenv.config(); //for access .env

const PORT = process.env.PORT || 5000; // get  port from .env
const app = express();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// app.use(cors()); //чтобы могли  отправлять данные с браузера
// app.use(express.json()); //чтобы приложение могло парсить json формат
// app.use(express.static(path.resolve(__dirname, 'static'))); //чтобы иметь доступ к картинкам в папке static
// app.use(fileUpload({}));
// app.use('/api', router);

//мидлваре по обработке ошибок должен регистрироватся ПОСЛЕДНИМ
// app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

//--------------------------------------------------------------
//создаем первый GET метод
/* app.get("/", (req, resp) => {
  resp.status(200).json({ message: "Working!!!" });
});
 */
