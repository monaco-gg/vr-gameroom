import RoomLayout from "@components/Layout/RoomLayout";
import { useSession } from "next-auth/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productCoins } from "@utils/constants";
import { useEffect, useState, useContext } from "react";
import request from "@utils/api";
import { Card } from "@nextui-org/react";
import ProductCard from "@components/Card/ProductCard";
import AdRewardFullScreeen from "@components/Ads/AdRewardFullScreeen";
import { GlobalContext } from "@contexts/GlobalContext";

export default function Store({ initialProducts, initialCouponCode }) {
  const { data: session } = useSession();
  const { globalState, updateGlobalState } = useContext(GlobalContext);
  const [products, setProducts] = useState(initialProducts);
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [couponData, setCouponData] = useState(null);

  const [open, setOpen] = useState(false);

  // Verifica se os anúncios estão habilitados
  const isGoogleAdsEnabled = (() => {
    const adDisabled = process.env.NEXT_PUBLIC_GOOGLE_AD_DISABLED;
    if (adDisabled === undefined || adDisabled === null) {
      console.log('⚠️ NEXT_PUBLIC_GOOGLE_AD_DISABLED não está definida. O componente de vídeo NÃO será exibido.');
      return false;
    }
    if (adDisabled === "true") {
      console.log('🚫 NEXT_PUBLIC_GOOGLE_AD_DISABLED=true. O componente de vídeo NÃO será exibido.');
      return false;
    }
    if (adDisabled === "false") {
      console.log('✅ NEXT_PUBLIC_GOOGLE_AD_DISABLED=false. O componente de vídeo SERÁ exibido.');
      return true;
    }
    console.log(`⚠️ NEXT_PUBLIC_GOOGLE_AD_DISABLED com valor inesperado ('${adDisabled}'). O componente de vídeo NÃO será exibido.`);
    return false;
  })();
   
  const handleReward = async () => {
    console.log("🎉 Recompensa liberada!");

    try {
      const response = await fetch("/api/users/reward-coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Ficha adicionada:", data);
        console.log("💰 Fichas antes da atualização:", globalState?.user?.coinsAvailable);
        
        // Atualiza o estado global com as novas fichas
        if (globalState?.user && data.coinsAvailable !== undefined) {
          updateGlobalState({
            user: {
              ...globalState.user,
              coinsAvailable: data.coinsAvailable
            }
          });
          console.log("🔄 Estado global atualizado com novas fichas:", data.coinsAvailable);
          console.log("✅ Componente CoinsAvailable será atualizado automaticamente!");
        } else {
          console.warn("⚠️ Não foi possível atualizar o estado global");
        }
      } else {
        console.log("⚠️ Erro ao adicionar ficha:", data.message);
      }
    } catch (error) {
      console.log("❌ Erro na requisição:", error);
    }
  };

  const handleClose = (errorOccurred = false) => {
    setOpen(false);
    if (errorOccurred) {
      console.log("[AdReward] Ocorreu um erro ao exibir o anúncio recompensado.");
    } else {
      console.log("[AdReward] Modal fechado normalmente.");
    }
  };

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
            <h1 className="font-inter text-3xl mb-2">Continue jogando!</h1>
            <span className="font-inter text-medium mb-5 text-gray-400 text-left">
              Adquira mais fichas para competir com seus amigos!
            </span>
          </div>
          {isGoogleAdsEnabled && (
            <div>
              <Card className="p-6 mb-8 bg-gray-900  rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-3 text-white drop-shadow-md select-none">
                  Assista e Ganhe Vidas! 💥
                </h3>

                <p className="text-sm text-gray-400  mb-6 select-none">
                  Assista ao vídeo até o final e desbloqueie{" "}
                  <strong>vidas extras</strong> para continuar jogando! 🕹️✨
                </p>

                <button
                  onClick={() => {
                    console.log("🎬 Botão 'Assistir Vídeo' clicado, abrindo modal...");
                    setOpen(true);
                  }}
                  className="px-5 py-2 bg-success-600 hover:bg-success-700 rounded-md text-white font-semibold transition"
                  aria-label="Abrir vídeo para ganhar vidas"
                >
                  ▶️ Assistir Vídeo
                </button>

                <AdRewardFullScreeen
                  isOpen={open}
                  onClose={handleClose}
                  onReward={handleReward}
                />
              </Card>
            </div>
          )}
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

// import RoomLayout from "@components/Layout/RoomLayout";
// import { useSession } from "next-auth/react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { productCoins } from "@utils/constants";
// import { useEffect, useState } from "react";
// import request from "@utils/api";
// import ProductCard from "@components/Card/ProductCard";
// import AdArcadeModal from "@components/Ads/AdArcadeModal";

