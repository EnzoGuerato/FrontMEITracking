const express = require("express");
const cors = require("cors"); // 1. IMPORTADO O CORS
const app = express();
const mysql = require("mysql2/promise"); 
const nodemailer = require("nodemailer"); 
const path = require("path");
require("dotenv").config(); 

const PORT = 8080; 

// Habilitar o CORS para o ReqBin e navegadores conseguirem acessar sua API
app.use(cors()); // 2. ATIVADO O CORS

app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o mysql (com pool)
const pool = mysql.createPool({
  host: "127.0.0.1", 
  user: "root", 
  password: "", // Lembre-se de colocar sua senha real do MySQL aqui se não for essa
  database: "crud_ts", 
});

// Rota principal (CORRIGIDO: era __dirnamea)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "recsenha.html"));
});

// Config do transporte do gmail
const transporter = nodemailer.createTransport({ // Corrigido erro de digitação no nome da variável (era trasnporter)
  host: "smtp.gmail.com", 
  port: 465, 
  secure: true,
  auth: {
    user: "miguelpelegrin9@gmail.com",
    pass: "xdsdwezizcpknwak ", // Veja a nota importante abaixo sobre esta senha!
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Função para gerar uma nova senha aleatória
function generateRandomPassword() {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

app.post("/recsenha", async (req, res) => { 
  const { email } = req.body; 
  
  try {
    const senhaAleatoria = generateRandomPassword();

    // Atualiza a senha do banco
    const [result] = await pool.query(
      "UPDATE usuario SET senha = ? WHERE email = ?",
      [senhaAleatoria, email],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "E-mail não encontrado" }); 
    }

    // Enviar o E-mail com a nova senha
    const mailOptions = {
        from: "miguelpelegrin9@gmail.com", 
        to: email,
        subject: 'Recuperação de senha', 
        text: `Olá! Sua nova senha gerada pelo sistema é: ${senhaAleatoria}` 
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email de recuperação de senha enviado com sucesso!!' });

  } catch (error) {
    console.error("Erro ao recuperar a senha: ", error);
    res.status(500).json({ message: "Erro no servidor. Tente novamente" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});