import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useFirebaseAnalytics } from "@utils/firebase";

const PWAInstallButton = () => {
  const { handleLogEvent } = useFirebaseAnalytics();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const checkIOSDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const checkInstallation = () => {
      if (window.matchMedia("(display-mode: fullscreen)").matches) {
        setIsInstalled(true);
      } else if (window.navigator.standalone === true) {
        setIsInstalled(true);
      }
    };

    setIsIOS(checkIOSDevice());
    checkInstallation();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", (event) => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      onOpen();
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        handleLogEvent("pwa_install_accepted");
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return null; // Não renderiza nada se o app já estiver instalado
  }

  return (
    <div className="p-2 py-4 mt-10 bg-[#19172c] bg-opacity-50 text-white mx-10 rounded-md">
      <p className="mt-2 px-6 ">
        <span className="text-yellow-400 font-bold">
          🤔 Ainda não tem nosso App instalado?
        </span>{" "}
        Instale e melhore sua experiência nos jogos.
      </p>
      <Button
        onPress={handleInstallClick}
        //color="primary"
        className="rounded-full mt-4 bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
        disabled={!isIOS && !deferredPrompt}
      >
        {isIOS ? "Como instalar" : "Instalar App"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton={true}
        backdrop="blur"
        classNames={{
          body: "py-6",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col">Instalar no iOS</ModalHeader>
          <ModalBody>
            <p className="font-bold">
              Para instalar este app no seu dispositivo iOS:
            </p>
            <ol className="list-decimal list-inside space-y-4 text-white">
              <li>
                Toque no ícone de compartilhamento{" "}
                <span role="img" aria-label="share icon">
                  📤
                </span>{" "}
                no Safari.
              </li>
              <li>
                Role para baixo e escolha &ldquo;Adicionar à Tela de
                Início&ldquo;{" "}
                <span role="img" aria-label="home icon">
                  🏠
                </span>
                .
              </li>
              <li>Dê um nome ao atalho e toque em &ldquo;Adicionar&ldquo;.</li>
            </ol>
            <p className="text-white">
              Após estes passos, o app será instalado na sua tela inicial!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button 
                    //color="primary" 
                    className="rounded-full bg-primary hover:bg-opacity-80 focus-visible:outline-primary" onPress={onClose}>
              Entendi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PWAInstallButton;
