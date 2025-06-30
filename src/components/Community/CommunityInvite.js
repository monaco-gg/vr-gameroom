// components/Community/CommunityInvite.js
import React, { useState, useEffect } from "react";
import { Card, Button, Input, Spinner, Badge } from "@nextui-org/react";
import {
  ShareIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import request from "@utils/api";

const CommunityInvite = ({ community }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteExpiry, setInviteExpiry] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingInvites, setCheckingInvites] = useState(true);
  const [shareCount, setShareCount] = useState(0); // Contador local de compartilhamentos desta sessão

  // Buscar convites ativos ao carregar o componente
  useEffect(() => {
    const fetchActiveInvitation = async () => {
      if (!community) return;

      try {
        setCheckingInvites(true);

        // Buscar convite ativo do servidor
        const response = await request("/communities", "POST", {
          action: "invite",
        });

        if (response.success) {
          setInviteCode(response.data.code);
          setInviteLink(response.data.whatsappLink);
          setInviteExpiry(new Date(response.data.expiresAt));
          setUsageCount(response.data.usageCount || 0);

          // Salvar convite no localStorage para referência
          localStorage.setItem(
            `communityInvite_${community._id}`,
            JSON.stringify({
              code: response.data.code,
              whatsappLink: response.data.whatsappLink,
              expiresAt: response.data.expiresAt,
              usageCount: response.data.usageCount || 0,
            })
          );
        }
      } catch (error) {
        console.error("Erro ao buscar convites ativos:", error);

        // Tentar usar dados do localStorage como fallback
        const storedInvite = localStorage.getItem(
          `communityInvite_${community._id}`
        );

        if (storedInvite) {
          const invite = JSON.parse(storedInvite);
          const now = new Date();
          const expiryDate = new Date(invite.expiresAt);

          // Verificar se o convite ainda é válido
          if (now < expiryDate) {
            setInviteCode(invite.code);
            setInviteLink(invite.whatsappLink);
            setInviteExpiry(expiryDate);
            setUsageCount(invite.usageCount || 0);
          } else {
            // Remover convite expirado
            localStorage.removeItem(`communityInvite_${community._id}`);
          }
        }
      } finally {
        setCheckingInvites(false);
      }
    };

    fetchActiveInvitation();

    // Atualizar o timer a cada minuto
    const timer = setInterval(() => {
      if (inviteExpiry) {
        const now = new Date();
        if (now > inviteExpiry) {
          // Convite expirou, remover dados
          setInviteCode("");
          setInviteLink("");
          setInviteExpiry(null);
          setUsageCount(0);
          localStorage.removeItem(`communityInvite_${community?._id}`);
        }
      }
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(timer);
  }, [community]);

  const formatExpiryTime = () => {
    if (!inviteExpiry) return "";

    const now = new Date();
    const diff = inviteExpiry.getTime() - now.getTime();

    // Se expirado, não mostrar contador
    if (diff <= 0) return "Expirado";

    // Converter para horas e minutos
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `Expira em ${hours}h ${minutes}m`;
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência!");
    }
  };

  const handleShareWhatsApp = () => {
    if (inviteLink) {
      // Incrementar contador de compartilhamentos local (apenas para feedback visual)
      setShareCount(shareCount + 1);

      // Abrir WhatsApp
      window.open(inviteLink, "_blank");
    } else {
      toast.error("Gere um convite primeiro");
    }
  };

  const handleGenerateInvite = async () => {
    try {
      setLoading(true);

      const response = await request("/communities", "POST", {
        action: "invite",
      });

      if (response.success) {
        setInviteLink(response.data.whatsappLink);
        setInviteCode(response.data.code);
        setInviteExpiry(new Date(response.data.expiresAt));
        setUsageCount(response.data.usageCount || 0);
        setShareCount(0); // Resetar contador de compartilhamentos local

        // Salvar convite no localStorage para persistir entre sessões
        localStorage.setItem(
          `communityInvite_${community._id}`,
          JSON.stringify({
            code: response.data.code,
            whatsappLink: response.data.whatsappLink,
            expiresAt: response.data.expiresAt,
            usageCount: response.data.usageCount || 0,
          })
        );

        toast.success(response.message || "Convite obtido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      if (
        error.data?.message ===
        "A comunidade atingiu o limite máximo de membros"
      ) {
        toast.error("Sua comunidade já atingiu o limite de 10 membros.");
      } else {
        toast.error(
          error.data?.message || "Erro ao gerar convite. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingInvites) {
    return (
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-bold mb-3">Convidar Amigos</h3>
        <div className="flex justify-center p-4">
          <Spinner size="sm" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-bold mb-3">Convidar Amigos</h3>

      <p className="text-sm text-gray-500 mb-4">
        Convide seus amigos para se juntarem à sua comunidade e competirem no
        ranking!
      </p>

      {inviteCode ? (
        <>
          <div className="flex mb-2">
            <Input
              value={inviteCode}
              label="Código de convite"
              readOnly
              className="flex-grow"
            />
            <Button
              isIconOnly
              //color="primary"
              variant="flat"
              onPress={handleCopyCode}
              className="ml-2 h-14 bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-between mb-4 text-xs text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{formatExpiryTime()}</span>
            </div>

            {/* <div className="flex items-center">
              <UsersIcon className="w-4 h-4 mr-1" />
              <span>
                {usageCount} pessoa(s) já entrou/entraram com este convite
              </span>
            </div> */}
          </div>

          <Button
            //color="success"
            variant="flat"
            startContent={<ShareIcon className="w-5 h-5" />}
            onPress={handleShareWhatsApp}
            className="w-full rounded-full mb-3 bg-success hover:bg-opacity-80 focus-visible:outline-success"
          >
            Compartilhar no WhatsApp {shareCount > 0 ? `(${shareCount})` : ""}
          </Button>

          <p className="text-xs text-gray-500 mb-3 text-center">
            Este convite pode ser usado múltiplas vezes até expirar.
          </p>
        </>
      ) : (
        <>
          <Button
            //color="primary"
            variant="solid"
            onPress={handleGenerateInvite}
            isLoading={loading}
            className="w-full rounded-full bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
          >
            {loading ? <Spinner size="sm" color="white" /> : "Obter Convite"}
          </Button>

          <p className="text-xs text-gray-400 mt-2">
            O convite será válido por 48 horas e poderá ser usado múltiplas
            vezes.
          </p>
        </>
      )}
    </Card>
  );
};

export default CommunityInvite;
