const express = require('express');
const path = require('path');
const app = express();

//Archivos estaticos en public -img,-js,-cs
app.use(express.static(path.join(__dirname, 'public')));


//Plantillas ejs, son como html con javascript dentro
app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('index'); 
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
