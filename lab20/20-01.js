const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'phonebook.json');

const app = express();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    cancelLink: () => '<a href="/" class="btn btn-cancel">Отказаться</a>',
  },
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function readPhonebook() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writePhonebook(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getNextId(entries) {
  if (entries.length === 0) {
    return 1;
  }
  return Math.max(...entries.map((entry) => entry.id)) + 1;
}

function renderIndex(res) {
  const { entries } = readPhonebook();
  res.render('index', { entries, disabled: false });
}

app.get('/', (req, res) => {
  renderIndex(res);
});

app.get('/Add', (req, res) => {
  const { entries } = readPhonebook();
  res.render('add', { entries, disabled: true });
});

app.get('/Update', (req, res) => {
  const id = Number(req.query.id);
  const { entries } = readPhonebook();
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    return renderIndex(res);
  }

  res.render('update', { entries, entry, disabled: true });
});

app.post('/Add', (req, res) => {
  const data = readPhonebook();
  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();

  if (name && phone) {
    data.entries.push({
      id: getNextId(data.entries),
      name,
      phone,
    });
    writePhonebook(data);
  }

  renderIndex(res);
});

app.post('/Update', (req, res) => {
  const id = Number(req.body.id);
  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();
  const data = readPhonebook();
  const entry = data.entries.find((item) => item.id === id);

  if (entry && name && phone) {
    entry.name = name;
    entry.phone = phone;
    writePhonebook(data);
  }

  renderIndex(res);
});

app.post('/Delete', (req, res) => {
  const id = Number(req.body.id);
  const data = readPhonebook();
  data.entries = data.entries.filter((item) => item.id !== id);
  writePhonebook(data);
  renderIndex(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
