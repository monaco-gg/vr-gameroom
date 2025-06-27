import Countdown from "@components/CountDown";
import { MonacoinIcon } from "@components/Icons/MonacoinIcon";
import ModalNoCoins from "@components/Modal/ModalNoCoins";
import { getNextCronExecutionDate } from "@utils/date";
import { useEffect, useState } from "react";
import vercel from "../../../vercel.json";

/**
 * Countdown component displays a countdown timer until a target date.
 * @param {Object} props - Component properties.
 * @param {number} amountCoins - Quantity of user's coins
 * @returns {JSX.Element} The rendered countdown component.
 */
export default function CoinsAvailable({ amountCoins, className = "" }) {
  const [userHasCoin, setUserHasCoin] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [renewCoinsCron, setRenewCoinsCron] = useState();
  const [showModalNoCoinsAvailable, setShowModalNoCoinsAvailable] = useState(false);
  const textColor = userHasCoin ? "text-[#FFCA16]" : "text-[#FFF]";
  const RENEW_COINS_CRON_PATH = "/api/users/renew-coins";

  useEffect(() => {
    setUserHasCoin(!!amountCoins);

    if (!userHasCoin)
      setRenewCoinsCron(getRenewCoinsCron())

    if (typeof amountCoins !== "undefined") setHasMounted(true);
  }, [amountCoins, userHasCoin]);

  const handleCoinsAvailable = () => {
    if (amountCoins > 0) return;
    setShowModalNoCoinsAvailable(true);
  };

  const getRenewCoinsCron = () => {
    const cron = vercel.crons.find(cron => cron.path === RENEW_COINS_CRON_PATH);
    return cron?.schedule;
  }

  if (!hasMounted) {
    return <></>;
  }

  return (
    <div
      className={`flex items-center ${className} ${textColor}`}
      onClick={handleCoinsAvailable}
    >
      <>
        <MonacoinIcon size={24} layout="fixed" />
        <div className="bg-[#903101] h-[20px] ml-[-10px] pl-[15px] px-2 self-center content-center font-semibold text-sm rounded-lg">
          <span>
            {!userHasCoin && renewCoinsCron? 
            (
              <Countdown targetDate={getNextCronExecutionDate(renewCoinsCron)} asString={true} />
            ) : (
              amountCoins
            )}
          </span>
        </div>
      </>
      {showModalNoCoinsAvailable && (
        <ModalNoCoins
          setShowModalNoCoinsAvailable={setShowModalNoCoinsAvailable}
        />
      )}
    </div>
  );
}
