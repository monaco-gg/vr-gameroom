import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { games } from "@utils/data";
import GameSlider from "@components/Game/GameSlider";
import RoomLayout from "@components/Layout/RoomLayout";
import ModalNotification from "@components/Modal/ModalNotification";
import ModalSpecialOffer from "@components/Modal/ModalSpecialOffer";
import { getNotificationsByEmail, patchNotifications } from "@utils/index";
import {
  contentModalOnboarding,
  contentModalRenewCoins,
  contentModalReferralCompleted,
  contentModalAcquiredCoins,
} from "@utils/constants";

export default function Catalog({
  showModalRenewCoins,
  unreadNotificationsOfRenewCoinsIds,
  showModalReferralCompleted,
  unreadNotificationsOfReferralCompletedIds,
  showModalAcquiredCoins,
  unreadNotificationsOfAcquiredCoinsIds,
  host,
}) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [showSpecialOfferModal, setShowSpecialOfferModal] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    if (session) {
      const isFirstLoginKey = `first-login-${session?.user?.email}`;
      const specialOfferShownKey = `special-offer-shown-monaco30-${session?.user?.email}`;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isFirstLogin = !localStorage.getItem(isFirstLoginKey);
      const specialOfferShown = localStorage.getItem(specialOfferShownKey);
      
      if (isFirstLogin) {
        localStorage.setItem(isFirstLoginKey, today.toString());
        setTotalSteps(3);
        setModalContent(contentModalOnboarding);
        setShowModal(true);
      } else if (showModalRenewCoins) {
        setTotalSteps(1);
        setModalContent(contentModalRenewCoins);
        setShowModal(true);
      } else if (showModalReferralCompleted) {
        setTotalSteps(1);
        setModalContent(contentModalReferralCompleted);
        setShowModal(true);
      } else if (showModalAcquiredCoins) {
        setTotalSteps(1);
        setModalContent(contentModalAcquiredCoins);
        setShowModal(true);
      } else if (!specialOfferShown) {
        setShowSpecialOfferModal(true);
      }
    }
  }, [
    session,
    showModalRenewCoins,
    showModalReferralCompleted,
    showModalAcquiredCoins,
  ]);

  const handleModalClose = async () => {
    if (showModalRenewCoins) {
      await patchNotifications(unreadNotificationsOfRenewCoinsIds);
    }

    if (showModalReferralCompleted) {
      await patchNotifications(unreadNotificationsOfReferralCompletedIds);
    }

    if (showModalAcquiredCoins) {
      await patchNotifications(unreadNotificationsOfAcquiredCoinsIds);
    }

    setShowModal(false);
  };

  const handleSpecialOfferClose = () => {
    setShowSpecialOfferModal(false);
    localStorage.setItem(
      `special-offer-shown-monaco30-${session?.user?.email}`,
      "true"
    );
  };

  return (
    <RoomLayout session={session} title="Catálogo de jogos">
      <div className="mb-4">
        <div className="ml-6 mt-6">
          <h1 className="text-xl font-semibold">Catálogo de Jogos</h1>
          <p className="text-sm mb-10">
            Quanto mais você joga, mais tickets ganha. Acompanhe <br />o Ranking
            e seja o primeiro para ganhar a premiação.
          </p>
        </div>
        <GameSlider
          data={games}
          condition={(game) => {
            if (game.avaliable) {
              return true;
            }

            if (host.includes("localhost")) {
              return true;
            }

            return false;
          }}
        />
      </div>

      {showModal && (
        <ModalNotification
          totalSteps={totalSteps}
          stepContent={modalContent}
          onClose={handleModalClose}
        />
      )}

      {showSpecialOfferModal && (
        <ModalSpecialOffer onClose={handleSpecialOfferClose} />
      )}
    </RoomLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req } = context;
  let host = "";

  if (req) {
    host = req.headers.host;
  }

  if (session) {
    const getNotifications = await getNotificationsByEmail(
      session.user.email,
      req
    );

    let unreadNotificationsOfRenewCoinsIds = [];
    let unreadNotificationsOfReferralCompletedIds = [];
    let unreadNotificationsOfAcquiredCoinsIds = [];

    for (const notification of getNotifications) {
      if (!notification.readAt) {
        if (notification.type === "renew-coins") {
          unreadNotificationsOfRenewCoinsIds.push(notification._id);
        }
        if (notification.type === "referral-completed") {
          unreadNotificationsOfReferralCompletedIds.push(notification._id);
        }
        if (notification.type === "acquired-coins") {
          unreadNotificationsOfAcquiredCoinsIds.push(notification._id);
        }
      }
    }

    return {
      props: {
        showModalRenewCoins: unreadNotificationsOfRenewCoinsIds.length > 0,
        unreadNotificationsOfRenewCoinsIds,
        showModalReferralCompleted:
          unreadNotificationsOfReferralCompletedIds.length > 0,
        unreadNotificationsOfReferralCompletedIds,
        showModalAcquiredCoins:
          unreadNotificationsOfAcquiredCoinsIds.length > 0,
        unreadNotificationsOfAcquiredCoinsIds,
        host,
      },
    };
  }

  return { props: { host } };
}
