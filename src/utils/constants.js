import { ArrowIcon } from "@components/Icons/ArrowIcon";
import { JoystickIcon } from "@components/Icons/JoystickIcon";
import { MonacoinIcon } from "@components/Icons/MonacoinIcon";
import StepLabel from "@components/Modal/StepLabel";
import Fones from "../../public/imgs/store/fones.png";
import HeadsetTwo from "../../public/imgs/store/headset-2.png";
import Headset from "../../public/imgs/store/headset.png";
import Monitor from "../../public/imgs/store/monitor.png";
import Mouse from "../../public/imgs/store/mouse.png";
import Mousepad from "../../public/imgs/store/mousepad.png";
import Playstation from "../../public/imgs/store/playstation.png";
import Relogio from "../../public/imgs/store/relogio.png";
import TV from "../../public/imgs/store/tv.png";

/**
 * Maximum age for the authentication session in seconds (2 hours).
 * @constant {number}
 */
export const AUTH_SESSION_MAX_AGE = 2 * 60 * 60;

/**
 * URL for the sign-in page.
 * @constant {string}
 */
export const AUTH_PAGES_SIGN_IN = "/auth/sign-in";

/**
 * TODO: Implementar busca direto da base com a CRON
 */
export const winnersGeneral = [
  {
    matches: 273,
    tickets: 37772,
    position: 1,
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocILNDMm0ARFsHx5_a_nhSOYWj5bMgEc3KO6aOg4OvUq8o-8kEg=s96-c",
    userId: "670c2b2d4aa2eb79a60b3c98",
    nickname: "Vicente",
  },
  {
    matches: 188,
    tickets: 35136,
    position: 2,
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocIy0-ZJYs_Io226b9Sf-wOlHobfk0iOCf3MY9kZYsr1FLX5zA=s96-c",
    userId: "66b79bb151d49a025a9015e9",
    nickname: "diogogarces87",
  },
  {
    matches: 225,
    tickets: 31974,
    position: 3,
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocLE7RRW5wsCwnQAdfJp4o5URlZjw-JF8jAu5OHB4gEibWCqVQ=s96-c",
    userId: "66b79bb151d49a025a9015e9",
    nickname: "Neyruto",
  },
];
/**
 * Content for the onboarding modal.
 * @constant {Object}
 */
export const contentModalOnboarding = {
  1: {
    label: (
      <StepLabel
        currentStep={1}
        Icon={MonacoinIcon}
        totalSteps={3}
        text="Parabéns!"
      />
    ),
    title: "Você ganhou fichas!",
    texts: [
      "Use-as para começar a explorar e se divertir com a nossa vasta seleção de jogos.",
      "Acumule pontos jogando e concorra a prêmios incríveis. Quanto mais você joga, maiores são suas chances de ganhar.",
    ],
    buttonText: "Avançar",
    buttonColor: "primary",
  },
  2: {
    label: (
      <StepLabel
        currentStep={2}
        Icon={ArrowIcon}
        totalSteps={3}
        text="Ganhe mais fichas!"
      />
    ),
    title: "Compartilhe para ganhar mais fichas!",
    texts: [
      "Convide seus amigos para se juntarem ao app e receba fichas extras como recompensa.",
      "Compartilhe seu link de convite exclusivo com amigos. Para cada amigo que se registrar, você ganha mais fichas para continuar sua aventura.",
    ],
    buttonText: "Avançar",
    buttonColor: "primary",
  },
  3: {
    label: (
      <StepLabel
        currentStep={3}
        Icon={JoystickIcon}
        totalSteps={3}
        text="Dispute prêmios!"
      />
    ),
    title: "Use suas fichas, acumule pontos",
    texts: [
      "Use suas fichas, acumule pontos e mergulhe no mundo de aventuras que espera por você. Boa sorte e que a diversão comece!",
    ],
    buttonText: "Começar",
    buttonColor: "primary",
  },
};

export const contentModalRewardCoin = {
  1: {
    label: (
      <StepLabel
        currentStep={1}
        Icon={MonacoinIcon}
        totalSteps={1}
        text="Parabéns!"
      />
    ),
    title: "Você ganhou uma ficha!",
    texts: [
      "Use-as para começar a explorar e se divertir com a nossa seleção de jogos.",
      "Acumule pontos jogando, quanto mais você joga, maiores são seus ganhos.",
    ],
    buttonText: "Avançar",
    buttonColor: "primary",
  },
};

/**
 * Content for the renew coins modal.
 * @constant {Object}
 */
export const contentModalRenewCoins = {
  1: {
    label: (
      <StepLabel
        currentStep={1}
        Icon={MonacoinIcon}
        totalSteps={1}
        text="Parabéns!"
      />
    ),
    title: "Você ganhou fichas!",
    texts: [
      "Use-as para começar a explorar e se divertir com a nossa vasta seleção de jogos.",
      "Acumule pontos jogando e concorra a prêmios incríveis. Quanto mais você joga, maiores são suas chances de ganhar.",
    ],
    buttonText: "Avançar",
    buttonColor: "primary",
  },
};

/**
 * Content for the acquired coins modal.
 * @constant {Object}
 */
export const contentModalAcquiredCoins = {
  1: {
    label: (
      <StepLabel
        currentStep={1}
        Icon={MonacoinIcon}
        totalSteps={1}
        text="Parabéns!"
      />
    ),
    title: "Fichas Creditadas com Sucesso!",
    texts: [
      "As fichas que você comprou foram creditadas na sua conta. Agora você pode usá-las em suas próximas jogadas e aproveite ao máximo!",
    ],
    buttonText: "Fechar",
    buttonColor: "primary",
  },
};

