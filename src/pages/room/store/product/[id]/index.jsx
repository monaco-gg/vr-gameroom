import RoomLayout from "@components/Layout/RoomLayout";
import { useSession } from "next-auth/react";
import { Button, Chip } from "@nextui-org/react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import ModalPayment from "@components/Modal/ModalPayment";
import request from "@utils/api";
import { formatToBRL } from "@utils/index";

export default function Product({ productData, initialCouponCode }) {
  const { data: session } = useSession();
  const [openPayment, setOpenPayment] = useState(false);
  const [savedCPF, setSavedCPF] = useState(null);
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [discountedPrice, setDiscountedPrice] = useState(
    productData?.price || 0
  );
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    if (session && savedCPF === null) {
      request(`/me?id=${session.user?.id}`, "GET").then((data) =>
        setSavedCPF(data ? data.cpfCnpj : null)
      );
    }
  }, [savedCPF, session]);

  useEffect(() => {
    if (couponCode) {
      validateCoupon(couponCode);
    }
  }, [couponCode, productData]);

  const calculateDiscountedPrice = (
    originalPrice,
    discountType,
    discountValue
  ) => {
    let discountedPrice;
    if (discountType === "percentage") {
      discountedPrice = originalPrice * (1 - discountValue / 100);
      setDiscountPercentage(discountValue);
    } else if (discountType === "fixed") {
      discountedPrice = Math.max(originalPrice - discountValue, 0);
      setDiscountPercentage(Math.round((discountValue / originalPrice) * 100));
    } else {
      discountedPrice = originalPrice;
      setDiscountPercentage(0);
    }

    return Math.floor(discountedPrice * 100) / 100;
  };

  const getBuyButtonText = () => {
    if (discountPercentage > 0) {
      return `Comprar com ${discountPercentage}% OFF`;
    }
    return "Comprar";
  };

  const validateCoupon = async (code) => {
    try {
      const { data } = await request(`/coupons/${code}`, "POST");
      if (data.isValid) {
        const newDiscountedPrice = calculateDiscountedPrice(
          productData.price,
          data.discountType,
          data.discountValue
        );
        setDiscountedPrice(newDiscountedPrice);
      } else {
        setCouponCode(null);
        setDiscountedPrice(productData.price);
        setDiscountPercentage(0);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponCode(null);
      setDiscountedPrice(productData.price);
      setDiscountPercentage(0);
    }
  };

  return (
    <>
      {productData && productData._id && (
        <RoomLayout session={session} isBack={true} title={"Produto"}>
          <div className="flex flex-col items-start rounded-lg mb-4 p-4">
            <div className="bg-black overflow-hidden relative flex justify-center items-center h-[190px] w-full rounded-lg">
              <Image
                layout="fill"
                src={productData.image}
                alt={productData.name}
                priority={false}
              />
              {discountPercentage > 0 && (
                <Chip
                  color="primary"
                  className="absolute top-2 right-2 z-10"
                  size="md"
                >
                  {discountPercentage}% OFF
                </Chip>
              )}
            </div>
            <div className="w-full flex items-center justify-between mt-4">
              <h3 className="font-semibold text-gray-200 text-lg line-clamp-2 flex-grow mr-4 max-w-[60%]">
                {productData.name}
              </h3>
              <div className="flex flex-col items-end">
                {discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatToBRL(productData.price)}
                  </span>
                )}
                <span className="text-lg font-bold text-white">
                  {formatToBRL(discountedPrice)}
                </span>
              </div>
            </div>
            <div className="my-4">
              <h4 className="text-gray-200 mb-1">Sobre este produto</h4>
              <span className="text-sm font-normal text-gray-400">
                {productData.description}
              </span>
            </div>
            <div className="absolute bottom-28 right-3 left-3">
              <Button
                color="primary"
                fullWidth
                onPress={() => setOpenPayment(true)}
              >
                {getBuyButtonText()}
              </Button>
              <Button
                variant="bordered"
                className="mt-4"
                fullWidth
                onPress={() => {
                  window.open(
                    "https://go.monaco.gg/terms-and-conditions-store",
                    "_blank"
                  );
                }}
              >
                Termos e Condições
              </Button>
            </div>
          </div>
          {openPayment && (
            <ModalPayment
              user={session?.user}
              product={{ ...productData, discountedPrice }}
              savedCPF={savedCPF}
              onClose={() => setOpenPayment(false)}
              couponCode={couponCode}
            />
          )}
        </RoomLayout>
      )}
      {!productData && <p>Produto não encontrado</p>}
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    req,
    params: { id },
    query: { coupon },
  } = context;
  try {
    const { data } = await request(
      `/products/${id}`,
      "GET",
      null,
      {},
      true,
      req
    );
    return {
      props: {
        productData: data,
        initialCouponCode: coupon || null,
      },
    };
  } catch (error) {
    return {
      props: {
        productData: null,
        initialCouponCode: null,
      },
    };
  }
}
