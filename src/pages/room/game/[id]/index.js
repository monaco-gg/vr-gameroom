import moment from "moment";
import "moment/locale/pt-br";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { Button, Divider, Link, Skeleton } from "@nextui-org/react";
import { NextSeo } from "next-seo";

import GameBackground from "@components/Game/GameBackground";
import { MonacoinIcon } from "@components/Icons/MonacoinIcon";
import RoomLayout from "@components/Layout/RoomLayout";
import NotFoundCard from "@components/MagicCard/NotFoundCard";
import ModalNoCoins from "@components/Modal/ModalNoCoins";
import ShareGame from "@components/Modal/ShareGame";
import RankingListItem, {
  RANKING_TYPE,
} from "@components/Ranking/RankingListItem";
import { GlobalContext } from "@contexts/GlobalContext";
import request from "@utils/api";
import { findGame } from "@utils/data";
import Image from "next/legacy/image";

import "react-h5-audio-player/lib/styles.css";
import "./audio.css";

const currentMonthName =
  moment().format("MMMM").charAt(0).toUpperCase() +
  moment().format("MMMM").slice(1);

/**
 * Fetches the ranking data from the server.
 *
 * @param {Object} req - The request object.
 * @param {string} gameId - The ID of the game.
 * @param {string} startDate - The start date for the ranking period.
 * @param {string} endDate - The end date for the ranking period.
 * @returns {Promise<Object|null>} The ranking data or null if an error occurs.
 */
