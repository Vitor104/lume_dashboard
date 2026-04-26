# 📦 Lume Dashboard

> Gestão de estoque com inteligência e previsibilidade para pequenos negócios. Chega de apagar incêndios e usar o caderno.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

<br>

## 📱 Demonstração (Live Preview)

Você pode testar a aplicação em produção aqui: **https://lumedashboard.netlify.app/**

**Credenciais para teste rápido:**
- **Email:** `teste@lume.com`
- **Senha:** `123456`


---

## 🎯 O Problema que o Lume Resolve

Pequenos comerciantes (docerias, padarias, comércios locais) perdem muito tempo e dinheiro por não saberem exatamente quando repor seus produtos ou qual item traz a maior margem de lucro. O Lume Dashboard nasceu para tirar o "peso mental" do comerciante, oferecendo uma interface limpa, 100% responsiva (mobile-first) e focada em ações rápidas.

## ✨ Principais Funcionalidades

- 🔐 **Autenticação Segura:** Login e cadastro de usuários gerenciados pelo Supabase Auth.
- 📊 **Dashboard Inteligente:** Gráficos e cards de resumo calculando o valor financeiro total parado no estoque.
- 🔄 **Transações Atômicas:** Vendas e reposições calculadas no back-end (via PostgreSQL RPC), garantindo que o saldo atualize de forma segura.
- 🛡️ **Privacidade de Dados:** Configuração de *Row Level Security* (RLS) no banco de dados; cada usuário só acessa e visualiza os seus próprios produtos e movimentações.
- 📱 **Mobile-First:** Interface otimizada para uso em telas pequenas, com ajustes de *touch events* para navegação ágil.

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- React.js (via Vite)
- React Router DOM (Proteção de rotas e SPAs)
- Context API (Gerenciamento de estado global da sessão)
- Bootstrap 5 + CSS Customizado (Variáveis `:root`)

**Back-end (BaaS):**
- Supabase
- PostgreSQL (Tabelas: `profiles`, `products`, `stock_movements`)
- Triggers & Functions (Para criação automática de perfis e cálculo de movimentações)
- RLS (Row Level Security)

---

👨‍💻 Autor
João Vitor

LinkedIn: (https://www.linkedin.com/in/jvvitor/)

Portfólio: https://vitorsportfolio.netlify.app/

Feito com dedicação e muito café! ☕
