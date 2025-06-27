import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatToBRL, validateCPF } from "@utils/index";
import request from "@utils/api";
import { PixIcon } from "@components/Icons/PixIcon";
import PixCountdown from "@components/CountDown/PixCountDown";
import Fireworks from "@fireworks-js/react";
import { getRemoteConfigValue } from "@utils/firebase";

// TODO: Converter para typescript usando ENUM
const OrderStatusEnum = {
  open: "open",
  pending: "pending",
  paid: "paid",
  failed: "failed",
};

function CouponInput({ onApplyCoupon, onRemoveCoupon, appliedCoupon }) {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex justify-between items-center mb-4 mt-4">
        <span className="text-sm">Cupom aplicado: {appliedCoupon}</span>
        <Button size="sm" onClick={onRemoveCoupon} onPress={onRemoveCoupon}>
          Remover Cupom
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-2 mt-2">
      <Input
        type="text"
        label="Código do cupom"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        variant="bordered"
      />
      <Button
        color="success"
        className="text-white w-full mt-2 mb-2"
        onClick={handleApplyCoupon}
        onPress={handleApplyCoupon}
        disabled={couponCode.trim().length === 0}
      >
        Aplicar Cupom
      </Button>
    </div>
  );
}

function ProductCart({ product, discountedPrice }) {
  const hasDiscount =
    discountedPrice !== null &&
    discountedPrice !== undefined &&
    discountedPrice < product.price;

  return (
    <div className="flex items-center justify-between p-4 pb-0">
      <div className="flex items-center">
        <Image
          src={product.image}
          alt="Product Package"
          width={64}
          height={64}
          className="rounded-md"
          priority={false}
        />
        <div className="ml-4">
          <h2 className="text-white text-sm">{product?.name}</h2>
        </div>
      </div>
      <div className="flex flex-col items-end">
        {hasDiscount && (
          <span className="text-gray-400 text-sm line-through">
            {formatToBRL(product?.price)}
          </span>
        )}
        <span className="text-white text-lg font-semibold">
          {formatToBRL(discountedPrice)}
        </span>
      </div>
    </div>
  );
}

