import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
} from "@nextui-org/react";
import { useFirebaseAnalytics } from "@utils/firebase";
import AdBanner from "./AdBanner";
import { post } from "@utils/apiClient";

const AdModal = ({ isOpen, onClose, onAdComplete }) => {
  const [adProgress, setAdProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogEvent } = useFirebaseAnalytics();

  const handleAdWatch = () => {
    setIsLoading(true);
    handleLogEvent("ad_watched");
    const interval = setInterval(async () => {
      setAdProgress((prev) => {
        if (prev >= 80) {
          post(
            "/api/users/renew-coins",
            {},
            {
              withCredentials: true,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          ).then(() => (window.location = "/room/catalog"));
        }

        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          onAdComplete();
          // onClose();

          return 100;
        }
        return prev + 10;
      });
    }, 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="bottom-center"
      hideCloseButton={true}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Ganhe fichas grátis!
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Aguarde alguns segundos para ganhar fichas extras e continue
              jogando!
            </p>
            <AdBanner className={"h-[400px]"} slog={6199844788} />
            {isLoading && (
              <Progress
                size="md"
                value={adProgress}
                color="success"
                showValueLabel={true}
                className="max-w-md"
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={() => {
              onClose();
              setAdProgress(0);
            }}
            className="font-medium"
          >
            Cancelar
          </Button>
          <Button
            color="success"
            onPress={handleAdWatch}
            isLoading={isLoading}
            className="text-white font-medium"
          >
            {isLoading ? "Aguarde..." : "Coletar Moedas"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdModal;
