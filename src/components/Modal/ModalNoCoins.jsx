import Countdown from "@components/CountDown";
import { ClockIcon } from "@components/Icons/ClockIcon";
import ModalNotification from "@components/Modal/ModalNotification";
import StepLabel from "@components/Modal/StepLabel";
import { GlobalContext } from "@contexts/GlobalContext";
import { getNextCronExecutionDate } from "@utils/date";
import { useFirebaseAnalytics } from "@utils/firebase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import vercel from "../../../vercel.json";
import AdModal from "@components/Ads/AdModal";

const ModalNoCoins = ({ setShowModalNoCoinsAvailable }) => {
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const { handleLogEvent } = useFirebaseAnalytics();
  const { globalState } = useContext(GlobalContext);
  const router = useRouter();
  const RENEW_COINS_CRON_PATH = "/api/users/renew-coins";

  const handleWhatsShare = () => {
    window.location.href = `whatsapp://send?text=Bora%20jogar%20esse%20jogo%3F%20Duvido%20fazer%20mais%20pontos%20que%20eu%20%F0%9F%98%81%0A%0A${encodeURI(
      `${process.env.NEXT_PUBLIC_API_URL}${router.asPath}?referralCode=${globalState?.user?.referralCode}`
    )}`;
  };

  const getRenewCoinsCron = () => {
    const cron = vercel.crons.find(
      (cron) => cron.path === RENEW_COINS_CRON_PATH
    );
    return cron?.schedule;
  };

  const handleBuyCoins = () => {
    router.push(`/room/store`);
    handleLogEvent("buy_coins");
  };

  const showAdModal = () => {
    setIsAdModalOpen(true);
  };

  const handleAdComplete = () => {
    // Here you would typically call an API to award the coins
    // For now, we'll just close the modal
    setIsAdModalOpen(false);
    handleLogEvent("coins_earned_from_ad");
  };

  const contentModalNoCoinsAvailable = {
    1: {
      label: (
        <StepLabel
          currentStep={1}
          Icon={ClockIcon}
          totalSteps={1}
          text={
            <span className="text-gray-400">
              Você vai ganhar mais fichas em{" "}
              <Countdown
                targetDate={getNextCronExecutionDate(getRenewCoinsCron())}
                asString={true}
              />
            </span>
          }
        />
      ),
      title: "Você ainda pode continuar jogando!",
      texts: [
        "Compartilhe com seus amigos para ganhar mais fichas! Você ganha novas fichas para cada amigo que se cadastrar!",
        "Você também recebe fichas por dia e você pode voltar amanhã para continuar jogando, se não tiver mais fichas.",
      ],
      extraButtons: [
        {
          text: "Ganhar fichas grátis",
          color: "success",
          onClick: showAdModal,
          className: "w-full mb-4 text-white font-bold",
        },
        {
          text: "Comprar pacote de fichas",
          color: "default",
          onClick: handleBuyCoins,
          className: "w-full mb-4",
        },
        {
          text: "Compartilhar e ganhar fichas!",
          color: "default",
          onClick: handleWhatsShare,
          className: "w-full mb-4 text-white font-bold",
        },
      ],
      buttonText: "Fechar",
    },
  };

  return (
    <>
      <ModalNotification
        totalSteps={1}
        stepContent={contentModalNoCoinsAvailable}
        onClose={setShowModalNoCoinsAvailable}
      />
      <AdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onAdComplete={handleAdComplete}
      />
    </>
  );
};

export default ModalNoCoins;
