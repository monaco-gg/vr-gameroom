import { useFirebaseAnalytics } from "@utils/firebase";
import { useRouter } from "next/router";

export const MenuItem = ({
  icon,
  title,
  route,
  isActive,
  eventName,
  isNew,
}) => {
  const router = useRouter();
  const { handleLogEvent } = useFirebaseAnalytics();

  return (
    <div
      className={`flex flex-col items-center text-center ${
        isActive ? "text-menu-text-selected" : "text-menu-text"
      }`}
      onClick={() => {
        handleLogEvent(eventName);
        router.push(route);
      }}
    >
      <div className="relative"> 
        {/* <div className={isNew ? "animate-pulse" : ""}>{icon}</div> */}
        <div>{icon}</div>
        {isNew && (
          <span className="absolute -top-2 -right-2 bg-[#d6409f] text-white text-[8px] rounded-full px-1 py-0.5 animate-bounce w-12">
            30% OFF
          </span>
        )}
      </div>
      <span className="text-xs mt-1">{title}</span>
    </div>
  );
};