function PaymentForm({
  product,
  user,
  onClose,
  savedCPF,
  setOrder,
  initialCouponCode,
  onDiscountedPriceChange,
}) {
  const [cpf, setCpf] = useState(savedCPF);
  const [error, setError] = useState(null);
  const [hasValidate, setHasValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(initialCouponCode);
  const [discountedPrice, setDiscountedPrice] = useState(product.price);

  useEffect(() => {
    if (initialCouponCode) {
      validateCoupon(initialCouponCode);
    }
  }, []);

  const isInvalid = useMemo(() => {
    const invalid = !validateCPF(cpf);

    if (invalid) {
      setError("Por favor, digite um CPF válido.");
    } else {
      setError(null);
    }

    return invalid;
  }, [cpf]);

  const handleInput = (value) => {
    setHasValidate(true);
    setCpf(value);
  };

  const calculateDiscountedPrice = (
    originalPrice,
    discountType,
    discountValue
  ) => {
    let discountedPrice;
    if (discountType === "percentage") {
      discountedPrice = originalPrice * (1 - discountValue / 100);
    } else if (discountType === "fixed") {
      discountedPrice = Math.max(originalPrice - discountValue, 0);
    } else {
      discountedPrice = originalPrice;
    }

    // Truncate to 2 decimal places (cents) and round down
    return Math.floor(discountedPrice * 100) / 100;
  };

  const validateCoupon = async (couponCode) => {
    try {
      const { data } = await request(`/coupons/${couponCode}`, "POST");
      if (data.isValid) {
        const newDiscountedPrice = calculateDiscountedPrice(
          product.price,
          data.discountType,
          data.discountValue
        );
        setAppliedCoupon(couponCode);
        setDiscountedPrice(newDiscountedPrice);
        onDiscountedPriceChange(newDiscountedPrice);
        toast("Cupom aplicado com sucesso!", { type: "success" });
      } else {
        setAppliedCoupon(null);
        setDiscountedPrice(product.price);
        onDiscountedPriceChange(product.price);
        toast("Cupom inválido.", { type: "error" });
      }
    } catch (error) {
      setAppliedCoupon(null);
      setDiscountedPrice(product.price);
      onDiscountedPriceChange(product.price);
      toast("Cupom inválido.", { type: "error" });
    }
  };

  const handleApplyCoupon = async (couponCode) => {
    await validateCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedPrice(product.price);
    onDiscountedPriceChange(product.price);
    toast("Cupom removido.", { type: "info" });
  };

  const handleSubmit = async () => {
    setHasValidate(true);

    if (error === null && user && cpf) {
      try {
        setIsLoading(true);

        const provider = await getRemoteConfigValue("payment_provider");

        const { data } = await request("/users/payment-providers", "POST", {
          userId: user.id,
          cpfCnpj: cpf,
          provider,
        });
        const { data: orderData } = await request("/orders", "POST", {
          user: user.id,
          items: [
            {
              product: product._id,
              quantity: product.quantity,
              price: discountedPrice,
            },
          ],
          totalAmount: product.quantity * discountedPrice,
          paymentMethod: "pix",
          paymentProvider: provider,
          couponCode: appliedCoupon,
        });

        if (orderData.paymentStatus === OrderStatusEnum.pending) {
          setOrder(orderData);
        }

        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        toast("Erro ao gerar pagamento.", { type: "error" });
      }
    } else {
      setIsLoading(false);
      setError("Preencha o campo.");
    }
  };

  return (
    <div>
      {!savedCPF && (
        <Input
          type="tel"
          inputMode="numeric"
          label="CPF (apenas números)"
          variant="bordered"
          onValueChange={handleInput}
          onKeyDown={(event) => {
            if (isNaN(event.key) && event.key !== "Backspace") {
              event.preventDefault();
            }
          }}
          maxLength={11}
          isInvalid={isInvalid && hasValidate}
          errorMessage={hasValidate && error}
        />
      )}
      <CouponInput
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        appliedCoupon={appliedCoupon}
      />
      <Button
        type="button"
        startContent={<PixIcon />}
        color="primary"
        className="w-full mb-4"
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handleSubmit}
        onPress={handleSubmit}
      >
        {isLoading ? "Gerando código PIX" : "Pagar com PIX"}
      </Button>
      <Button
        type="button"
        className="w-full mb-4"
        variant="bordered"
        onClick={onClose}
        onPress={onClose}
        isDisabled={isLoading}
      >
        Cancelar
      </Button>
    </div>
  );
}

