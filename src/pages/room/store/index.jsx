import RoomLayout from "@components/Layout/RoomLayout";
import { useSession } from "next-auth/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productCoins } from "@utils/constants";
import { useEffect, useState } from "react";
import request from "@utils/api";
import ProductCard from "@components/Card/ProductCard";

export default function Store({ initialProducts, initialCouponCode }) {
  const { data: session } = useSession();
  const [products, setProducts] = useState(initialProducts);
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [couponData, setCouponData] = useState(null);

  useEffect(() => {
    if (couponCode) {
      validateCoupon(couponCode);
    }
  }, [couponCode]);

  const validateCoupon = async (code) => {
    try {
      const { data } = await request(`/coupons/${code}`, "POST");
      if (data.isValid) {
        setCouponData(data);
        applyDiscountToProducts(data);
      } else {
        setCouponCode(null);
        setCouponData(null);
        resetProductPrices();
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponCode(null);
      setCouponData(null);
      resetProductPrices();
    }
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

    return Math.floor(discountedPrice * 100) / 100;
  };

  const applyDiscountToProducts = (couponData) => {
    const updatedProducts = products.map((product) => ({
      ...product,
      discountedPrice: calculateDiscountedPrice(
        product.price,
        couponData.discountType,
        couponData.discountValue
      ),
      discountPercentage:
        couponData.discountType === "percentage"
          ? couponData.discountValue
          : Math.round((couponData.discountValue / product.price) * 100),
    }));
    setProducts(updatedProducts);
  };

  const resetProductPrices = () => {
    const resetProducts = products.map((product) => ({
      ...product,
      discountedPrice: null,
      discountPercentage: 0,
    }));
    setProducts(resetProducts);
  };

  return (
    <>
      <RoomLayout session={session} title={"Loja"}>
        <div className="mr-6 ml-6">
          <div className="flex flex-col justify-start items-start text-center mt-8 mb-2 gap-y-2">
            <h1 className="text-lg font-semibold">Continue jogando!</h1>
            <span className="text-sm text-gray-400 text-left">
              Adquira mais fichas para competir com seus amigos!
            </span>
          </div>
          <div className="overflow-scroll">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                couponCode={couponCode}
              />
            ))}
          </div>
        </div>
      </RoomLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;
  const couponCode = query.coupon || null;
  try {
    const { data } = await request(`/products`, "GET", null, {}, true, req);
    return {
      props: {
        initialProducts: data || [],
        initialCouponCode: couponCode,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProducts: [],
        initialCouponCode: couponCode,
      },
    };
  }
}
