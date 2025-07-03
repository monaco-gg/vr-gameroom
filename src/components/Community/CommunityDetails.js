// components/Community/CommunityDetails.js
import React from "react";
import { Card, Button, Tooltip, Badge } from "@nextui-org/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import UserAvatar from "@components/UserAvatar";

const CommunityDetails = ({ community, onLeaveCommunity }) => {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{community.name}</h2>
        <Badge
          content={community.members.length}
          color={community.members.length >= 10 ? "danger" : "primary"}
          placement="top-right"
        >
          <UsersIcon className="w-6 h-6" />
        </Badge>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">
          Membros ({community.members.length}/10)
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {community.members.map((member) => (
            <UserAvatar
              key={member._id}
              user={{
                name: member.nickname || member.name,
                image: member.photo
              }}
              size={40}
              className="rounded-full"
              fallbackClassName="rounded-full"
            />
          ))}
        </div>
      </div>

      <Button
        color="danger"
        variant="flat"
        onPress={onLeaveCommunity}
        className="w-full rounded-full"
      >
        Sair da Comunidade
      </Button>
    </Card>
  );
};

export default CommunityDetails;