async function getRankingByGameId(req, gameId, startDate, endDate) {
  try {
    // FIXME: melhorar essa lógica de negócio que fixa o ID do game
    const data = await request(
      `/games/ranking${gameId == 4 ? "/4" : ""}`,
      "GET",
      null,
      { gameId, startDate, endDate },
      true,
      req
    );
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches the user ranking data from the server.
 *
 * @param {string} email - The email of the user.
 * @param {string} gameId - The ID of the game.
 * @param {string} startDate - The start date for the ranking period.
 * @param {string} endDate - The end date for the ranking period.
 * @param {Object} req - The request object.
 * @returns {Promise<Object|null>} The user ranking data or null if an error occurs.
 */
async function getUserRankingByGameId(email, gameId, startDate, endDate, req) {
  try {
    const data = await request(
      `/games/ranking/${email}`,
      "GET",
      null,
      { gameId, startDate, endDate },
      true,
      req
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// FIXME: Melhorar lógica com ID fixo do game
function RankingByGame({
  game,
  currentMonthName,
  ranking,
  isUserRanking,
  featuredUser,
}) {
  return (
    <>
      <div className="ml-4 mr-4 mt-4">
        <Divider />
      </div>
      <div className="mb-6 p-2">
        <div className="flex flex-col justify-start items-start mt-4 ml-6">
          <p className="text-white text-2xl font-bold">Ranking</p>
          <p className="mb-4 text-sm text-gray-400">
            Confira os jogadores que estão dominando este mês de{" "}
            {currentMonthName}.
          </p>
        </div>
        <div className="overflow-hidden mt-4">
          {ranking &&
            ranking.map(
              (
                {
                  totalMatches,
                  minLapTime,
                  totalTickets,
                  rank,
                  user,
                  featured,
                },
                index
              ) => (
                <RankingListItem
                  key={index} // Ensure the key is unique, like the user's email
                  featured={featured}
                  avatarSrc={user?.photo}
                  name={user?.nickname || user?.name}
                  matches={totalMatches}
                  tickets={game.id == 4 ? minLapTime : totalTickets}
                  position={game.id == 4 ? index + 1 : rank || "-"}
                  useMedal={false}
                  type={game.id == 4 ? RANKING_TYPE.TIME : RANKING_TYPE.TICKETS}
                />
              )
            )}

          {/* TODO: Mudar layout para melhor lugar por tempo */}
          {game.id !== 4 && !isUserRanking && featuredUser && (
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
        </div>
      </div>
    </>
  );
}

export default function Game({ ranking, featuredUser, isUserRanking }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { query, isReady, asPath } = useRouter();
  const [game, setGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalNoCoinsAvailable, setShowModalNoCoinsAvailable] =
    useState(false);
  const { globalState } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (game === null && isReady) {
      setGame(findGame(parseInt(query?.id)) || -1);
    }

    if (game !== null) {
      router.prefetch(`/play/${game.id}`);
    }
  }, [game, isReady, router, query?.id]);

  const handleShareButton = () => {
    setShowModal(true);
  };

  if (game === null || !isReady) {
    return (
      <RoomLayout session={session} title={`Carregando... | Monaco GameRoom`}>
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
      </RoomLayout>
    );
  }

  const handlePlayButton = () => {
    const hasEnoughCoins = globalState?.user?.coinsAvailable >= game.cost;

    if (hasEnoughCoins) {
      setIsLoading(true);
      router.push(`/play/${game.id}`);
    } else {
      setShowModalNoCoinsAvailable(true);
    }
  };

  if (game === -1 && isReady) {
    return <NotFoundCard session={session} />;
  }

  return (
    <RoomLayout
      session={session}
      isBack={true}
      title={`Jogar ${game.title} | Monaco GameRoom`}
      withFooter={false}
    >
      <NextSeo
        title={`Jogar ${game.title} na Monaco GameRoom`}
        description="Jogue e concorra a prêmios"
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_API_URL}/room/game/${query.id}`,
          title: `Jogar ${game.title} na Monaco GameRoom`,
          description: "Jogue e concorra a prêmios",
          images: [
            {
              url: "https://games.monaco.gg/imgs/social/socialmedia_share.png",
            },
          ],
          siteName: "Monaco",
        }}
      />
      <div className="p-2">
        <GameBackground imageUrl={game.image}>
          <p className="text-white text-2xl font-bold">{game.title}</p>
          <p className="mb-4 text-sm text-gray-400">{game.description}</p>

          <div className="w-full h-[40svh] overflow-hidden relative rounded-lg">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={game.image}
                alt={game.title}
                priority={true}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
          </div>
        </GameBackground>

        <div className="max-w-sm mx-auto">
          <div className="bg-neutral-950 shadow-lg rounded-lg p-4 mx-4 bg-opacity-45">
            <div className="flex justify-around text-center">
              <div className="w-1/3 text-sm">
                Estilo <br />
                {game?.genres[0]}
              </div>

              <div className="w-1/3 text-center text-yellow-300 text-sm">
                {" "}
                Custo <br />{" "}
                <div className="flex text-center self-center items-center w-full mx-8">
                  <MonacoinIcon size={24} layout="fixed" />
                  <span className="ml-1">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {game?.displayRanking === true ? (
          <RankingByGame
            currentMonthName={currentMonthName}
            ranking={ranking}
            isUserRanking={isUserRanking}
            featuredUser={featuredUser}
            game={game}
          />
        ) : (
          <>
            <div className="ml-4 mr-4 mt-4">
              <Divider />
            </div>
            <div className="mb-6 p-2">
              <div className="flex flex-col justify-start items-start mt-4 ml-6">
                <p className="text-white text-2xl font-bold">Ranking</p>
                <p className="mb-4 text-sm text-gray-400 mt-2">
                  Ranking indisponível, jogo em fase de testes.
                </p>
              </div>
            </div>
          </>
        )}

        <div className="fixed bottom-0 left-0 z-50 w-full p-4 bg-neutral-950 shadow-lg rounded-lg">
          <div className="flex justify-between mt-4 mb-10">
            <Button
              as={Link}
              variant="solid"
              size="lg"
              fullWidth
              className="mr-2"
              color="primary"
              isLoading={isLoading}
              onPress={handlePlayButton}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Jogar"}
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              onPress={handleShareButton}
            >
              Compartilhar
            </Button>
          </div>
        </div>
        {showModal && (
          <ShareGame
            shareURL={`${process.env.NEXT_PUBLIC_API_URL}${asPath}?referralCode=${globalState?.user?.referralCode}`}
            stepContent={{
              label: "Compartilhe com seus amigos!",
              title: "Compartilhe e ganhe mais fichas!",
              texts: [
                "Use-as para começar a explorar e se divertir com a nossa vasta seleção de jogos.",
                "Acumule pontos jogando e concorra a prêmios incríveis. Quanto mais você joga, maiores são suas chances de ganhar.",
              ],
              buttonText: "Botão",
            }}
            onClose={setShowModal}
          />
        )}
        {showModalNoCoinsAvailable && (
          <ModalNoCoins
            setShowModalNoCoinsAvailable={setShowModalNoCoinsAvailable}
          />
        )}
      </div>
    </RoomLayout>
  );
}

export const metadata = {
  title: "Jogar Devorador | Monaco GameRoom",
  description: "Jogue e concorra a prêmios",
  image: "https://games.monaco.gg/imgs/social/socialmedia_share.png",
  openGraph: {
    title: "Jogar Devorador | Monaco GameRoom",
    description: "Jogue e concorra a prêmios",
    image: "https://games.monaco.gg/imgs/social/socialmedia_share.png",
  },
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const { id } = context.query;

  const currentMonthStartDate = moment()
    .startOf("month")
    .hour(21)
    .minute(0)
    .second(0)
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  const currentMonthEndDate = moment()
    .endOf("month")
    .hour(21)
    .minute(0)
    .second(0)
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  let rankingData = {};
  let featuredUser = {};
  let isUserRanking = false;
  let ranking = [];

  const session = await getSession({ req });

  try {
    rankingData = await getRankingByGameId(
      req,
      id,
      currentMonthStartDate,
      currentMonthEndDate
    );
    rankingData = rankingData?.data || [];
  } catch (error) {
    console.log(error);
  }

  if (session && session.user) {
    try {
      const userRankData = await getUserRankingByGameId(
        session.user.email,
        id,
        currentMonthStartDate,
        currentMonthEndDate,
        req
      );
      if (userRankData?.data?.[0]) {
        featuredUser = userRankData.data[0];
      } else {
        featuredUser = {
          user: { name: session.user.name, _id: 0 },
          rank: 0,
          featured: true,
          totalMatches: 0,
          totalTickets: 0,
        };

        if (session.user && session.user.image) {
          featuredUser.user.photo = session.user.image;
        }
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
    },
  };
}
