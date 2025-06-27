import { Card, Skeleton } from "@nextui-org/react";

export default function RankingSkeleton() {
  return (
    <>
      <div className="flex flex-col mt-14 mb-5 self-center place-items-center">
        <div>
          <div className="space-y-3">
            <Skeleton className="flex rounded-full w-16 h-16" />
          </div>
          <div className="space-y-3 mt-5">
            <Skeleton className="w-full rounded-lg">
              <div className="h-5 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <div className="space-y-3 mt-2">
            <Skeleton className="w-full rounded-lg">
              <div className="h-7 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </div>
      </div>
      <div className="mx-6 overflow-hidden rounded-2xl">
        <Card className="w-full space-y-5 p-4" radius="lg">
          {new Array(5).fill(undefined).map((value, index) => (
            <div key={index} className="flex flex-row">
              <div className="space-y-3">
                <Skeleton className="flex rounded-full w-12 h-12" />
              </div>
              <div className="space-y-3 w-full ml-2 mt-1">
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
