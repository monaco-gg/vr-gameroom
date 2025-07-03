import React, { useEffect, useState } from "react";
import { Card, Chip, Spinner, Tabs, Tab } from "@nextui-org/react";
import { TrophyIcon } from "@heroicons/react/24/solid";
import request from "@utils/api";
import moment from "moment";
import RankingListItem from "@components/Ranking/RankingListItem";

const CommunityRanking = ({ community }) => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [communityInfo, setCommunityInfo] = useState(null);
  const [timeRange, setTimeRange] = useState("month"); // 'week', 'month', 'all'

  useEffect(() => {
    fetchRankingData();
  }, [community, timeRange]);

  const fetchRankingData = async () => {
    if (!community) return;

    try {
      setLoading(true);
      setError(null);

      // Definir período de tempo para a consulta
      let startDate, endDate;
      const now = moment();

      if (timeRange === "week") {
        startDate = now
          .clone()
          .startOf("week")
          .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        endDate = now.clone().endOf("week").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      } else if (timeRange === "month") {
        startDate = now
          .clone()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        endDate = now.clone().endOf("month").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      } // Para 'all', não definimos startDate/endDate

      // Construir parâmetros de consulta
      const queryParams = {};
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;

      // Fazer a requisição ao endpoint de ranking da comunidade
      const response = await request(
        "/communities/ranking",
        "GET",
        null,
        queryParams
      );

      if (response.success) {
        setRankingData(response.data || []);
        setCommunityInfo(response.community);

        // Encontrar o usuário atual no ranking
        const email = localStorage.getItem("userEmail");
        if (email) {
          const user = response.data.find((item) => item.user.email === email);
          if (user) {
            setCurrentUser(user);
          }
        }
      } else {
        setError("Não foi possível carregar o ranking da comunidade");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do ranking:", error);
      setError("Erro ao carregar o ranking. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (key) => {
    setTimeRange(key);
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center p-6">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-danger text-center p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrophyIcon className="w-6 h-6 text-warning mr-2" />
          <h2 className="text-xl font-bold">Ranking da Comunidade</h2>
        </div>
      </div>

      <Tabs
        selectedKey={timeRange}
        onSelectionChange={handleTimeRangeChange}
        className="mb-4"
        variant="underlined"
        size="sm"
      >
        <Tab key="week" title="Semana" />
        <Tab key="month" title="Mês" />
        <Tab key="all" title="Total" />
      </Tabs>

      <div className="space-y-1">
        {rankingData.length > 0 ? (
          rankingData.map((item) => (
            <RankingListItem
              key={item.user._id}
              featured={currentUser && currentUser.user._id === item.user._id}
              avatarSrc={item.user.photo}
              name={item.user.nickname || item.user.name}
              matches={item.totalMatches}
              tickets={item.totalTickets}
              position={item.rank}
              useMedal={true}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nenhum membro da comunidade jogou durante este período.</p>
            <p className="text-sm mt-2">
              Convide seus amigos para jogar e competir!
            </p>
          </div>
        )}

        {/* Mostrar usuário atual se não estiver nos 10 primeiros */}
        {currentUser &&
          !rankingData.some(
            (item) => item.user._id === currentUser.user._id
          ) && (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <RankingListItem
                featured={true}
                avatarSrc={currentUser.user.photo}
                name={currentUser.user.nickname || currentUser.user.name}
                matches={currentUser.totalMatches}
                tickets={currentUser.totalTickets}
                position={currentUser.rank}
                useMedal={false}
              />
            </>
          )}
      </div>

      <div className="text-xs text-gray-400 mt-4 text-center">
        {timeRange === "week" && "Ranking semanal da comunidade"}
        {timeRange === "month" && "Ranking mensal da comunidade"}
        {timeRange === "all" && "Ranking total da comunidade"}
      </div>
    </Card>
  );
};

export default CommunityRanking;
