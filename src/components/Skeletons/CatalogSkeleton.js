import { Skeleton } from "@nextui-org/react";

export default function CatalogSkeleton() {
  return (
    <>
      <div className="mb-4">
        <div className="ml-6 mt-6">
          <Skeleton className="w-40 rounded-lg mb-1">
            <div className="h-7 w-40 rounded-lg bg-default-200"></div>
          </Skeleton>
          <div className="flex flex-row mt-5">
            {new Array(1).fill(undefined).map((value, index) => (
              <Skeleton
                className="h-[580px] w-[500px] rounded-lg mr-5"
                key={index}
              ></Skeleton>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
