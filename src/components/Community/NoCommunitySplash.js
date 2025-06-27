// components/Community/NoCommunitySplash.js
import React from "react";
import { Card, Button } from "@nextui-org/react";
import {
  UsersIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const NoCommunitySplash = ({ onCreateCommunity, onOpenJoinModal }) => {
  return (
    <Card className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <UsersIcon className="w-16 h-16 text-primary" />
      </div>

      <h2 className="text-2xl font-bold mb-3">Sem Comunidade</h2>

      <p className="mb-6 text-gray-500">
        Você ainda não está em nenhuma comunidade. Crie sua própria comunidade
        ou junte-se a uma existente usando um código de convite.
      </p>

      <div className="flex flex-col gap-4">
        <Button
          color="primary"
          variant="solid"
          startContent={<PlusCircleIcon className="w-5 h-5" />}
          onPress={onCreateCommunity}
          className="w-full"
        >
          Criar Comunidade
        </Button>

        <Button
          color="secondary"
          variant="flat"
          startContent={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
          onPress={onOpenJoinModal}
          className="w-full"
        >
          Entrar com Código
        </Button>
      </div>
    </Card>
  );
};

export default NoCommunitySplash;
