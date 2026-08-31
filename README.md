# iSCOUT

Plataforma web do projeto **iSCOUT** — infraestrutura de scouting para futebol de base.

**Produção**: https://iscout.tech

## Tecnologias

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (banco de dados e autenticação)
- [@tanstack/react-query](https://tanstack.com/query) (gerenciamento de estado assíncrono)

## Pré-requisitos

- Node.js 18+
- npm 9+

## Configuração local

```sh
git clone https://github.com/michel-brotherhood/iscout-site-novo.git
cd iscout-site-novo

# Copie as variáveis de ambiente
cp .env.example .env
# Preencha os valores no .env com suas credenciais do Supabase

npm install
npm run dev
```

Acesse `http://localhost:8080` no navegador.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `/dist` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run test` | Executa os testes (Vitest) |

## Variáveis de ambiente

Veja [.env.example](.env.example) para a lista completa de variáveis necessárias.

## Deploy

O deploy é feito manualmente via build estático. Para gerar o artefato de produção:

```sh
npm run build
```

Os arquivos ficam em `/dist` e podem ser servidos por qualquer CDN ou servidor estático (Nginx, Cloudflare Pages, etc.).
