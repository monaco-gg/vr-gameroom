import { Chip } from "@nextui-org/react";
import { formatToBRL } from "@utils/index";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";

/**
 * Renders a shop card component displaying product details including an image, name, and price.
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.product - The product object containing details like id, name, price, image, discountedPrice, and discountPercentage.
 * @param {string} [props.couponCode] - The coupon code, if available.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
function ProductCard({ product, couponCode }) {
  const router = useRouter();
  const { _id, name, image, price, discountedPrice, discountPercentage } = product;

  function handleItemClick() {
    router.push(`/room/store/product/${_id}${couponCode ? `?coupon=${couponCode}` : ''}`);
  }

  const hasDiscount = discountedPrice !== null && discountedPrice < price;

  return (
    <div
      className="flex flex-col items-start rounded-lg bg-gray-900 mb-4 overflow-hidden cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="bg-black relative flex justify-center items-center h-[200px] w-full">
        <Image
          layout="fill"
          src={image}
          alt={name}
          priority={true}
          objectFit="cover"
        />
        {hasDiscount && (
          <Chip
            color="primary"
            className="absolute top-2 right-2 z-10"
            size="md"
          >
            {discountPercentage}% OFF
          </Chip>
        )}
      </div>
      <div className="p-3 w-full flex items-center justify-between">
        <h3 className="text-white font-semibold text-base line-clamp-2 flex-grow mr-4 max-w-[60%]">
          {name}
        </h3>
        <div className="flex flex-col items-end">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatToBRL(price)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-200">
            {formatToBRL(hasDiscount ? discountedPrice : price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;