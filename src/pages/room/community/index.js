import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import request from "@utils/api";
import { Button, Card, Spinner } from "@nextui-org/react";
import RoomLayout from "@components/Layout/RoomLayout";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";

// Componentes da comunidade
import CommunityDetails from "@components/Community/CommunityDetails";
import CommunityInvite from "@components/Community/CommunityInvite";
import CommunityRanking from "@components/Community/CommunityRanking";
import NoCommunitySplash from "@components/Community/NoCommunitySplash";
import JoinCommunityModal from "@components/Community/JoinCommunityModal";

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchCommunity = async () => {
    try {
      setLoading(true);

      const response = await request("/communities");

      if (response.success) {
        setCommunity(response.data);

        // Armazenar o email do usuário para uso no componente de ranking
        if (session && session.user) {
          localStorage.setItem("userEmail", session.user.email);
        }
      } else {
        setCommunity(null);
      }
    } catch (error) {
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCommunity();
    } else if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  const handleCreateCommunity = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await request("/communities", "POST", {
        action: "create",
      });

      if (response.success) {
        setCommunity(response.data);
        toast.success("Comunidade criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar comunidade:", error);
      setError("Erro ao criar comunidade. Tente novamente.");
      toast.error(
        error.data?.message || "Erro ao criar comunidade. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (code) => {
    if (!code?.trim()) {
      toast.error("Código de convite inválido");
      return;
    }

    try {
      setLoading(true);

      // Enviar o código como parâmetro de consulta
      const response = await request(
        `/communities?code=${encodeURIComponent(code.trim())}`,
        "POST",
        { action: "join" }
      );

      if (response.success) {
        setCommunity(response.data);
        setJoinModalOpen(false);
        toast.success("Você entrou na comunidade com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao entrar na comunidade:", error);
      let errorMessage = "Erro ao entrar na comunidade. Tente novamente.";

      if (error.data?.message) {
        errorMessage = error.data.message;
      }

      if (error.data?.message === "Usuário já está em uma comunidade") {
        toast.error("Você já está em uma comunidade.");
      } else if (
        error.data?.message === "Código de convite inválido ou expirado"
      ) {
        toast.error("Código de convite inválido ou expirado.");
      } else if (
        error.data?.message ===
        "A comunidade atingiu o limite máximo de membros"
      ) {
        toast.error("Esta comunidade já atingiu o limite de 10 membros.");
      } else {
        toast.error(errorMessage);
      }

      throw error; // Propagar o erro para que o modal possa mostrar a mensagem
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja sair da comunidade? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        setLoading(true);

        const response = await request("/communities", "POST", {
          action: "leave",
        });

        if (response.success) {
          // Limpar os dados de convite no localStorage ao sair da comunidade
          if (community) {
            localStorage.removeItem(`communityInvite_${community._id}`);
          }

          setCommunity(null);
          toast.success("Você saiu da comunidade com sucesso.");
        }
      } catch (error) {
        console.error("Erro ao sair da comunidade:", error);
        toast.error(
          error.data?.message || "Erro ao sair da comunidade. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchCommunity();
  };

  if (status === "loading" || loading) {
    return (
      <RoomLayout title="Comunidade" session={session} widthHeader={true}>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </RoomLayout>
    );
  }

  return (
    <RoomLayout title="Comunidade" session={session} widthHeader={true}>
      <div className="p-6">
        <div className="flex flex-col items-start">
          <h4 className="font-inter text-3xl mb-2">Comunidade</h4>
          <p className="font-inter text-medium text-gray-400 mb-6">
            Participe de uma comunidade com até 10 pessoas e compita no ranking
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-4 bg-danger-50">
            <p className="text-danger">{error}</p>
            <Button
              //color="primary"
              variant="flat"
              onPress={handleRefresh}
              className="mt-2 rounded-full bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
              size="sm"
            >
              Tentar novamente
            </Button>
          </Card>
        )}

        {community ? (
          <div className="grid grid-cols-1 gap-6">
            <CommunityDetails
              community={community}
              onLeaveCommunity={handleLeaveCommunity}
            />

            <CommunityInvite community={community} />

            {/* Componente de Ranking da Comunidade */}
            <CommunityRanking community={community} />
          </div>
        ) : (
          <NoCommunitySplash
            onCreateCommunity={handleCreateCommunity}
            onOpenJoinModal={() => setJoinModalOpen(true)}
          />
        )}
      </div>

      <JoinCommunityModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleJoinCommunity}
      />
    </RoomLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
