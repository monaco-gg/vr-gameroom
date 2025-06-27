import { Button, Link } from "@nextui-org/react";
import { GamepadIcon } from "../Icons/GamepadIcon";
import { useFirebaseAnalytics } from "@utils/firebase";
import { GameboyIcon } from "@components/Icons/GameboyIcon";

export default function GetStarted({ text }) {
  const { handleLogEvent } = useFirebaseAnalytics();

  return (
    <>
      <div className="flex justify-center items-center mt-0">
        <Button
          as={Link}
          variant="solid"
          size="lg"
          radius="md"
          color="success"
          className="font-bold h-14 rounded-full"
          startContent={<GameboyIcon />}
          onClick={() => handleLogEvent("get_started_click")}
          onPress={() => handleLogEvent("get_started_click")}
          href="/auth/sign-in"
        >
          {text}
        </Button>
      </div>
    </>
  );
}
