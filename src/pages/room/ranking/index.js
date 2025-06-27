import RoomLayout from "@components/Layout/RoomLayout";
import RankingListItem from "@components/Ranking/RankingListItem";
import request from "@utils/api";
import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getRemoteConfigValue } from "@utils/firebase";
import Countdown from "@components/CountDown";
import RankingByGames from "@components/Ranking/RankingByGame";
import ModalWinner from "@components/Modal/ModalWinner";
import AdBanner from "@components/Ads/AdBanner";
// import ModalNewEvent from "@components/Modal/ModalNewEvent";

export const revalidate = 0;

/**
 * Fetches the ranking data from the server.
 *
 * @param {Object} req - The request object.
 * @returns {Promise<Object|null>} The ranking data or null if an error occurs.
 */
async function getRanking(req) {
  try {
    //   FIXME: remover na refotoração

    const currentMonthStartDate = moment("2024-12-13")
      .hour(21)
      .minute(0)
      .second(0)
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const currentMonthEndDate = moment("2024-12-23")
      .hour(21)
      .minute(0)
      .second(0)
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const data = await request(
      "/games/ranking",
      "GET",
      null,
      { startDate: currentMonthStartDate, endDate: currentMonthEndDate },
      true,
      req
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Fetches the event data from the server.
 *
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} The event info including isOngoing and targetDate.
 */
async function getEventInfo(req) {
  try {
    const eventResponse = await request(
      "/games/events",
      "GET",
      null,
      null,
      true,
      req
    );

    if (eventResponse && eventResponse.data) {
      const now = new Date();
      const startDate = new Date(eventResponse.data.startDate);
      const endDate = new Date(eventResponse.data.endDate);

      let isOngoing = false;
      let targetDate = null;

      if (now >= startDate && now <= endDate) {
        isOngoing = true;
        targetDate = endDate.toISOString();
      } else if (now < startDate) {
        targetDate = startDate.toISOString();
      }

      return {
        isOngoing,
        targetDate,
      };
    }
  } catch (error) {
    console.log(error);
  }

  return {
    isOngoing: false,
    targetDate: null,
  };
}

/**
 * Fetches the user ranking data from the server.
 *
 * @param {string} email - The email of the user.
 * @param {Object} req - The request object.
 * @returns {Promise<Object|null>} The user ranking data or null if an error occurs.
 */
async function getUserRanking(email, req) {
  const currentMonthStartDate = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEndDate = moment()
    .endOf("month")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  // const currentMonthStartDate = moment("2024-11-14")
  //   .hour(18)
  //   .minute(0)
  //   .second(0)
  //   .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  // const currentMonthEndDate = moment("2024-11-29")
  //   .hour(18)
  //   .minute(0)
  //   .second(0)
  //   .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  try {
    const data = await request(
      `/games/ranking/${email}`,
      "GET",
      null,
      { startDate: currentMonthStartDate, endDate: currentMonthEndDate },
      true,
      req
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
    console.log(error);
    return null;
  }
}

/**
 * Component to display the ranking list.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.ranking - The list of ranking data.
 * @param {Object} props.featuredUser - The featured user data.
 * @param {boolean} props.isUserRanking - Flag indicating if the user is in the ranking.
 * @returns {JSX.Element} The ranking component.
 */
export default function Ranking({
  ranking,
  featuredUser,
  isUserRanking,
  isOngoing,
  targetDate,
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  // const [isOpenNewEvent, setIsOpenNewEvent] = useState(true);
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

  const onClose = () => {
    setIsOpen(false);
    // setIsOpenNewEvent(false);
  };

  return (
    <RoomLayout session={session} title="Player Ranking">
      {session && session.user && (
        <>
          <div className="mr-6 ml-6">
            <div className="flex flex-col justify-start items-start mt-8">
              <h1 className="text-3xl font-semibold mb-2">
                Oi {session?.user?.name.split(" ")[0]}
              </h1>
              <p className="text-base text-left text-gray-400">
                {targetDate
                  ? isOngoing
                    ? "Confira o tempo restante da competição"
                    : "Confira o tempo restante para o próximo evento e enquanto isso pratique e convide amigos!"
                  : "Fique atento para futuras competições e enquanto isso pratique e convide amigos!"}
              </p>
            </div>
            <div className="flex mt-6 mb-4 w-full overflow-hidden">
              <div className="max-w-full mx-auto">
                <Countdown
                  targetDate={targetDate}
                  hideText={true}
                  isOngoing={isOngoing}
                />
              </div>
            </div>
          </div>

          <AdBanner slot={3180566253} />

          <div className="mx-6 mb-2 mt-1 text-left">
            <span className="text-base text-gray-400">
              Destaques da Competição por Game
            </span>
          </div>
          {/* <div className="mx-6 overflow-hidden rounded-2xl bg-[#1b133f]">
            {ranking &&
              ranking.map(
                ({ totalMatches, totalTickets, rank, user, featured }) => (
                  <RankingListItem
                    key={user._id} // Ensure the key is unique, like the user's email
                    featured={featured}
                    avatarSrc={user?.photo}
                    name={user?.nickname || user?.name}
                    matches={totalMatches}
                    tickets={totalTickets}
                    position={rank || "-"}
                    useMedal={true}
                  />
                )
              )}

            {!isUserRanking && featuredUser && (
              <RankingListItem
                featured={true}
                avatarSrc={featuredUser?.user?.photo}
                name={featuredUser?.user?.nickname || featuredUser?.user?.name}
                matches={featuredUser?.totalMatches}
                tickets={featuredUser?.totalTickets}
                position={featuredUser?.rank}
                useMedal={false}
              />
            )}
          </div> */}
          <RankingByGames
            rankingGeneral={ranking}
            featuredUserGeneral={featuredUser}
            isUserRankingGeneral={isUserRanking}
          />
        </>
      )}
      {/* {isOpen && <ModalWinner isOpen={isOpen} onClose={onClose} />} */}
      {/* <ModalNewEvent
        isOpen={isOpenNewEvent}
        onClose={onClose}
        targetDate={targetDate}
      /> */}
    </RoomLayout>
  );
}

/**
 * Fetches initial data for the ranking page.
 *
 * @param {Object} context - The Next.js context object.
 * @param {Object} context.req - The request object.
 * @returns {Promise<Object>} The props for the ranking page.
 */
export async function getServerSideProps(context) {
  const { req } = context;
  let rankingData = {};
  let eventData = {};
  let featuredUser = {};
  let isUserRanking = false;
  let ranking = [];

  const session = await getSession({ req });

  try {
    eventData = await getEventInfo(req);
    rankingData = await getRanking(req);
    rankingData = rankingData?.data || [];
  } catch (error) {
    console.log(error);
  }

  if (session && session.user) {
    try {
      const userRankData = await getUserRanking(session.user.email, req);
      if (userRankData?.data?.[0]) {
        featuredUser = userRankData.data[0];
      } else {
        featuredUser = {
          user: {
            name: session.user.name,
            photo: session.user?.image || null,
            _id: 0,
          },
          rank: 0,
          featured: true,
          totalMatches: 0,
          totalTickets: 0,
        };
      }

      ranking = rankingData.map((rank) => {
        if (rank.user._id === featuredUser.user._id) {
          isUserRanking = true;
          return { ...rank, featured: true };
        }
        return { ...rank, featured: false };
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    props: {
      session,
      ranking,
      featuredUser,
      isUserRanking,
      targetDate: eventData.targetDate,
      isOngoing: eventData.isOngoing,
    },
  };
}
