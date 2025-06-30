// components/Community/JoinCommunityModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

const JoinCommunityModal = ({ isOpen, onClose, onJoin }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    setIsLoading(true);
    setError("");

    try {
      await onJoin(trimmedCode);
      setCode("");
    } catch (error) {
      console.error("Erro ao processar entrada na comunidade:", error);
      setError(error.data?.message || "Ocorreu um erro ao processar o convite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Entrar em uma Comunidade</ModalHeader>
          <ModalBody>
            <p className="mb-4">
              Digite o código de convite para entrar em uma comunidade
              existente.
            </p>

            {error && <div className="text-danger mb-4">{error}</div>}

            <Input
              label="Código de Convite"
              placeholder="Ex: AB12CD34"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              isInvalid={!!error}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={handleCloseModal}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              //color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={!code.trim()}
              className="rounded-full bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
            >
              Entrar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default JoinCommunityModal;
