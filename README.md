# SPCITY

SPCITY é uma aplicação para facilitar a interação dos cidadãos com o governo municipal de São Paulo, promovendo o registro, acompanhamento e gestão de demandas urbanas de forma simplificada, eficiente e transparente.

## 📜 Sobre o Projeto

A interação com o governo é muitas vezes burocrática e desmotivadora para os cidadãos. SPCITY busca revolucionar esse cenário, permitindo que os usuários reportem problemas urbanos de forma intuitiva e acompanhem suas resoluções em tempo real. 

### Funcionalidades Principais
- Registro de demandas urbanas usando geolocalização simplificada.
- Visualização de demandas abertas no mapa interativo.
- Sistema de feedback contínuo.
- Incentivo ao engajamento por meio de gamificação.
- Interface amigável e acessível.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React e Next.js 15.
- **Backend**: MongoDB e APIs customizadas.
- **Geolocalização**: Leaflet para renderização de mapas interativos.
- **Autenticação**: NextAuth com adaptador MongoDB.
- **Styling**: TailwindCSS com suporte a animações.

## 📦 Como Instalar

### Pré-requisitos
- [Bun](https://bun.sh/) instalado no sistema.
- Node.js versão mínima 18 (recomendado para compatibilidade).
- MongoDB configurado e em execução.

### Passo a Passo

1. Clone o repositório:
    ```bash
    git clone https://github.com/hexglyph/spcity.git
    cd spcity
    ```

2. Instale as dependências:
    ```bash
    bun install
    ```

3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto e adicione as variáveis necessárias, como:
    ```env
    MONGODB_URI=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/spcity
    NEXTAUTH_SECRET=sua_chave_secreta
    ```

4. Inicie o servidor de desenvolvimento:
    ```bash
    bun run dev
    ```

5. Acesse o aplicativo no navegador em [http://localhost:3000](http://localhost:3000).

## 📋 Estrutura do Projeto

```
spcity/
├── public/                # Arquivos públicos
├── src/                   # Código-fonte principal
│   ├── pages/             # Rotas e páginas do Next.js
│   ├── components/        # Componentes reutilizáveis
│   ├── styles/            # Estilos globais
│   ├── lib/               # Funções utilitárias e configurações
│   └── api/               # APIs customizadas
├── .env                   # Variáveis de ambiente
├── package.json           # Gerenciador de dependências
├── bun.lockb              # Arquivo de lock do Bun
└── tailwind.config.js     # Configuração do TailwindCSS
```

## 🎮 Gamificação

O aplicativo inclui um sistema de gamificação que incentiva o uso contínuo e responsável:
- **Níveis:** Baseados na interação do usuário.
- **Ranking:** Avaliação qualitativa de contribuições.
- **Controle Educativo:** Penalidades para uso indevido do sistema.

## 🛡️ Privacidade e Segurança

- Dados pessoais são anonimizados e tratados em conformidade com a LGPD.
- Todas as interações são realizadas em canais seguros.

## 🤝 Contribuições

Contribuições são bem-vindas! Para colaborar:
1. Crie um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Envie um pull request para revisão.

## 📝 Licença

Este projeto é proprietário. O uso, modificação ou redistribuição são permitidos apenas sob autorização do autor.

---

**Contato:**
- Email: dnbraz@prodam.sp.gov.br
- LinkedIn: [[Seu Perfil](https://www.linkedin.com/in/danielniebraz/)](https://www.linkedin.com/in/danielniebraz/)