// import { Card } from "@nextui-org/react";

// export default function Store({ initialProducts, initialCouponCode }) {
//   const { data: session } = useSession();
//   const [products, setProducts] = useState(initialProducts);
//   const [couponCode, setCouponCode] = useState(initialCouponCode);
//   const [couponData, setCouponData] = useState(null);

//   const [open, setOpen] = useState(false);
   
//   const handleReward = async () => {
//   console.log("🎉 Recompensa liberada!");

//   try {
       
//     const response = await fetch("/api/users/reward-coin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: session.user.email }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert("✅ Ficha adicionada: chamando callback", data);      
//     } else {
//       alert("⚠️ Erro ao adicionar ficha:", data.message);
//     }
//   } catch (error) {
//     alert("❌ Erro na requisição:", error);
//   }
// };

//   useEffect(() => {
//     if (couponCode) {
//       validateCoupon(couponCode);
//     }
//   }, [couponCode]);

//   const validateCoupon = async (code) => {
//     try {
//       const { data } = await request(`/coupons/${code}`, "POST");
//       if (data.isValid) {
//         setCouponData(data);
//         applyDiscountToProducts(data);
//       } else {
//         setCouponCode(null);
//         setCouponData(null);
//         resetProductPrices();
//       }
//     } catch (error) {
//       console.error("Error validating coupon:", error);
//       setCouponCode(null);
//       setCouponData(null);
//       resetProductPrices();
//     }
//   };

//   const calculateDiscountedPrice = (
//     originalPrice,
//     discountType,
//     discountValue
//   ) => {
//     let discountedPrice;
//     if (discountType === "percentage") {
//       discountedPrice = originalPrice * (1 - discountValue / 100);
//     } else if (discountType === "fixed") {
//       discountedPrice = Math.max(originalPrice - discountValue, 0);
//     } else {
//       discountedPrice = originalPrice;
//     }

//     return Math.floor(discountedPrice * 100) / 100;
//   };

//   const applyDiscountToProducts = (couponData) => {
//     const updatedProducts = products.map((product) => ({
//       ...product,
//       discountedPrice: calculateDiscountedPrice(
//         product.price,
//         couponData.discountType,
//         couponData.discountValue
//       ),
//       discountPercentage:
//         couponData.discountType === "percentage"
//           ? couponData.discountValue
//           : Math.round((couponData.discountValue / product.price) * 100),
//     }));
//     setProducts(updatedProducts);
//   };

//   const resetProductPrices = () => {
//     const resetProducts = products.map((product) => ({
//       ...product,
//       discountedPrice: null,
//       discountPercentage: 0,
//     }));
//     setProducts(resetProducts);
//   };

//   return (
//     <>
//       <RoomLayout session={session} title={"Loja"}>
//         <div className="mr-6 ml-6">
//           <div className="flex flex-col justify-start items-start text-center mt-8 mb-2 gap-y-2">
//             <h1 className="font-inter text-3xl mb-2">Continue jogando!</h1>
//             <span className="font-inter text-medium mb-5 text-gray-400 text-left">
//               Adquira mais fichas para competir com seus amigos!
//             </span>
//           </div>
//           <div>
//             <Card className="p-6 mb-8 bg-gray-900  rounded-lg shadow-lg">
//               <h3 className="text-lg font-bold mb-3 text-white drop-shadow-md select-none">
//                 Assista e Ganhe Vidas! 💥
//               </h3>

//               <p className="text-sm text-gray-400  mb-6 select-none">
//                 Assista ao vídeo até o final e desbloqueie{" "}
//                 <strong>vidas extras</strong> para continuar jogando! 🕹️✨
//               </p>

//               <button
//                 onClick={() => setOpen(true)}
//                 className="px-5 py-2 bg-success-600 hover:bg-success-700 rounded-md text-white font-semibold transition"
//                 aria-label="Abrir vídeo para ganhar vidas"
//               >
//                 ▶️ Assistir Vídeo
//               </button>

//               <AdArcadeModal
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 onReward={() => handleReward()}
//                 videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"                
//               />
//             </Card>
//           </div>
//           <div className="overflow-scroll">
//             {products.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 couponCode={couponCode}
//               />
//             ))}
//           </div>
//         </div>
//       </RoomLayout>
//     </>
//   );
// }

// export async function getServerSideProps(context) {
//   const { req, query } = context;
//   const couponCode = query.coupon || null;
//   try {
//     const { data } = await request(`/products`, "GET", null, {}, true, req);
//     return {
//       props: {
//         initialProducts: data || [],
//         initialCouponCode: couponCode,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         initialProducts: [],
//         initialCouponCode: couponCode,
//       },
//     };
//   }
// }
