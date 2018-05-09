var env = process.env.NODE_ENV || 'development'; // 'development' or  'production'

const development= {
	 app: {
			port: parseInt(process.env.DEV_APP_PORT) || 8080
	 },
	 db: {
		   host: process.env.DEV_DB_HOST || 'localhost',
		   port: parseInt(process.env.DEV_DB_PORT) || 27017,
		   name: process.env.DEV_DB_NAME || 'db'
	 }
};

const production = {
	 app: {
			port: parseInt(process.env.TEST_APP_PORT) 
	 },
	 db: {
		   host: process.env.TEST_DB_HOST,
		   port: parseInt(process.env.TEST_DB_PORT),
		   name: process.env.TEST_DB_NAME
	 }
}; 

const config = {development,production};
module.exports = config[env];
