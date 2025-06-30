import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useOrders } from "@hooks/useOrders";
import OrderList from "@components/OrderList/OrderList";
import RoomLayout from "@components/Layout/RoomLayout";
import { useSession } from "next-auth/react";

const OrdersContent = () => {
  const { orders, isLoading, error } = useOrders();

  console.log("isLoading: " +isLoading + " error: " + error);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar pedidos: {error.message}</div>;

  return <OrderList orders={orders} />;
};

const OrdersPage = () => {
  const { data: session, status } = useSession();

  return (
    <RoomLayout
      title="Meus Pedidos"
      isBack={true}
      session={session}
      widthHeader={true}
    >
      <div className="p-6">
        <div className="flex flex-col items-start">
          <h4 className="font-inter text-3xl mb-2">Meus Pedidos</h4>
          <p className="font-inter text-medium text-gray-400 mb-6">
            Acompanhe o seu histórico de pedidos
          </p>
        </div>
        <OrdersContent />
      </div>
    </RoomLayout>
  );
};

export default OrdersPage;
