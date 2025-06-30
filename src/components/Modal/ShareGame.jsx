import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ShareIcon } from "../Icons/ShareIcon";
import ModalPayment from "@components/Modal/ModalPayment";

const ShareGame = ({ stepContent, shareURL, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareURL)
      .then(() => {
        toast("Link Copiado", { type: "success" });
      })
      .catch((err) => toast("Erro ao copiar link", { type: "error" }));
  };

  const handleOnClose = () => {
    onClose(false);
    setIsOpen(false);
  };

  const handleWhatsShare = () => {
    window.location.href = `whatsapp://send?text=Bora%20jogar%20esse%20jogo%3F%20Duvido%20fazer%20mais%20pontos%20que%20eu%20%F0%9F%98%81%0A%0A${encodeURI(
      shareURL
    )}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom-center"
      hideCloseButton={true}
      backdrop="blur"
      classNames={{
        body: "py-6",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
      }}
    >
      <ModalContent>
        <div className="flex flex-row ml-6 mt-6">
          <ShareIcon />
          <span className="ml-2">{stepContent.label}</span>
        </div>
        <ModalHeader className="flex flex-col gap-1 text-xl">
          {stepContent.title}
        </ModalHeader>
        <ModalBody>
          {stepContent.texts.map((text, index) => (
            <p key={index} className="text-base text-gray-400">
              <a className="text-indigo-600">✦ </a>
              {text}
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col w-full">
            <Button
              //color="primary"
              className="w-full mb-4 bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
              onPress={handleCopy}
            >
              Copiar link do jogo
            </Button>
            <Button
              //color="success"
              className="w-full mb-4 text-white bg-success hover:bg-opacity-80 focus-visible:outline-success"
              onPress={handleWhatsShare}
            >
              Enviar por WhatsApp
            </Button>
            <Button
              className="w-full mb-4"
              onPress={() => handleOnClose()}
            >
              Fechar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ShareGame;
