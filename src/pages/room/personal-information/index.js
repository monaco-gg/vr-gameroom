import Footer from "@components/Footer";
import { useFormValidation } from "@hooks/useFormValidation";
import { Button, Input, Link } from "@nextui-org/react";
import request from "@utils/api";
import { requestForToken } from "@utils/firebase";
import { getCookie } from "@utils/index";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

export default function PersonalInformation({ callbackUrl }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { fields, errors, handleInputChange, handleBlur } = useFormValidation();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestForToken();
    }
  }, []);

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    setTimeout(() => {
      setSnackbar({ open: false, message: "" });
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { nickname, dateOfBirth, phoneNumber } = fields;
    const {
      nickname: nicknameError,
      dateOfBirth: dateOfBirthError,
      phoneNumber: phoneNumberError,
    } = errors;

    // Dispara a validação manualmente para todos os campos
    handleBlur("nickname");
    handleBlur("dateOfBirth");
    handleBlur("phoneNumber");

    // Verifica se existem erros ou se algum campo está vazio
    if (
      nicknameError ||
      dateOfBirthError ||
      phoneNumberError ||
      !nickname ||
      !dateOfBirth ||
      !phoneNumber
    ) {
      showSnackbar("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (session) {
      const email = session.user.email;
      const referralCode = getCookie("referralCode");

      try {
        await request(`/users`, "PATCH", {
          email,
          dateOfBirth,
          phone: phoneNumber,
          nickname,
          referralCode,
        });
        router.push(callbackUrl);
      } catch (error) {
        console.error("Erro ao atualizar o perfil", error);
        showSnackbar("Erro ao atualizar o perfil. Tente novamente.");
      }
    }
  };

  return <>
    <Head>
      <title>Complete seu cadastro</title>
      <meta
        name="description"
        content="Participe da competição de jogos clássicos e concorra a prêmios!"
        key="desc"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/png" sizes="192x192" href="/monaco.png" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
    </Head>
    <div className="flex flex-col min-h-screen justify-between">
      <header className="p-4 text-white text-lg font-semibold">
        Complete seu cadastro
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] p-10">
          {session && session.user && session.user.image && (
            <div className="flex flex-col items-center">
              <Image
                src={session.user.image}
                alt="Avatar do Usuário"
                width={96}
                height={96}
                className="rounded-full object-cover mb-4"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              <h4 className="font-inter text-center text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-white custom-animation">
                Olá, {session.user.name}!
              </h4>
            </div>
          )}
          <div className="shadow sm:rounded-lg">
            <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
              <div className="mt-2">
                <Input
                  type="text"
                  label="Nickname"
                  onChange={(e) =>
                    handleInputChange("nickname", e.target.value)
                  }
                  onBlur={() => handleBlur("nickname")}
                  value={fields.nickname}
                  maxLength={24}
                  isInvalid={!!errors.nickname}
                  errorMessage={errors.nickname}
                />
              </div>

              <div className="relative mt-2 shadow-sm">
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

              <div className="relative mt-2 shadow-sm">
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

              <div>
                <p className="p-1 mb-4">
                  Ao clicar em <span className="font-bold">Cadastrar</span>{" "}
                  você estará aceitando os{" "}
                  <Link
                    href="https://go.monaco.gg/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    termos de uso
                  </Link>
                  .
                </p>
                <Button type="submit" 
                        //color="primary" 
                        className="bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
                        size="lg" fullWidth>
                  Cadastrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>

    {snackbar.open && (
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
        <div className="bg-red-600 text-white px-4 py-2 rounded shadow">
          {snackbar.message}
        </div>
      </div>
    )}
  </>;
}

export async function getServerSideProps(context) {
  const callbackUrl = context.query.callbackUrl || "/room/catalog";

  return { props: { callbackUrl } };
}
