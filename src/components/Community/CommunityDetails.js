// components/Community/CommunityDetails.js
import React from "react";
import { Card, Button, Avatar, Tooltip, Badge } from "@nextui-org/react";
import { UsersIcon } from "@heroicons/react/24/outline";

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
            <Avatar
              key={member._id}
              showFallback
              src={member.photo}
              alt="Avatar"
              fallback={
                <p className="text-2xl">{member.nickname[0].toUpperCase()}</p>
              }
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
