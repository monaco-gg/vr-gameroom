import React, { useState } from "react";
import {
  Card,
  CardBody,
  Chip,
  Divider,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
} from "@nextui-org/react";
import { IOrder } from "@models/Order";
import { PixForm } from "@components/Modal/ModalPayment";
import { PixIcon } from "@components/Icons/PixIcon";

interface OrderItem {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface IOrderWithItems extends Omit<IOrder, "items"> {
  items: OrderItem[];
}

interface OrderListProps {
  orders: IOrderWithItems[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<IOrderWithItems | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPixModal = (order: IOrderWithItems) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closePixModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id.toString()} className="w-full bg-neutral-800">
          <CardBody>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">
                Pedido #{order._id.toString().slice(-6)}
              </span>
              <div className="flex items-center gap-2">
                <Chip
                  color={getStatusColor(order.status)}
                  variant="flat"
                  className={getStatusTextColor(order.status)}
                >
                  {getStatusText(order.status)}
                </Chip>
              </div>
            </div>
            <Divider className="my-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p>{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p>{formatCurrency(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Método de Pagamento</p>
                <p>{getPaymentMethodText(order.paymentMethod)}</p>
              </div>
              <div>
                <div className="flex justify-end mt-2">
                  {order.status === "pending" && order.pixQRCode && (
                    <Button
                      size="sm"
                      variant="bordered"
                      //color="primary"
                      onPress={() => openPixModal(order)}
                      className="text-white-900 gap-1 pl-1 bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
                      startContent={
                        <PixIcon
                          height={16}
                          width={16}
                          fill="currentColor"
                          filled={true}
                          label="PIX Icon"
                        />
                      }
                    >
                      {order.status === "pending"
                        ? "Pagar com PIX"
                        : "Ver QR Code PIX"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Divider className="my-2" />
            <div>
              <p className="text-sm font-semibold mb-2">Itens do Pedido:</p>
              <ul className="list-disc pl-5">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}x {item.product.name}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={closePixModal}
        placement="bottom-center"
        backdrop="blur"
        classNames={{
          body: "py-6",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-lg font-light">
            <p className="font-bold">Falta Pouco!</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-neutral-400 -mt-8 text-sm">
              Copie o código abaixo e cole no aplicativo do seu banco. Após
              realizar o pagamento, você será redirecionado para a tela inicial
              e suas fichas serão creditadas automaticamente!
            </p>
            <PixForm order={selectedOrder} showCountdown={false} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const getStatusColor = (
  status: IOrder["status"]
): "warning" | "primary" | "success" | "danger" => {
  switch (status) {
    case "pending":
      return "warning";
    case "processing":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
  }
};

const getStatusText = (status: IOrder["status"]): string => {
  const statusMap: Record<IOrder["status"], string> = {
    pending: "Pendente",
    processing: "Processando",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status];
};

const getStatusTextColor = (status: IOrder["status"]): string => {
  const statusMap: Record<IOrder["status"], string> = {
    pending: "text-warning-900",
    processing: "text-white-900",
    completed: "text-success-900",
    cancelled: "text-danger-900",
  };
  return statusMap[status];
};

const getPaymentMethodText = (method: IOrder["paymentMethod"]): string => {
  const methodMap: Record<IOrder["paymentMethod"], string> = {
    pix: "PIX",
    credit_card: "Cartão de Crédito",
    boleto: "Boleto",
  };
  return methodMap[method];
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDateTime = (date: Date | string): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return dateObject.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default OrderList;
