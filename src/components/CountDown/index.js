import { useCallback, useEffect, useState } from "react";
import { CountDownTimer } from "@components/CountDown/CountDownTimer";

/**
 * Countdown component displays a countdown timer until a target date.
 * @param {Object} props - Component properties.
 * @param {Date|string|number} props.targetDate - The target date for the countdown.
 * @param {boolean} [props.isOngoing=false] - Whether the event is ongoing.
 * @param {boolean} [props.hideText=false] - Whether to hide the descriptive text above the timer.
 * @param {boolean} [props.asString=false] - Returns countdown as text without days counter
 * @returns {JSX.Element} The rendered countdown component.
 */
export default function Countdown({
  targetDate,
  isOngoing = false,
  hideText = false,
  asString = false,
}) {
  /**
   * Calculates the time left until the target date.
   * @returns {Object} An object containing the time left in days, hours, minutes, and seconds.
   */
  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const difference = +new Date(targetDate) - +new Date();
    return difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const timeLegend = {
    days: "dias",
    hours: "horas",
    minutes: "minutos",
    seconds: "segundos",
  };

  if (!hasMounted) {
    return <div>Loading...</div>;
  }

  if (asString) {
    return `${String(timeLeft.hours).padStart(2, "0")}:${String(
      timeLeft.minutes
    ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;
  }

  return (
    <>
      {!hideText && (
        <div className="m-4">
          <p className="text-balance text-2xl md:text-xl text-center font-bold text-event-primary-text">
            {targetDate
              ? isOngoing
                ? "Evento em andamento"
                : "Próximo evento"
              : "Nenhum evento disponível"}
          </p>
          <p className="text-balance text-lg text-center text-event-secondary-text-80">
            {targetDate
              ? isOngoing
                ? "Aproveite o evento antes que termine."
                : "Prepare-se para o próximo evento!"
              : "Fique atento para futuras competições e prêmios incríveis!"}
          </p>
        </div>
      )}
      <div>
      {/* TODO: MRC custom */}
        <CountDownTimer timeLeft={timeLeft} timeLegend={timeLegend}></CountDownTimer>
      </div>
    </>
  );
}
