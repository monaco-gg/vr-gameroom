
# Database


```json
{
  "title": "Campeonato Season 5 - Black Friday",
  "description": "Competição do Game Room para Black Friday 2024.",
  "startDate": {
    "$date": "2024-11-14T21:00:00.000Z"
  },
  "endDate": {
    "$date": "2024-11-29T21:00:00.000Z"
  },
  "winners": []
}
``` 

# Date Path

- src\components\Ranking\RankingByGame.jsx
- src\pages\ranking.js
- src\pages\room\game\[id]\index.js
- src\pages\room\ranking\index.js

# Code

- lib: https://momentjs.com/

```Javascript
const currentMonthStartDate = moment("2024-11-14")
.hour(18)
.minute(0)
.second(0)
.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

const currentMonthEndDate = moment()
.endOf("month")
.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

```

## Game Config

- src\utils\data.js

```javascript

export const games = [
  {
    id: 4,
    title: "Super Monaco",
    description:
      "É um jogo de corrida retrô onde cada milissegundo conta. Teste seus reflexos ao máximo enquanto você arranca no momento exato para deixar seus rivais comendo poeira. Domine o tempo e acelere como um verdadeiro piloto de Fórmula 1 neste clássico arcade de alta velocidade!",
    image: "/imgs/games/game-04.png",
    boxart: "/imgs/games/boxart/monaco-boxart-game-4.png",
    icon: "/imgs/games/icons/icon-game-04.png",
    genres: ["Corrida"],
    cost: 1,
    avaliable: true,
    displayRanking: true,
    displayMainRanking: false,
  },
  {
    id: 3,
    title: "Lava Rush",
    description:
      "Você é um explorador preso em uma caverna com lava. Pule de plataforma em plataforma, que surgem aleatoriamente, para escapar. A velocidade da lava e a dificuldade aumentam com o tempo. Escape da Caverna de Lava neste emocionante desafio!",
    image: "/imgs/games/game-03.png",
    boxart: "/imgs/games/boxart/monaco-boxart-game-3.png",
    icon: "/imgs/games/icons/icon-game-03.png",
    music: "/audios/game-3-lava-rush.mp3",
    genres: ["Plataforma"],
    cost: 1,
    avaliable: true,
    displayRanking: true,
    displayMainRanking: true,
  },
  {
    id: 1,
    title: "The Runner",
    description:
      "Corra por sua vida em um mundo infestado de criaturas aterrorizantes. Sobreviva, desvende mistérios e salve a humanidade!",
    image: "/imgs/games/game-01.png",
    boxart: "/imgs/games/boxart/monaco-boxart-game-1.png",
    icon: "/imgs/games/icons/icon-game-01.png",
    music: "/audios/game-1-the-runner.mp3",
    genres: ["Plataforma"],
    cost: 1,
    avaliable: true,
    displayRanking: true,
    displayMainRanking: true,
  },
  {
    id: 2,
    title: "Day One",
    description:
      "Mergulhe em batalhas aéreas frenéticas, enfrente chefes alienígenas formidáveis e lute para defender a última esperança da humanidade. Com gráficos impressionantes e jogabilidade envolvente, prepare-se para uma experiência épica de sobrevivência e destruição em um cenário urbano apocalíptico.",
    image: "/imgs/games/game-02.png",
    boxart: "/imgs/games/boxart/monaco-boxart-game-2.png",
    icon: "/imgs/games/icons/icon-game-02.png",
    music: "/audios/game-2-day-one.mp3",
    genres: ["Shoot em Up"],
    cost: 1,
    avaliable: true,
    displayRanking: true,
    displayMainRanking: true,
  },
];
```

