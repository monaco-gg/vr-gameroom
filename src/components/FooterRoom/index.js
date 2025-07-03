import { CommunityIcon } from "@components/Icons/CommunityIcon";
import { CommunitySolidIcon } from "@components/Icons/CommunitySolidIcon";
import { GameboyIcon } from "@components/Icons/GameboyIcon";
import { GiftIcon } from "@components/Icons/GiftIcon";
import { GiftSolidIcon } from "@components/Icons/GiftSolidIcon";
import { StoreIcon } from "@components/Icons/StoreIcon";
import { StoreSolidIcon } from "@components/Icons/StoreSolidIcon";
import { TrophyIcon } from "@components/Icons/TrophyIcon";
import { TrophySolidIcon } from "@components/Icons/TrophySolidIcon";
import { MenuItem } from "@components/MenuItem";
import UserAvatar from "@components/UserAvatar";
import { useFirebaseAnalytics } from "@utils/firebase";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { FaUserCircle, FaUsers } from "react-icons/fa";

const menuConfig = [
  {
    title: "Ranking",
    icon: <TrophyIcon className="h-6 w-6" />,
    iconActive: <TrophySolidIcon className="h-6 w-6" />,
    route: "/room/ranking",
    eventName: "ranking_footer_room_clicked",
    private: false,
  },
  {
    title: "Prêmios",
    icon: <GiftIcon className="h-6 w-6" />,
    iconActive: <GiftSolidIcon className="h-6 w-6" />,
    route: "/room/gift",
    eventName: "gift_footer_room_clicked",
    private: false,
  },
  {
    title: "Loja",
    icon: <StoreIcon className="h-6 w-6" />,
    iconActive: <StoreSolidIcon className="h-6 w-6" />,
    route: "/room/store?coupon=MONACO30",
    eventName: "gift_footer_store_clicked",
    private: false,
  },
  {
    title: "Comunidade", // Nova opção para Comunidade
    icon: <FaUsers className="h-8 w-8" />,
    iconActive: <FaUsers className="h-8 w-8" />,
    route: "/room/community",
    eventName: "community_footer_room_clicked",
    private: false,
  },
  {
    title: "Games",
    icon: <GameboyIcon className="h-6 w-6" />,
    iconActive: <GameboyIcon className="h-6 w-6" />,
    route: "/room/catalog",
    eventName: "games_footer_room_clicked",
    private: false,
  },
];

export default function FooterRoom({ session }) {
  const router = useRouter();
  const pathname = usePathname();
  const { handleLogEvent } = useFirebaseAnalytics();

  return (
    <div className="fixed inset-x-0 bottom-0 shadow-lg bg-opacity-90 z-50 m-0 p-0
    bg-menu ">
      <div className="flex justify-between p-5">
        {menuConfig
          .filter((item) => !item.private)
          .map((item, index) => (
            <MenuItem
              key={index}
              icon={
                pathname?.includes(item.route.split("?")[0])
                  ? item.iconActive
                  : item.icon
              }
              title={item.title}
              route={item.route}
              isActive={pathname?.includes(item.route.split("?")[0])}
              eventName={item.eventName}
              isNew={item.isNew}
            />
          ))}
        {session?.user ? (
          <div
            onClick={() => {
              handleLogEvent("profile_footer_room_clicked");
              router.push("/room/profile");
            }}
            className={`cursor-pointer mt-1 p-0 rounded-full ring-2 w-[36px] h-[36px] ${
              pathname === "/room/profile" ? "ring-menu-ring-selected" : "ring-menu-ring"              
            }`}
          >
            <UserAvatar 
              user={session.user} 
              size={36} 
              className="rounded-full m-0 p-0"
              fallbackClassName="rounded-full m-0 p-0"
            />
          </div>
        ) : (
          <MenuItem
            icon={<FaUserCircle className="h-7 w-7 mt-1" />}
            title={"Perfil"}
            route={"/room/profile"}
            isActive={pathname === "/room/profile"}
            eventName={"profile_footer_room_clicked"}
          />
        )}
      </div>
    </div>
  );
}
