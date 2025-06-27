"use client";

import request from "@utils/api";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { games } from "@utils/data";
import { useSession } from "next-auth/react";
import moment from "moment";
import RankingListItem from "./RankingListItem";

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

/**
 * Fetches the ranking data from the server.
 *
 * @param {Object} req - The request object.
 * @param {string} gameId - The ID of the game.
 * @param {string} startDate - The start date for the ranking period.
 * @param {string} endDate - The end date for the ranking period.
 * @returns {Promise<Object|null>} The ranking data or null if an error occurs.
 */
async function getRankingByGameId(gameId, startDate, endDate) {
  try {
    const data = await request(
      "/games/ranking",
      "GET",
      null,
      { gameId, startDate, endDate },
      true
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
async function getUserRankingByGameId(email, gameId, startDate, endDate) {
  try {
    const data = await request(
      `/games/ranking/${email}`,
      "GET",
      null,
      { gameId, startDate, endDate },
      true
    );
    return data;
  } catch (error) {
    return null;
  }
}

function RankingByGame({ game }) {
  const { data: session } = useSession();
  const [ranking, setRanking] = useState([]);
  const [featuredUser, setFeaturedUser] = useState(null);
  const [isUserRanking, setIsUserRanking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = session?.user;

  useEffect(() => {
    Promise.all([
      getRankingByGameId(game.id, currentMonthStartDate, currentMonthEndDate),
      getUserRankingByGameId(
        user.email,
        game.id,
        currentMonthStartDate,
        currentMonthEndDate
      ),
    ])
      .then(([rankingResponse, userRankingResponse]) => {
        setIsLoading(false);

        // Handle user ranking data
        let newfeaturedUser = {};
        if (userRankingResponse.data?.[0]) {
          newfeaturedUser = userRankingResponse.data[0];
        } else {
          newfeaturedUser = {
            user: { name: session.user.name, _id: 0 },
            rank: 0,
            featured: true,
            totalMatches: 0,
            totalTickets: 0,
          };
          if (session.user && session.user.image) {
            newfeaturedUser.user.photo = session.user.image;
          }
        }

        // Handle ranking data
        let newRanking = (rankingResponse.data || []).map((rank) => {
          if (rank.user._id === newfeaturedUser.user._id) {
            setIsUserRanking(true);
            return { ...rank, featured: true };
          }
          return { ...rank, featured: false };
        });
        setRanking(newRanking || []);

        setFeaturedUser(newfeaturedUser);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ranking data:", error);
        // Handle the error appropriately
      });
  }, [game]);

  if (isLoading) {
    return <p>...</p>;
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col justify-start items-start mt-4 ml-6">
        <p className="text-white text-2xl font-bold">Ranking do {game.title}</p>
        <p className="mb-2 text-sm text-gray-400 mt-4">
          🏆 Confira quem está dominando!
        </p>
      </div>
      <div className="overflow-hidden mt-4">
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
            useMedal={true}
          />
        )}
      </div>
    </div>
  );
}

export default function RankingByGames({
  rankingGeneral,
  featuredUserGeneral,
  isUserRankingGeneral,
}) {
  return (
    <div className="flex w-full flex-col p-4">
      <Tabs
        aria-label="Ranking por Game"
        fullWidth
        color={"primary"}
        size="md"
        radius="full"
        variant="bordered"
        classNames={{
          tabContent: "bg-opacity-90",
          tabList: "bg-opacity-90",
        }}
      >
        <Tab key={5} title={"Geral"}>
          <div className="flex flex-col justify-start items-start mt-4 ml-6">
            <p className="text-white text-2xl font-bold">Ranking Geral</p>
            <p className="mb-4 text-sm text-gray-400 mt-4">
              🏆 Confira quem está dominando!
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl ">
            {rankingGeneral &&
              rankingGeneral.map(
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

            {!isUserRankingGeneral && featuredUserGeneral && (
              <RankingListItem
                featured={true}
                avatarSrc={featuredUserGeneral?.user?.photo}
                name={
                  featuredUserGeneral?.user?.nickname ||
                  featuredUserGeneral?.user?.name
                }
                matches={featuredUserGeneral?.totalMatches}
                tickets={featuredUserGeneral?.totalTickets}
                position={featuredUserGeneral?.rank}
                useMedal={true}
              />
            )}
          </div>
        </Tab>
        {games
          .filter((game) => game.displayMainRanking === true)
          .map((game) => (
            <Tab key={game.id} title={game.title}>
              <RankingByGame game={game} />
            </Tab>
          ))}
      </Tabs>
    </div>
  );
}