export function PixForm({ order, showCountdown = true }) {
  const inputRef = useRef(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => {
          toast(
            "Código copiado! Acesse seu aplicativo de banco e efetue o pagamento",
            { type: "success", autoClose: 10000 }
          );
        })
        .catch((err) => {
          console.error("Falha ao copiar: ", err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {showCountdown && <PixCountdown />}
      {order.paymentProvider === "asaas" ? (
        <Image
          alt="PIX QRCODE"
          src={`data:image/png;base64,${order.pixQRCode}`}
          width={200}
          height={200}
        />
      ) : (
        <Image
          alt="PIX QRCODE"
          src={order.pixQRCode}
          width={200}
          height={200}
        />
      )}
      <Input
        ref={inputRef}
        type="text"
        isReadOnly={true}
        fullWidth
        variant="bordered"
        defaultValue={order.pixKey}
        className="mt-4"
      />
      <Button
        type="button"
        label="Código PIX"
        className="w-full mb-4 mt-4"
        color="primary"
        onClick={handleCopy}
        onPress={handleCopy}
      >
        Copiar Código PIX
      </Button>
    </div>
  );
}

function ModalPayment({ product, user, onClose, savedCPF, couponCode }) {
  const [order, setOrder] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiscountedPrice, setCurrentDiscountedPrice] = useState(
    product.price
  );
  const [placement, setPlacement] = useState("bottom-center");

  useEffect(() => {
    if (window) {
      // focus events don't bubble, must use capture phase
      document.body.addEventListener(
        "focus",
        (event) => {
          const target = event.target;
          switch (target.tagName) {
            case "INPUT":
            case "TEXTAREA":
            case "SELECT":
              setPlacement("top-center");
          }

          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        },
        true
      );
      document.body.addEventListener(
        "blur",
        () => {
          setPlacement("bottom-center");
        },
        true
      );
    }
  }, []);

  useEffect(() => {
    if (order && order.paymentStatus === OrderStatusEnum.pending) {
      const poolingOrder = setInterval(async () => {
        const { data } = await request(`/orders/${order._id}`);

        if (data && data.paymentStatus !== OrderStatusEnum.pending) {
          clearInterval(poolingOrder);
          setOrder(data);
        }
      }, 1000);
    }
  }, [order]);

  const handleDiscountedPriceChange = (newPrice) => {
    setCurrentDiscountedPrice(newPrice);
  };

  if (!user || !product) {
    return <></>;
  }

  return (
    <>
      <Modal
        isOpen={true}
        placement={placement}
        hideCloseButton={true}
        backdrop="blur"
        classNames={{
          body: "py-6",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        {!order ? (
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-lg font-light">
              <p className="font-bold">Verifique sua compra!</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-neutral-400 -mt-4 text-sm">
                Revise os detalhes do seu pedido, incluindo itens, para garantir
                que tudo está correto antes de finalizar a compra.
              </p>
              <ProductCart
                product={product}
                discountedPrice={currentDiscountedPrice}
              />
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <PaymentForm
                  product={product}
                  user={user}
                  onClose={onClose}
                  savedCPF={savedCPF}
                  setOrder={setOrder}
                  initialCouponCode={couponCode}
                  onDiscountedPriceChange={handleDiscountedPriceChange}
                />
              </div>
            </ModalFooter>
          </ModalContent>
        ) : (
          <>
            {order.paymentStatus === OrderStatusEnum.pending && (
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-lg font-light">
                  <p className="font-bold">Falta Pouco!</p>
                </ModalHeader>
                <ModalBody>
                  <p className="text-neutral-400 -mt-8 text-sm">
                    Copie o código abaixo e cole no aplicativo do seu banco.
                    Após realizar o pagamento, você será redirecionado para a
                    tela inicial e suas fichas serão creditadas automaticamente!
                  </p>
                  <PixForm order={order} />
                </ModalBody>
              </ModalContent>
            )}

            {order.paymentStatus === OrderStatusEnum.paid && (
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-lg font-light">
                  <p className="font-bold text-green-400">
                    Pagamento Aprovado!
                  </p>
                </ModalHeader>
                <ModalBody>
                  <p className="text-neutral-400 -mt-8 text-sm">
                    As fichas que você comprou foram creditadas na sua conta.
                    Agora você pode usá-las em suas próximas jogadas e aproveite
                    ao máximo!
                  </p>
                  <div className="flex flex-col items-center">
                    <Image
                      src="/imgs/store/order-paid.png"
                      width={200}
                      height={200}
                      alt="Order Paid"
                      className="mb-8"
                    />
                    <Button
                      type="button"
                      className="w-full mb-4"
                      variant="bordered"
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      onClick={() => {
                        setIsLoading(true);
                        window.location.href = "/room/catalog";
                      }}
                      onPress={() => {
                        setIsLoading(true);
                        window.location.href = "/room/catalog";
                      }}
                    >
                      {isLoading ? "Redirecionando..." : "Fechar"}
                    </Button>
                  </div>
                </ModalBody>
              </ModalContent>
            )}
          </>
        )}
      </Modal>
      {order && order.paymentStatus === OrderStatusEnum.paid && (
        <div className="absolute z-[10]">
          <Fireworks
            options={{ opacity: 0.5 }}
            style={{
              color: "#6D49FF",
              top: 0,
              left: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
            }}
          />
        </div>
      )}
    </>
  );
}

export default ModalPayment;
