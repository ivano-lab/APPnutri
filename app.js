const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ivano!@#',
  database: 'APPnutri'
});

// Conexão com o banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração para análise do corpo da requisição
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuração do express-session
app.use(
  session({
    secret: 'mysecret', // Uma chave secreta para assinar o cookie de sessão
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware de verificação de autenticação
function checkAuthentication(req, res, next) {
  // Verificar se o usuário está autenticado
  if (req.session.isAuthenticated) {
    // Se o usuário estiver autenticado, continue para a próxima rota
    next();
  } else {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    res.redirect('/login.html');
  }
}

// Rota para a tela inicial (GET)
app.get('/', checkAuthentication, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tela_inicial.html'));
});

// Rota para autenticar o usuário (POST)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consulta ao banco de dados para verificar as credenciais do usuário
  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Erro ao autenticar usuário:', err);
      res.status(500).send('Erro ao autenticar usuário');
    } else {
      if (results.length > 0) {
        // Define a autenticação como bem-sucedida
        req.session.isAuthenticated = true;
        req.session.username = username;

        // Redireciona para a tela inicial após a autenticação bem-sucedida
        res.redirect('/');
      } else {
        res.send('Credenciais inválidas');
      }
    }
  });
});

// Rota para fazer logout (GET)
app.get('/logout', (req, res) => {
  // Remove a autenticação
  req.session.isAuthenticated = false;
  req.session.username = '';

  // Redireciona para a página de login após o logout
  res.redirect('/login.html');
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});