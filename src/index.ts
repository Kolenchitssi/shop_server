import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import path from 'path';

import sequelize from './db.js';
import { models } from './models/models.js';
import router from './routes/index.js';
import errorHandler from './middleware/ErrorHandlingMiddleware.js';

dotenv.config(); //for access .env

const PORT = process.env.PORT || 5000; // get  port from .env
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); //чтобы могли  отправлять данные с браузера
app.use(express.json()); //чтобы приложение могло парсить json формат
app.use(express.static(path.resolve(__dirname, 'static'))); //чтобы иметь доступ к картинкам в папке static
app.use(fileUpload({}));
app.use('/api', router);

// мидлваре по обработке ошибок должен регистрироватся ПОСЛЕДНИМ
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с БД было успешно установлено');
    await sequelize.sync({ alter: true });
    //* sequelize.sync() - создает таблицу при отсутствии (если есть существующая таблица остается неизменной)
    //* sequelize.sync({ force: true }) - удаляет существующую таблицу и создает новую
    //* sequelize.sync({ alter: true }) - приводит таблицу в соответствие с моделью
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
