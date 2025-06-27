import { useEffect } from "react";
import { GAME_STATE, getEngine } from "../../app/contexts/EngineContext";
import { DB } from "../../app/utils/storage";
import AnalogStick from "./AnalogStick";

/**
 * Joystick component that provides controls for a game.
 * @param {Object} props - The component props.
 * @param {Object} props.engine - The game engine.
 * @param {function} props.onPressUp - Function to call when the joystick is moved up.
 * @param {function} props.onPressDown - Function to call when the joystick is moved down.
 * @param {function} props.onPressLeft - Function to call when the joystick is moved left.
 * @param {function} props.onPressRight - Function to call when the joystick is moved right.
 * @param {function} props.onPressA - Function to call when the "A" button is pressed.
 * @param {function} props.onIdle - Function to call when the joystick is idle.
 * @returns {JSX.Element} - A div containing the Joystick and buttons.
 */
const Joystick = ({
  engine,
  onPressUp,
  onPressDown,
  onPressLeft,
  onPressRight,
  onPressA,
  onIdle,
}) => {

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" || event.code === "Enter") {
        onPressA(engine);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPressA, engine]);

  return (
    <>
      <div className="w-full">
        <p className="font-bold mt-4 text-neutral-950 text-sm txt-mnc text-center">
          SUPER MONACO
        </p>
      </div>
      <div className="w-full p-4 flex pt-2 m-auto mx-auto">
        {onPressRight && onPressLeft && (
          <div className="w-1/3 text-center">
            <AnalogStick
              onLeft={() => {
                onPressLeft(getEngine());
              }}
              onRight={() => {
                onPressRight(getEngine());
              }}
              onUp={() => {
                onPressUp(getEngine());
              }}
              onDown={() => {
                onPressDown(getEngine());
              }}
              onIdle={() => {
                onIdle(getEngine());
              }}
            />
          </div>
        )}
        <div className="w-1/2 text-center">
          <button
            className="btn-mnc btn-mnc-size-1 text-white m-auto py-5 px-4"
            onClick={() => {
              DB.setState(GAME_STATE.PAUSED);
            }}
          >
            <span className="text-4xl -mt-3 cursor-vertical-text inline-block align-middle">
              &#8962;
            </span>
          </button>
        </div>
        <div className="w-1/2 text-center">
          <button
            className="btn-mnc text-white m-auto py-2 px-4 text-2xl"
            onClick={() => {
              onPressA(engine);
            }}
            onTouchStart={() => {
              onPressA(engine);
            }}
          >
            <span>A</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Joystick;
