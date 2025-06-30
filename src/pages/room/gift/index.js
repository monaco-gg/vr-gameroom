import RoomLayout from "@components/Layout/RoomLayout";
import CountDown from "@components/CountDown";
import RewardsList from "@components/RewardsList";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import request from "@utils/api";
import { useEffect, useState } from "react";
import { getRemoteConfigValue } from "@utils/firebase";

/**
 * Fetches the event data from the server.
 *
 * @param {string} eventId - The ID of the event.
 * @returns {Promise<Object|null>} The event data or null if an error occurs.
 */
async function getEvent(eventId) {
  try {
    const data = await request(
      `/games/events/${eventId}`,
      "GET",
      null,
      null,
      true
    );
    return data;
  } catch (error) {
    return null;
  }
}

export default function Gift({ isOngoing, targetDate }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = await getRemoteConfigValue("modal_winner_event_id");
        if (eventId) {
          const eventResponse = await getEvent(eventId);
          if (eventResponse && eventResponse.data) {
            setEventData(eventResponse.data);
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEventData();
  }, []);

  const targetDateObj = targetDate ? new Date(targetDate) : null;

  const onClose = () => {
    setIsOpen(false);
    // setIsOpenNewEvent(false);
  };

  const GoldenGlowTitle = ({ children }) => {
    return (
      <div className="relative inline-block">
        {/* Texto original */}
        <h1 className="relative z-10 text-yellow-500 font-semibold text-2xl animate-pulse">
          {children}
        </h1>

        {/* Efeito de brilho */}
        <span className="absolute inset-0 z-0 blur-sm animate-pulse"></span>
      </div>
    );
  };

  return (
    <RoomLayout session={session} title={"Premiação"}>
      <div className="mr-6 ml-6">
        <div className="flex flex-col justify-start items-start mt-8">
          <h1 className="text-3xl font-semibold mb-2">
            Oi {session?.user?.name.split(" ")[0]}
          </h1>
          <span className="text-base text-gray-400">
            {targetDate
              ? isOngoing
                ? "Confira o tempo restante da competição"
                : "Confira o tempo restante para o próximo evento e enquanto isso pratique e convide amigos!"
              : "Fique atento para futuras competições e enquanto isso pratique e convide amigos!"}
          </span>
        </div>
        <div className="flex mt-6 w-full overflow-hidden">
          <div className="max-w-full mx-auto">
            <CountDown
              targetDate={targetDateObj}
              hideText={true}
              isOngoing={isOngoing}
            />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start mt-8">
          <h1 className="text-2xl font-semibold mb-2">Prêmiação</h1>
          <span className="text-base text-gray-400">
            Participe, acumule pontos e ganhe prêmios. Salve seu telefone para
            que a gente entre em contato no final da competição.
          </span>
        </div>
      </div>
      <RewardsList hideText={true} />
      <div className="mr-6 ml-6">
        <div className="mt-8 w-full">
          <Button
            className="w-full p-3 rounded-lg text-gray-300 bg-gray-800 shadow-md hover:bg-gray-600 text-sm border border-gray-700"
            onPress={() => {
              window.open(
                "https://go.monaco.gg/terms-and-conditions",
                "_blank"
              );
            }}
          >
            Ver Termos e Condições
          </Button>
        </div>
      </div>
    </RoomLayout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  let eventData = null;
  let isOngoing = false;
  let targetDate = null;

  try {
    const eventResponse = await request(
      "/games/events",
      "GET",
      null,
      null,
      true,
      req
    );
    eventData = eventResponse.data;

    if (eventData) {
      const now = new Date();
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      if (now >= startDate && now <= endDate) {
        isOngoing = true;
        targetDate = endDate.toISOString();
      } else if (now < startDate) {
        isOngoing = false;
        targetDate = startDate.toISOString();
      } else {
        targetDate = null; // Não há eventos atuais ou futuros
      }
    } else {
      targetDate = null; // Não há eventos atuais ou futuros
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
  }

  return {
    props: {
      isOngoing,
      targetDate,
    },
  };
}
