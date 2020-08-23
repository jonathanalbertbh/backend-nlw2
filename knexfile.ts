import path from 'path';


// Update with your config settings.

export default {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'nlw2'
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
  }


};
