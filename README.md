# Estacionamento Vista Verde

Aplicação front-end para controle de estacionamento de um condomínio, desenvolvida como desafio da disciplina de Desenvolvimento de Web. O sistema permite cadastrar reservas de vagas, consultar as vagas cadastradas, remover reservas e visualizar a disponibilidade do estacionamento.

O projeto foi construído **apenas com HTML, CSS e JavaScript puro**, sem frameworks, bibliotecas externas, etapas de build ou dependências de instalação.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas](#telas)
- [Tecnologias e escolhas](#tecnologias-e-escolhas)
- [Arquitetura](#arquitetura)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Modelo de dados](#modelo-de-dados)
- [Regras de negócio e validações](#regras-de-negócio-e-validações)
- [Persistência dos dados](#persistência-dos-dados)
- [Como executar](#como-executar)
- [Roteiro de avaliação](#roteiro-de-avaliação)
- [Critérios de avaliação atendidos](#critérios-de-avaliação-atendidos)
- [Decisões de design e acessibilidade](#decisões-de-design-e-acessibilidade)
- [Limitações e trabalhos futuros](#limitações-e-trabalhos-futuros)

---

## Funcionalidades

- Cadastro de reserva com todos os dados solicitados:
  - placa do veículo;
  - nome do proprietário;
  - número do apartamento;
  - bloco do apartamento;
  - modelo do veículo;
  - cor do veículo;
  - número da vaga de estacionamento.
- Exibição dos dados do formulário no console do navegador ao salvar.
- Pop-up (modal) de confirmação após o cadastro.
- Listagem das reservas cadastradas, incluindo dados fictícios iniciais.
- Busca por placa, proprietário, apartamento, bloco, modelo, cor ou número da vaga.
- Remoção de reservas com confirmação.
- Página de vagas disponíveis com mapa visual de todas as vagas.
- Atualização automática da disponibilidade após cadastrar ou remover uma reserva.
- Persistência local das reservas entre recarregamentos e navegação entre as telas.

---

## Telas

| Arquivo | Tela | Descrição |
|---|---|---|
| `index.html` | Cadastro de reserva | Formulário completo, resumo de disponibilidade e modal de sucesso. |
| `vagas.html` | Vagas cadastradas | Tabela com as reservas, busca, remoção e resumo geral. |
| `disponiveis.html` | Vagas disponíveis | Mapa visual das vagas livres e ocupadas, com indicadores percentuais. |

A navegação entre as telas é feita pelo menu superior presente em todas as páginas.

---

## Tecnologias e escolhas

### HTML5

- Marcação semântica com `header`, `nav`, `main`, `section`, `article`, `fieldset`, `legend`, `table`, `footer`.
- Formulário com `label`, `required`, `maxlength`, `datalist` e `select`.
- Atributos de acessibilidade como `aria-label`, `aria-labelledby`, `aria-modal`, `aria-current` e `role="alert"`.
- Três páginas independentes, cada uma com sua responsabilidade, compartilhando o mesmo CSS e os mesmos módulos JavaScript.

### CSS3

- Layout responsivo com CSS Grid e Flexbox.
- Variáveis CSS (`:root`) para padronizar cores, sombras, raios e tipografia.
- Media queries para adaptação em desktop, tablet e celular.
- Estados de foco, hover, erro, sucesso, vazio e carregamento.
- Animações discretas no modal e no toast, com respeito a `prefers-reduced-motion`.
- Nenhum framework ou biblioteca de estilos.

### JavaScript

- JavaScript moderno (ES6+) com classes, `let`/`const`, arrow functions em callbacks, `Map`, `Set`, `Array.prototype.find`, `Array.prototype.some` e `Object.assign`.
- Código organizado em módulos por responsabilidade, usando o padrão IIFE e um namespace global (`window.ParkingApp`).
- Uso de `localStorage` para simular a persistência de um back-end.
- Nenhuma dependência externa, CDN, fonte remota ou biblioteca de terceiros.

### Por que não foram usados frameworks?

O enunciado exige explicitamente o desenvolvimento com HTML, CSS e JavaScript sem frameworks. Além disso, a ausência de dependências torna o projeto:

- portátil e executável sem instalação;
- simples de avaliar;
- independente de internet;
- adequado para demonstrar os fundamentos de estruturação de uma aplicação.

### Por que IIFE em vez de módulos ES?

Os arquivos JavaScript usam o padrão IIFE com um namespace global em vez de `import`/`export`. Essa escolha permite abrir as páginas diretamente pelo protocolo `file://`, sem precisar de servidor local, evitando bloqueios de CORS que ocorrem com módulos ES em alguns navegadores.

---

## Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)**, com responsabilidades bem separadas e alguns componentes de apoio.

### Model

Responsável pelas entidades, regras de negócio e acesso aos dados.

- `Reserva`: representa uma reserva e converte os dados para JSON.
- `ReservaModel`: concentra as operações de negócio:
  - `listar()`: retorna as reservas cadastradas;
  - `salvar(reserva)`: valida e grava uma nova reserva;
  - `remover(id)`: exclui uma reserva existente;
  - `vagasDisponiveis()`, `vagasOcupadas()` e indicadores de totais.

### View

Responsável exclusivamente pela manipulação do DOM e pela apresentação.

- `CadastroView`: lê o formulário, preenche as opções de vagas, exibe erros e o modal de sucesso.
- `ListaView`: renderiza a tabela, o estado vazio, o toast e o modal de confirmação de remoção.
- `DisponiveisView`: desenha o mapa de vagas e atualiza os indicadores.

### Controller

Responsável por intermediar a comunicação entre Model e View.

- `CadastroController`: valida a placa, cria a reserva, chama o Model, registra no console e solicita o feedback à View.
- `ListaController`: filtra as reservas, dispara a remoção e atualiza a listagem.
- `DisponiveisController`: solicita ao Model os dados de disponibilidade e envia à View.

### Componentes e serviços de apoio

- `StorageService`: encapsula o acesso ao `localStorage`.
- `Modal`: componente reutilizável de pop-up.
- `Formatadores`: normalização de placa e formatação de números de vaga.
- `Validador`: validação de placa e normalização de texto para busca.
- `seed.js`: dados fictícios iniciais.
- `pages/*.js`: inicialização de cada página, criando Model, View e Controller.

### Fluxo de uma operação de cadastro

1. O usuário preenche o formulário e clica em **Salvar reserva**.
2. A `CadastroView` captura os dados e envia ao `CadastroController`.
3. O Controller valida a placa e cria uma instância de `Reserva`.
4. O Controller chama `ReservaModel.salvar()`.
5. O Model verifica duplicidade de placa e ocupação da vaga, grava a reserva e persiste no `localStorage`.
6. O Controller executa `console.log` com os dados da reserva.
7. A View limpa o formulário, atualiza as vagas disponíveis e exibe o modal de confirmação.

### Fluxo de remoção

1. O usuário clica no ícone de remoção de uma linha.
2. A `ListaView` abre um modal de confirmação.
3. Confirmada a ação, o `ListaController` chama `ReservaModel.remover(id)`.
4. O Model remove a reserva e atualiza o `localStorage`.
5. A listagem, os indicadores e o toast são atualizados.

---

## Estrutura de arquivos

```text
desafio1/
├── index.html
├── vagas.html
├── disponiveis.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── config.js
    ├── components/
    │   └── Modal.js
    ├── controllers/
    │   ├── CadastroController.js
    │   ├── DisponiveisController.js
    │   └── ListaController.js
    ├── data/
    │   └── seed.js
    ├── models/
    │   ├── Reserva.js
    │   └── ReservaModel.js
    ├── pages/
    │   ├── cadastro.js
    │   ├── disponiveis.js
    │   └── vagas.js
    ├── services/
    │   └── StorageService.js
    ├── utils/
    │   ├── Formatadores.js
    │   └── Validador.js
    └── views/
        ├── CadastroView.js
        ├── DisponiveisView.js
        └── ListaView.js
```

---

## Modelo de dados

Cada reserva é representada pela classe `Reserva` com os seguintes campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único gerado automaticamente. |
| `placa` | string | Placa normalizada em maiúsculas. |
| `proprietario` | string | Nome do proprietário. |
| `apartamento` | string | Número do apartamento. |
| `bloco` | string | Bloco do apartamento. |
| `modelo` | string | Modelo do veículo. |
| `cor` | string | Cor do veículo. |
| `vaga` | number | Número da vaga reservada. |

O estacionamento possui **40 vagas**, numeradas de 1 a 40.

---

## Regras de negócio e validações

- Todos os campos do formulário são obrigatórios.
- A placa deve estar em um dos formatos:
  - Mercosul: `ABC1D23`;
  - formato antigo: `ABC-1234` ou `ABC1234`.
- A placa é convertida automaticamente para maiúsculas durante a digitação.
- Não é permitido cadastrar duas reservas para a mesma placa.
- Não é permitido reservar uma vaga já ocupada.
- O campo de vaga exibe apenas as vagas livres.
- Quando não há vagas disponíveis, o select e o botão de salvar são desabilitados.
- A remoção exige confirmação em modal.
- Mensagens de erro são exibidas no formulário e registradas no console.

---

## Persistência dos dados

Como o desafio é exclusivamente front-end, não há back-end nem banco de dados. Para simular a persistência:

- as reservas são armazenadas em `localStorage` sob a chave `estacionamento.vista-verde.reservas.v1`;
- os dados permanecem após recarregar a página ou navegar entre as telas;
- na primeira execução, o sistema carrega **8 reservas fictícias** definidas em `js/data/seed.js`;
- se todas as reservas forem removidas, a lista vazia é preservada e os dados fictícios não retornam automaticamente;
- caso o `localStorage` não esteja disponível, a aplicação continua funcionando em memória e registra o problema no console.

---

## Como executar

Não há necessidade de instalar dependências, compilar ou executar scripts de build.

### Opção 1: abrir diretamente

1. Navegue até a pasta do projeto.
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge ou Safari).

### Opção 2: servidor local (recomendado)

Na raiz do projeto, execute:

```bash
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/
```

Também é possível usar qualquer outro servidor estático, como:

```bash
npx serve .
```

### Páginas disponíveis

- `http://localhost:8000/index.html` — cadastro de reserva;
- `http://localhost:8000/vagas.html` — vagas cadastradas;
- `http://localhost:8000/disponiveis.html` — vagas disponíveis.

---

## Roteiro de avaliação

Sugestão de fluxo para validar as funcionalidades:

1. Abra a tela de **Cadastro de reserva**.
2. Confira o resumo de disponibilidade no topo e no cartão lateral.
3. Preencha todos os campos:
   - nome do proprietário;
   - número do apartamento;
   - bloco;
   - placa (por exemplo, `XYZ1A23`);
   - modelo;
   - cor;
   - vaga disponível.
4. Abra o console do navegador com `F12` ou `Ctrl+Shift+J`.
5. Clique em **Salvar reserva**.
6. Verifique:
   - os dados da reserva exibidos no console;
   - o modal de confirmação de cadastro;
   - a atualização da quantidade de vagas disponíveis.
7. Acesse **Vagas cadastradas** e confirme que a nova reserva aparece na tabela.
8. Teste a busca pelo nome, placa ou número da vaga.
9. Clique no ícone de remoção e confirme a exclusão.
10. Verifique o toast de sucesso e a atualização dos indicadores.
11. Acesse **Vagas disponíveis** e confirme que a vaga removida voltou a aparecer como disponível.
12. Teste também:
    - placa inválida;
    - placa já cadastrada;
    - tentativa de cadastro sem preencher campos obrigatórios.

---

## Critérios de avaliação atendidos

| Critério | Como foi atendido |
|---|---|
| 1. Todas as telas foram criadas | `index.html` (cadastro), `vagas.html` (listagem) e `disponiveis.html` (vagas disponíveis). |
| 2. Utilizou HTML, CSS e JavaScript em todas as telas | Todas as páginas usam HTML semântico, o mesmo `css/style.css` e módulos JavaScript específicos. |
| 3. Não utilizou nenhum framework | Não há frameworks, bibliotecas, CDNs ou dependências externas. |
| 4. Métodos de listar, salvar e remover estão criados | `ReservaModel.listar()`, `ReservaModel.salvar()` e `ReservaModel.remover()`. |
| 5. Estrutura segue um padrão de desenvolvimento | MVC com pastas separadas para Models, Views, Controllers, Services, Components, Utils e Data. |

---

## Decisões de design e acessibilidade

- Paleta baseada em azul-marinho (confiança e organização), dourado (destaque) e verde (disponibilidade), com vermelho reservado para ações destrutivas.
- Tipografia com fontes do sistema, sem dependência de internet.
- Layout em cartões com sombras suaves, hierarquia clara e espaçamento consistente.
- Indicadores visuais de disponibilidade, ocupação e percentual de vagas livres.
- Estados vazios e mensagens de feedback para orientar o usuário.
- Modal com fechamento por teclado (`Esc`), foco inicial no primeiro botão e atributos ARIA.
- Formulário com labels associados, foco visível e mensagens de erro com `role="alert"`.
- Layout responsivo com adaptação de navegação, formulário, tabela e mapa de vagas.
- Respeito à preferência do usuário por menos animações.
- Código sem comentários, com nomes descritivos e responsabilidades bem definidas.

---

## Limitações e trabalhos futuros

- Os dados ficam restritos ao navegador utilizado, pois não há back-end.
- Não há autenticação, controle de usuários ou sincronização entre dispositivos.
- O mapa de vagas não diferencia reservas por período ou tipo de vaga.
- Como evolução, seria possível:
  - implementar uma API e um banco de dados;
  - adicionar autenticação de moradores e administradores;
  - incluir edição de reservas;
  - registrar histórico de entrada e saída de veículos;
  - permitir reservas temporárias com data e hora.
