import CoinsAvailable from "@components/CoinsAvailable";
import RoomLayout from "@components/Layout/RoomLayout";
import TicketsAvailable from "@components/TicketsAvailable";
import { GlobalContext } from "@contexts/GlobalContext";
import { useFormValidation } from "@hooks/useFormValidation";
import { Button, Divider, Input, Switch, cn } from "@nextui-org/react";
import request from "@utils/api";
import { requestForToken } from "@utils/firebase";
import { getSession, signOut, useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useContext, useState } from "react";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Profile({
  nicknameProp,
  dateOfBirthProp,
  phoneNumberProp,
  enableNotificationsProp,
}) {
  const { data: session } = useSession();
  const { globalState } = useContext(GlobalContext);
  const router = useRouter();
  const { fields, errors, handleInputChange, handleBlur } = useFormValidation({
    nickname: nicknameProp,
    dateOfBirth: dateOfBirthProp,
    phoneNumber: phoneNumberProp,
  });

  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    enableNotificationsProp
  );

  const handleShare = () => {
    const text = "Transforme vitórias virtuais em conquistas de verdade!";
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text
    )} ${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in?referralCode=${
      globalState.user.referralCode
    }`;

    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { nickname, dateOfBirth, phoneNumber } = errors;

    if (nickname || dateOfBirth || phoneNumber) {
      toast("Corrija os campos inválidos antes de cadastrar", {
        type: "error",
      });
      return;
    }
    setLoading(true);
    if (session) {
      const email = session.user.email;

      try {
        await request(`/users`, "PATCH", {
          email,
          dateOfBirth: fields.dateOfBirth,
          phone: fields.phoneNumber,
          nickname: fields.nickname,
        });

        toast("Perfil atualizado com sucesso!", { type: "success" });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao atualizar o perfil", error);
        toast("Falha ao atualizar o perfil", { type: "error" });
        setLoading(false);
      }
    }
  };

  const handleNotificationChange = async (value) => {
    setNotificationsEnabled(value);
    if (value) {
      try {
        requestForToken();
        await request(`/users/tokens`, "PATCH", {
          enableNotifications: true,
        });
      } catch (error) {
        console.error("Erro ao solicitar permissão de notificação", error);
        toast("Falha ao habilitar notificações", { type: "error" });
        setNotificationsEnabled(false);
      }
    } else {
      try {
        await request(`/users/tokens`, "PATCH", {
          enableNotifications: false,
        });
      } catch (error) {
        console.error("Erro ao desabilitar notificações", error);
        toast("Falha ao desabilitar notificações", { type: "error" });
        setNotificationsEnabled(true);
      }
    }
  };

  const handleMyOrdersClick = () => {
    router.push("/room/profile/orders");
  };

  return (
    <RoomLayout title="Configurações" session={session} widthHeader={false}>
      <div className="p-6">
        <div className="flex flex-col items-start">
          <h4 className="font-inter text-3xl mb-2">Perfil</h4>
          <p className="font-inter text-medium text-gray-400 mb-10">
            Edite as informações do seu perfil
          </p>
        </div>
        {session && session.user && globalState.user && (
          <div className="flex flex-col items-center">
            {session.user.image && (
              <div
                onClick={() => {
                  handleLogEvent("profile_footer_room_clicked");
                  router.push("/room/profile");
                }}
                className={`cursor-pointer mt-1 p-0 rounded-full ring-2 w-[100px] h-[100px] ring-[#6D49FF]`}
              >
                <Image
                  width={100}
                  height={100}
                  src={session.user.image}
                  alt="Avatar do Usuário"
                  className="w-24 h-24 rounded-full object-cover"
                  priority
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>
            )}
            <div className="flex w-full justify-between mb-8">
              <div className="flex flex-col items-start">
                <span className="text-left text-medium text-gray-400">
                  Tickets
                </span>
                <div className="flex items-center mt-2">
                  <TicketsAvailable
                    amountTickets={globalState?.ticket?.totalTickets}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-left text-medium text-gray-400">
                  Fichas
                </span>
                <div className="flex items-center mt-2 text-yellow-400">
                  <CoinsAvailable
                    amountCoins={globalState?.user?.coinsAvailable}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="shadow sm:rounded-lg">
          <div className="mb-4">
            <span className="text-left text-medium text-gray-400">
              Meus dados
            </span>
          </div>
          <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
            <div>
              <Input
                type="text"
                label="Nickname"
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                onBlur={() => handleBlur("nickname")}
                maxLength={24}
                value={fields.nickname}
                isInvalid={!!errors.nickname}
                errorMessage={errors.nickname}
              />
            </div>

            <div className="relative shadow-sm">
              <InputMask
                mask="99/99/9999"
                value={fields.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                onBlur={() => handleBlur("dateOfBirth")}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    type="tel"
                    label="Data de Nascimento"
                    isInvalid={!!errors.dateOfBirth}
                    errorMessage={errors.dateOfBirth}
                  />
                )}
              </InputMask>
            </div>

            <div className="relative shadow-sm">
              <InputMask
                mask="(99) 99999-9999"
                value={fields.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                onBlur={() => handleBlur("phoneNumber")}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    type="tel"
                    label="Telefone"
                    isInvalid={!!errors.phoneNumber}
                    errorMessage={errors.phoneNumber}
                  />
                )}
              </InputMask>
            </div>

            {session && session.user && session.user.email && (
              <div className="relative shadow-sm">
                <Input
                  type="text"
                  label="Email"
                  value={session.user.email}
                  isDisabled
                />
              </div>
            )}

            <Switch
              isSelected={notificationsEnabled}
              onValueChange={handleNotificationChange}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-screen-2xl bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                  "w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ml-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4"
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">Permitir notificações</p>
                <p className="text-tiny text-default-400">
                  Fique por dentro de todas as novidades!
                </p>
              </div>
            </Switch>

            <div className="flex mt-16">
              <Button
                className="text-white rounded-full"
                color="primary"
                variant="flat"
                onClick={handleMyOrdersClick}
                onPress={handleMyOrdersClick}
                fullWidth
              >
                Meus Pedidos
              </Button>
            </div>
            <div className="flex mt-8">
              <Button
                className="text-white rounded-full"
                color="success"
                onClick={handleShare}
                onPress={handleShare}
                fullWidth
              >
                Convidar
              </Button>
            </div>
            <div className="flex mt-8">
              <Button
                type="submit"
                color="primary"
                className="rounded-full"
                fullWidth
                isLoading={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
          <div className="flex mt-5 ml-10 mr-10">
            <Divider />
          </div>
          <div className="flex mt-5 mb-15">
            <Button
              color="danger"
              variant="bordered"
              fullWidth
              onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
              onPress={() => signOut({ callbackUrl: "/auth/sign-in" })}
              className="rounded-full"
            >
              Sair da conta
            </Button>
          </div>
          <div className="flex justify-center mt-8">
            <>
              <span className="text-small">Precisa de Ajuda?</span>
              <a
                href="https://wa.me/551151964630"
                target="_blank"
                className="bold text-primary text-small ml-2"
              >
                Entre em contato
              </a>
            </>
          </div>
        </div>
      </div>
    </RoomLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req } = context;

  try {
    const personalInfo = await request(
      "/users",
      "GET",
      null,
      {
        email: session.user.email,
      },
      true,
      req
    );
    return {
      props: {
        nicknameProp: personalInfo.nickname || "",
        dateOfBirthProp: personalInfo.dateOfBirth || "",
        phoneNumberProp: personalInfo.phone || "",
        enableNotificationsProp: personalInfo.enableNotifications || false,
      },
    };
  } catch (error) {
    return {
      props: {
        nicknameProp: "",
        dateOfBirthProp: "",
        phoneNumberProp: "",
        enableNotificationsProp: false,
      },
    };
  }
}
