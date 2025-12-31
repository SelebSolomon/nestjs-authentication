// this file will be used to add all the configuration options for typeorm and the secrets like the password and other will come from the connection string which is the database url

import { DataSourceOptions } from 'typeorm';

export interface dbconfig {
  entities: DataSourceOptions['entities'];
}
