import RankingListItem from "@components/Ranking/RankingListItem";
import Fireworks from "@fireworks-js/react";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { winnersGeneral } from "@utils/constants";
import Image from "next/legacy/image";
import React from "react";

const ModalWinner = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // const winnersLavaRush = [
  //   {
  //     matches: 136,
  //     tickets: 11608,
  //     position: 1,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocLRXjWlEnJ-pc1k1jv2KnibqdGPB0vr_pwqSPAUQ6x70Xsrdk9Ylw=s96-c",
  //     userId: "",
  //     nickname: "Muulinha",
  //   },
  //   {
  //     matches: 20,
  //     tickets: 1200,
  //     position: 2,
  //     photo: "",
  //     userId: "",
  //     nickname: "diogogarces87",
  //   },
  //   {
  //     matches: 9,
  //     tickets: 643,
  //     position: 3,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocKiDDD4wcFX1IWS1RCHjkCRxQV-Ql11x3J_V2h5lYiqfzLJlejE=s96-c",
  //     userId: "",
  //     nickname: "robmaster19",
  //   },
  // ];

  // const winnersTheRunner = [
  //   {
  //     matches: 146,
  //     tickets: 14042,
  //     position: 1,
  //     photo: "",
  //     userId: "",
  //     nickname: "Neyruto",
  //   },
  //   {
  //     matches: 130,
  //     tickets: 10703,
  //     position: 2,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocJcNkgWTYfw_XTqFVd8ErEC_8HEWEPGf7TuHotX-AXyYDt1bnw=s96-c",
  //     userId: "",
  //     nickname: "Thay",
  //   },
  //   {
  //     matches: 28,
  //     tickets: 2519,
  //     position: 3,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocKlcZiuT4NXxp1bHoH1uKFVgV8GBo4iNEfn_2of-890w3Eim3HiXA=s96-c",
  //     userId: "",
  //     nickname: "Jean",
  //   },
  // ];

  // const winnersDayOne = [
  //   {
  //     matches: 19,
  //     tickets: 1077,
  //     position: 1,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocKlcZiuT4NXxp1bHoH1uKFVgV8GBo4iNEfn_2of-890w3Eim3HiXA=s96-c",
  //     userId: "",
  //     nickname: "Jean",
  //   },
  //   {
  //     matches: 130,
  //     tickets: 444,
  //     position: 2,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocLRXjWlEnJ-pc1k1jv2KnibqdGPB0vr_pwqSPAUQ6x70Xsrdk9Ylw=s96-c",
  //     userId: "",
  //     nickname: "Muulinha",
  //   },
  //   {
  //     matches: 8,
  //     tickets: 386,
  //     position: 3,
  //     photo:
  //       "https://lh3.googleusercontent.com/a/ACg8ocKiDDD4wcFX1IWS1RCHjkCRxQV-Ql11x3J_V2h5lYiqfzLJlejE=s96-c",
  //     userId: "",
  //     nickname: "Robmaster19",
  //   },
  // ];

  return (
    <>
      <div className="fixed h-full inset-0 items-center justify-center  z-[60]">
        <div className="text-white p-6">
          <h1 className="text-2xl font-bold mb-4">👑 &nbsp; Torneio</h1>
          <p>Veja as pessoas que ganharam!</p>
        </div>
        <div className="flex justify-center w-screen">
          <Image
            src="/imgs/winner.png"
            width={626 / 4}
            height={568 / 4}
            alt="winner"
          />
        </div>
        <div className="mx-4 rounded-2xl">
          {winnersGeneral &&
            winnersGeneral.map(
              ({ matches, tickets, position, photo, userId, nickname }) => (
                <RankingListItem
                  key={userId}
                  avatarSrc={photo}
                  name={nickname}
                  matches={matches}
                  tickets={tickets}
                  position={position}
                  useMedal={true}
                />
              )
            )}

          {/* <Tabs
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
            <Tab key={1} title={"Geral"}>
              {winnersGeneral &&
                winnersGeneral.map(
                  ({ matches, tickets, position, photo, userId, nickname }) => (
                    <RankingListItem
                      key={userId}
                      avatarSrc={photo}
                      name={nickname}
                      matches={matches}
                      tickets={tickets}
                      position={position}
                      useMedal={true}
                    />
                  )
                )}
            </Tab>
            <Tab key={2} title={"Lava Rush"}>
              {winnersLavaRush &&
                winnersLavaRush.map(
                  ({ matches, tickets, position, photo, userId, nickname }) => (
                    <RankingListItem
                      key={userId}
                      avatarSrc={photo}
                      name={nickname}
                      matches={matches}
                      tickets={tickets}
                      position={position}
                      useMedal={true}
                    />
                  )
                )}
            </Tab>
            <Tab key={3} title={"The Runner"}>
              {winnersTheRunner &&
                winnersTheRunner.map(
                  ({ matches, tickets, position, photo, userId, nickname }) => (
                    <RankingListItem
                      key={userId}
                      avatarSrc={photo}
                      name={nickname}
                      matches={matches}
                      tickets={tickets}
                      position={position}
                      useMedal={true}
                    />
                  )
                )}
            </Tab>
            <Tab key={4} title={"Day One"}>
              {winnersDayOne &&
                winnersDayOne.map(
                  ({ matches, tickets, position, photo, userId, nickname }) => (
                    <RankingListItem
                      key={userId}
                      avatarSrc={photo}
                      name={nickname}
                      matches={matches}
                      tickets={tickets}
                      position={position}
                      useMedal={true}
                    />
                  )
                )}
            </Tab>
          </Tabs> */}
        </div>
        <div className="m-4 mt-5">
          <p>
            <b>Se você não ganhou, não desista!</b>
          </p>
          <p className="mb-10 text-gray-300">
            Continue jogando e em breve teremos uma nova competição, com mais
            prêmos e novos jogos.
          </p>
        </div>

        <div className="absolute bottom-4 left-0 w-screen p-4">
          <Button
            type="submit"
            //color="secondary"
            className="bg-secondary hover:bg-opacity-80 focus-visible:outline-secondary"
            size="lg"
            fullWidth
            onPress={onClose}
          >
            VOLTAR
          </Button>
        </div>
      </div>
      <div className="fixed h-full inset-0 items-center justify-center bg-[#271C57] z-[51] opacity-95" />
      <div className="z-[52]">
        <Fireworks
          options={{ opacity: 0.5 }}
          style={{
            color: "#6D49FF",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
          }}
        />
      </div>
    </>
  );
};

export default ModalWinner;