/**
 * Content for the referral completed modal.
 * @constant {Object}
 */
export const contentModalReferralCompleted = {
  1: {
    label: (
      <StepLabel
        currentStep={1}
        Icon={MonacoinIcon}
        totalSteps={1}
        text="Parabéns!"
      />
    ),
    title: "Você ganhou fichas!",
    texts: [
      "O link que você enviou foi utilizado e o desafio foi aceito! Aproveite suas novas fichas para evoluir na competição",
    ],
    buttonText: "Fechar",
    buttonColor: "primary",
  },
};

/**
 * Information for large product displays.
 * @constant {Array<Object>}
 */
export const productsInfoBig = [
  {
    productName: "Headset Gamer JBL Quantum 100 para Consoles e PC Black",
    originalPrice: "R$ 214,92",
    discountPrice: "R$ 169,00",
    installmentInfo: "Em até 24x",
    imageSrc: Headset,
  },
  {
    productName:
      "Smart TV LED 43” 4K TLC 43P635 HDR, wifi dual band, bluetooth",
    originalPrice: "R$ 2.031,93",
    discountPrice: "R$ 1.759,00",
    installmentInfo: "Em até 24x",
    imageSrc: TV,
  },
];

/**
 * Information for small product displays.
 * @constant {Array<Object>}
 */
export const productsInfoSmall = [
  {
    productName: "Cadeira Gamer",
    originalPrice: "R$ 797,92",
    discountPrice: "R$ 399,90",
    installmentInfo: "Em até 24x",
    imageSrc: Headset,
    size: "small",
  },
  {
    productName: "Mouse Logitech",
    originalPrice: "R$ 997,90",
    discountPrice: "R$ 809,91",
    installmentInfo: "Em até 24x",
    imageSrc: Mouse,
    size: "small",
  },
  {
    productName: "Mousepad XL",
    originalPrice: "R$ 397,90",
    discountPrice: "R$ 99,90",
    installmentInfo: "Em até 24x",
    imageSrc: Mousepad,
    size: "small",
  },
  {
    productName: "Xiaomi Watch S3",
    originalPrice: "R$ 279,90",
    discountPrice: "R$ 129,90",
    installmentInfo: "Em até 24x",
    imageSrc: Relogio,
    size: "small",
  },
  {
    productName: "PlayStation 5 Sony",
    originalPrice: "R$ 4.948,90",
    discountPrice: "R$ 3.997,60",
    installmentInfo: "Em até 24x",
    imageSrc: Playstation,
    size: "small",
  },
  {
    productName: "Suporte para fone de ouvido",
    originalPrice: "R$ 187,30",
    discountPrice: "R$ 127,00",
    installmentInfo: "Em até 24x",
    imageSrc: HeadsetTwo,
    size: "small",
  },
  {
    productName: "Monitor Gamer Acer 165hz",
    originalPrice: "R$ 1.899,00",
    discountPrice: "R$ 1.237,90",
    installmentInfo: "Em até 24x",
    imageSrc: Monitor,
    size: "small",
  },
  {
    productName: "Fonde de Ouvido Bluetooth",
    originalPrice: "R$ 1.899,00",
    discountPrice: "R$ 1.237,90",
    installmentInfo: "Em até 24x",
    imageSrc: Fones,
    size: "small",
  },
];

/**
 * Information for small product displays.
 * @constant {Array<Object>}
 */
export const productCoins = [
  {
    name: "Pacote 10 Fichas",
    quantity: 1,
    description:
      "Pacote com 10 fichas: adquira e tenha mais fichas à disposição, garantindo mais tempo de jogo e diversão contínua.",
    price: 9.99,
    coinsAmount: 10,
    image: "/imgs/store/coinpack1.png",
    priority: 1,
  },
  {
    name: "Pacote 20 Fichas",
    description:
      "Pacote com 20 fichas: adquira e tenha mais fichas à disposição, garantindo mais tempo de jogo e diversão contínua.",
    quantity: 1,
    coinsAmount: 20,
    price: 19.9,
    image: "/imgs/store/coinpack2.png",
    priority: 2,
  },
  {
    name: "Pacote 50 Fichas",
    description:
      "Pacote com 50 fichas: adquira e tenha mais fichas à disposição, garantindo mais tempo de jogo e aumentando suas chances de vencer a competição.",
    quantity: 1,
    coinsAmount: 50,
    price: 34.99,
    image: "/imgs/store/coinpack3.png",
    priority: 3,
  },
];

/**
 * Settings for the large product slider.
 * @constant {Object}
 */
export const slideStoreSettingsBig = {
  centerMode: true,
  infinite: false,
  autoplay: true,
  centerPadding: "0px",
  speed: 2000,
  dots: true,
  dotsClass: "slick-dots",
  arrows: false,
  adaptiveHeight: false,
  variableWidth: false,
  swipeToSlide: true,
  slidesPerRow: 1,
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        autoplay: false,
        swipeToSlide: false,
        slidesPerRow: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
        infinite: false,
        autoplay: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.4,
        slidesToScroll: 1,
        infinite: false,
        autoplay: false,
      },
    },
  ],
};

/**
 * Settings for the small product slider.
 * @constant {Object}
 */
export const slideStoreSettingsSmall = {
  centerMode: false,
  infinite: false,
  autoplay: true,
  centerPadding: "0px",
  speed: 2000,
  arrows: false,
  adaptiveHeight: true,
  variableWidth: false,
  swipeToSlide: true,
  slidesToShow: 6,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        autoplay: false,
        swipeToSlide: false,
        slidesPerRow: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
        infinite: false,
        autoplay: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3.3,
        slidesToScroll: 1,
        infinite: false,
        autoplay: false,
      },
    },
  ],
};
