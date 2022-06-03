// C:\Users\santi\mongoDB\bin\mongod.exe --dbpath=/Users/santi/mongoDB-data
const app = require('./app');
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up on port ' + port)
});
