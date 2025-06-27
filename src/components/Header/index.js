import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import Image from "next/legacy/image";

export default function Header() {
  return (
    <Navbar className="bg-transparent">
      <NavbarContent>
        <NavbarBrand>
          <Image
            src="/monaco.png"
            width={32}
            height={32}
            alt={"Logo"}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p className="font-archivo font-semibold text-inherit ml-2">Monaco</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="default"
            radius="md"
            href="/auth/sign-in"
            variant="bordered"
            className="font-archivo"
          >
            Entrar
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
