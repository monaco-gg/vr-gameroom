import { Button, Link } from "@nextui-org/react";
import { GamepadIcon } from "../Icons/GamepadIcon";
import { useFirebaseAnalytics } from "@utils/firebase";
import { GameboyIcon } from "@components/Icons/GameboyIcon";

export default function GetStarted({ text }) {
  const { handleLogEvent } = useFirebaseAnalytics();

  return (
    <>
      <div className="flex justify-center items-center mt-0">
        {/* TODO: MRC customização de cores */}
        <Button
          as={Link}
          variant="solid"
          size="lg"
          radius="md"
          className="font-bold h-14 rounded-full shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                     bg-success 
                     hover:bg-opacity-80 
                     focus-visible:outline-success"
          startContent={<GameboyIcon />}
          onPress={() => handleLogEvent("get_started_click")}
          href="/auth/sign-in"
        >
          {text}
        </Button>
      </div>
    </>
  );
}
