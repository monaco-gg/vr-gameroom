/**
 * @typedef {Object} Game
 * @property {number} id - The unique identifier for the game.
 * @property {string} title - The title of the game.
 * @property {string} description - The description of the game.
 * @property {string} image - The URL of the game's image.
 * @property {Array<string>} genres - The genres associated with the game.
 * @property {number} cost - The cost to play the game in terms of in-game currency.
 */

/**
 * An array of game objects.
 * @type {Array<Game>}
 */
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

/**
 * Finds a game by its unique identifier.
 * @param {number} gameId - The unique identifier of the game to find.
 * @returns {Game|null} - The game object if found, otherwise null.
 */
export const findGame = (gameId) => {
  const item = games.filter((game) => game.id === gameId);

  if (item.length > 0) {
    return item[0];
  }

  return null;
};
