import CoinsAvailable from "@components/CoinsAvailable";
import TicketsAvailable from "@components/TicketsAvailable";
import { GlobalContext } from "@contexts/GlobalContext";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import request from "@utils/api";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BackIcon } from "../Icons/BackIcon";
import { AppConfig } from '@utils/loaderConfig';

export const getUserInfo = async (email) => {
  return await request(`/users`, "GET", null, { email });
};

export const getRankingInfo = async (email) => {
  const response = await request(`/games/ranking/${email}`);
  return response.data[0];
};

export default function HeaderRoom({ isBack }) {

  const brandingCatalogLogo = AppConfig.texts.branding.catalog.logo || "/logo-text.png";
  const brandingCatalogTitle = AppConfig.texts.branding.catalog.title || "Game Room";
  
  const router = useRouter();
  const { globalState } = useContext(GlobalContext);

  const handleBackButton = () => {
    const initialPathname = "/room";
    const currentQuery = router.query;

    if (router.pathname.startsWith(`${initialPathname}/store/`)) {
      router.push({
        pathname: `${initialPathname}/store`,
        query: currentQuery,
      });
    } else if (router.pathname.startsWith(`${initialPathname}/game/`)) {
      router.push({
        pathname: `${initialPathname}/catalog`,
      });
    } else {
      // For other cases, we'll use router.back() but we need to handle query preservation differently
      const previousPath = document.referrer;
      if (previousPath && previousPath.includes(window.location.origin)) {
        // If there's a previous page within our site
        const url = new URL(previousPath);
        const previousPathname = url.pathname;
        router.push({
          pathname: previousPathname,
          query: { ...currentQuery, ...Object.fromEntries(url.searchParams) },
        });
      } else {
        // If there's no previous page or it's from a different site, just go back
        router.back();
      }
    }
  };

  return (
    //TODO: MRC caso queira definir cor o cabeçalo do catalogo é aqui!
    <Navbar className="bg-transparent">
      <NavbarContent>
        <NavbarBrand>
          {isBack ? (
            <>
              <div onClick={handleBackButton} className="text-neutral-100">
                <BackIcon width={32} />
              </div>
            </>
          ) : (
            <div className="flex">
              {/* MRC: Marcio Lima */}
              <Image src={brandingCatalogLogo} width={30} height={30} alt={"Logo"} />
              <p className="font-archivo font-semibold text-inherit ml-2 self-center">
                {brandingCatalogTitle}
              </p>
            </div>
          )}
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <div className="flex text-xl">
            <CoinsAvailable
              className="mr-4"
              amountCoins={globalState?.user?.coinsAvailable}
            />
            <div className="flex">
              <TicketsAvailable
                amountTickets={globalState?.ticket?.totalTickets}
              />
            </div>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
