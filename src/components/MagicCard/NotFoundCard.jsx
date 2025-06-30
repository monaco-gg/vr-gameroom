import { Button, Link } from "@nextui-org/react";
import CardEffect from "./CardEffect";

export default function NotFoundCard() {
  return (
    <div className="flex flex-col justify-center items-center h-screen -mt-10">
      <CardEffect front="/imgs/interface/notfound.png" />
      <div>
        <Button as={Link} href="/room/catalog" variant="ghost" radius="md" 
        //color="primary"
        className="mt-4 bg-primary hover:bg-opacity-80 focus-visible:outline-primary"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
