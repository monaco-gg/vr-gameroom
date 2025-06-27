import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import request from "@utils/api";
import { Card, Button, Spinner } from "@nextui-org/react";
import { toast } from "react-toastify";
import RoomLayout from "@components/Layout/RoomLayout";

export default function JoinCommunityPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [invitationDetails, setInvitationDetails] = useState(null);
  const [userCommunity, setUserCommunity] = useState(null);

  const { code } = router.query;

  // Verificar se o usuário já está em uma comunidade e se o código de convite é válido
  useEffect(() => {
    const checkUserAndInvitation = async () => {
      if (!code) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Verificar se o usuário já está em uma comunidade
        try {
          const communityResponse = await request("/communities");
          if (communityResponse.success) {
            setUserCommunity(communityResponse.data);
          }
        } catch (err) {
          // Se receber 404, significa que o usuário não tem comunidade, o que é bom
          if (err.data?.status !== 404 && err.status !== 404) {
            console.error("Erro ao verificar comunidade do usuário:", err);
          }
        }

        // Idealmente, você teria um endpoint para validar o convite sem usá-lo
        // Por enquanto, vamos apenas considerar que o código existe
        setInvitationDetails({
          communityName: "Comunidade Game Room", // Idealmente, isso viria do backend
        });

        setLoading(false);
      } catch (err) {
        console.error("Erro ao validar convite:", err);
        setError("Código de convite inválido ou expirado");
        setLoading(false);
      }
    };

    if (status === "authenticated" && code) {
      checkUserAndInvitation();
    } else if (status === "unauthenticated") {
      // Se não estiver autenticado, redirecione para login
      router.push(`/auth/sign-in?redirect=/room/community/join?code=${code}`);
    }
  }, [code, status, router]);

  const handleJoinCommunity = async () => {
    if (!code) return;

    setJoining(true);
    try {
      // Enviar o código como parâmetro de consulta
      const response = await request(
        `/communities?code=${encodeURIComponent(code.toString())}`,
        "POST",
        { action: "join" }
      );

      if (response.success) {
        toast.success("Você entrou na comunidade com sucesso!");
        router.push("/room/community");
      }
    } catch (error) {
      console.error("Erro ao entrar na comunidade:", error);

      if (error.data?.message === "Usuário já está em uma comunidade") {
        setError(
          "Você já está em uma comunidade. Para entrar nesta, você precisa sair da sua comunidade atual primeiro."
        );
      } else if (
        error.data?.message === "Código de convite inválido ou expirado"
      ) {
        setError("Este convite é inválido ou já expirou.");
      } else if (
        error.data?.message ===
        "A comunidade atingiu o limite máximo de membros"
      ) {
        setError("Esta comunidade já atingiu o limite de 10 membros.");
      } else {
        setError(
          error.data?.message ||
            "Ocorreu um erro ao tentar entrar na comunidade."
        );
      }
    } finally {
      setJoining(false);
    }
  };

  const handleGoToCurrentCommunity = () => {
    router.push("/room/community");
  };

  const handleLeaveCommunityAndJoin = async () => {
    if (!code) return;

    setJoining(true);
    try {
      // Primeiro, sair da comunidade atual
      await request("/communities", "POST", { action: "leave" });

      // Depois, entrar na nova comunidade
      const response = await request(
        `/communities?code=${encodeURIComponent(code.toString())}`,
        "POST",
        { action: "join" }
      );

      if (response.success) {
        toast.success("Você entrou na nova comunidade com sucesso!");
        router.push("/room/community");
      }
    } catch (error) {
      console.error("Erro ao trocar de comunidade:", error);
      setError(
        error.data?.message || "Ocorreu um erro ao tentar trocar de comunidade."
      );
    } finally {
      setJoining(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <RoomLayout
        title="Entrar na Comunidade"
        session={session}
        widthHeader={false}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </RoomLayout>
    );
  }

  return (
    <RoomLayout
      title="Entrar na Comunidade"
      session={session}
      widthHeader={false}
    >
      <div className="p-6">
        <Card className="max-w-md mx-auto p-6 text-center">
          {error ? (
            <>
              <div className="text-danger mb-4 text-xl">{error}</div>

              {error.includes("já está em uma comunidade") ? (
                <>
                  <p className="mb-6">
                    Você já participa de uma comunidade. Para entrar nesta nova
                    comunidade, você precisará sair da sua comunidade atual.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      color="primary"
                      onPress={handleLeaveCommunityAndJoin}
                      isLoading={joining}
                      className="w-full rounded-full"
                    >
                      {joining ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Sair da atual e entrar nesta"
                      )}
                    </Button>
                    <Button
                      variant="flat"
                      onPress={handleGoToCurrentCommunity}
                      className="rounded-full"
                    >
                      Manter comunidade atual
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-6">
                    {error.includes("limite máximo")
                      ? "Esta comunidade já está cheia."
                      : "O convite pode ter expirado ou ser inválido."}
                  </p>
                  <Button
                    color="primary"
                    onPress={() => router.push("/room/community")}
                    className="w-full rounded-full"
                  >
                    Ir para Comunidades
                  </Button>
                </>
              )}
            </>
          ) : userCommunity ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                Convite para Comunidade
              </h1>
              <p className="mb-6">
                Você já participa da comunidade{" "}
                <strong>{userCommunity.name}</strong>. Para entrar nesta nova
                comunidade, você precisará sair da sua comunidade atual.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  color="primary"
                  onPress={handleLeaveCommunityAndJoin}
                  isLoading={joining}
                  className="w-full rounded-full"
                >
                  {joining ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Sair da atual e entrar nesta"
                  )}
                </Button>
                <Button
                  variant="flat"
                  onPress={handleGoToCurrentCommunity}
                  className="rounded-full"
                >
                  Manter comunidade atual
                </Button>
              </div>
            </>
          ) : invitationDetails ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                Convite para Comunidade
              </h1>
              <p className="mb-6">
                Você foi convidado para participar da comunidade. Junte-se para
                competir no ranking com outros jogadores!
              </p>
              <Button
                color="primary"
                isLoading={joining}
                onPress={handleJoinCommunity}
                className="w-full mb-4 rounded-full"
              >
                {joining ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Aceitar Convite"
                )}
              </Button>
              <Button
                variant="flat"
                onPress={() => router.push("/room/community")}
                className="rounded-full"
              >
                Voltar
              </Button>
            </>
          ) : null}
        </Card>
      </div>
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
