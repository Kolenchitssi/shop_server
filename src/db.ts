import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_NAME = process.env.DB_NAME || '';
const DB_USER = process.env.DB_USER || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 5432;

export default new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres', //may be mySQL or any database
  host: DB_HOST,
  port: DB_PORT,
});
