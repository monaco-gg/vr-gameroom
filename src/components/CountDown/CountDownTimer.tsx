interface CountDownTimerProps {
  timeLeft: Record<string, number | string>;
  timeLegend: Record<string, string>;  
}

export const CountDownTimer = ({ timeLeft, timeLegend }: CountDownTimerProps) => {

  if (Object.keys(timeLeft).length === 0) return null;

  return (
    <div className="flex text-center justify-center items-center space-x-2">
      {Object.keys(timeLeft).map((interval) => (
        <div
          key={interval}
          className="block text-lg font-semibold rounded-lg p-2 shadow bg-event-countdown text-event-countdown-primary-text"
          style={{ width: 110}}          
        >
          <p className="text-3xl">{timeLeft[interval]}</p>
          <p className="text-xs font-light text-event-countdown-secondary-text">
            {timeLegend[interval]}
          </p>
        </div>
      ))}
    </div>
  );
};
