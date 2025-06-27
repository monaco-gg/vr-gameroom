import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Community from "@models/Community";
import CommunityInvitation from "@models/CommunityInvitation";
import User from "@models/User";
import { getServerSession } from "next-auth/next";
import {
  generateCommunityName,
  generateInvitationCode,
  generateWhatsAppInvitationLink,
} from "@utils/community";

/**
 * Handles GET request to retrieve user's community
 * @param req - The request object
 * @param userId - The ID of the user
 * @returns A response with the user's community or an error
 */
async function handleGetCommunity(req: NextRequest, userId: string) {
  try {
    await dbConnect();

    // Check if the user is already in a community
    const userCommunity = await Community.findOne({
      members: userId,
    }).populate("members", "name nickname photo email");

    if (!userCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário não está em nenhuma comunidade" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: userCommunity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST request to create a new community
 * @param req - The request object
 * @param userId - The ID of the user
 * @returns A response with the created community or an error
 */
async function handleCreateCommunity(req: NextRequest, userId: string) {
  try {
    await dbConnect();

    // Check if the user is already in a community
    const existingCommunity = await Community.findOne({
      members: userId,
    });

    if (existingCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário já está em uma comunidade" },
        { status: 400 }
      );
    }

    // Create a new community
    const communityName = generateCommunityName();
    const newCommunity = await Community.create({
      name: communityName,
      creator: userId,
      members: [userId],
    });

    // Populate the members field with user data
    const populatedCommunity = await Community.findById(
      newCommunity._id
    ).populate("members", "name nickname photo email");

    return NextResponse.json(
      {
        success: true,
        message: "Comunidade criada com sucesso",
        data: populatedCommunity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST request to create a new invitation
 * @param req - The request object
 * @param userId - The ID of the user
 * @returns A response with the created invitation or an error
 */
async function handleCreateInvitation(req: NextRequest, userId: string) {
  try {
    await dbConnect();

    // Find the user's community
    const userCommunity = await Community.findOne({
      members: userId,
    });

    if (!userCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário não está em nenhuma comunidade" },
        { status: 404 }
      );
    }

    // Check if the community already has 10 members
    if (userCommunity.members.length >= 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A comunidade atingiu o limite máximo de membros",
        },
        { status: 400 }
      );
    }

    // Verificar se já existe um convite ativo para esta comunidade
    const existingInvitation = await CommunityInvitation.findOne({
      community: userCommunity._id,
      expiresAt: { $gt: new Date() },
    }).sort({ expiresAt: -1 }); // Pegar o que tem a data de expiração mais distante

    if (existingInvitation) {
      // Retornar o convite existente
      const whatsappLink = generateWhatsAppInvitationLink(
        existingInvitation.code,
        userCommunity.name
      );

      return NextResponse.json(
        {
          success: true,
          message: "Convite já existente recuperado com sucesso",
          data: {
            code: existingInvitation.code,
            expiresAt: existingInvitation.expiresAt,
            whatsappLink,
            usageCount: existingInvitation.usageCount || 0,
          },
        },
        { status: 200 }
      );
    }

    // Se não existir convite ativo, criar um novo
    const invitationCode = generateInvitationCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Expire in 48 hours

    const newInvitation = await CommunityInvitation.create({
      community: userCommunity._id,
      inviter: userId,
      code: invitationCode,
      expiresAt,
      usageCount: 0,
    });

    // Generate WhatsApp sharing link
    const whatsappLink = generateWhatsAppInvitationLink(
      invitationCode,
      userCommunity.name
    );

    return NextResponse.json(
      {
        success: true,
        message: "Convite criado com sucesso",
        data: {
          code: newInvitation.code,
          expiresAt: newInvitation.expiresAt,
          whatsappLink,
          usageCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST request to join a community using an invitation code
 * @param req - The request object
 * @param userId - The ID of the user
 * @returns A response with the joined community or an error
 */
async function handleJoinCommunity(req: NextRequest, userId: string) {
  try {
    // Tentar obter o código de dois lugares:
    // 1. Dos parâmetros da URL
    const url = new URL(req.url);
    let code = url.searchParams.get("code");

    // 2. Do corpo da requisição (caso o cliente envie dessa forma)
    if (!code) {
      try {
        // Clonar a requisição para não consumi-la
        const reqClone = req.clone();
        const body = await reqClone.json();
        if (body && body.code) {
          code = body.code;
        }
      } catch (err) {
        // Ignorar erros de parsing do body
        console.error("Error parsing request body:", err);
      }
    }

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Código de convite é obrigatório" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the user is already in a community
    const existingCommunity = await Community.findOne({
      members: userId,
    });

    if (existingCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário já está em uma comunidade" },
        { status: 400 }
      );
    }

    // Find the invitation - sem verificar se está usado, apenas se é válido pela data
    const invitation = await CommunityInvitation.findOne({
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, message: "Código de convite inválido ou expirado" },
        { status: 400 }
      );
    }

    // Find the community
    const community = await Community.findById(invitation.community);

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Comunidade não encontrada" },
        { status: 404 }
      );
    }

    // Check if the community already has 10 members
    if (community.members.length >= 10) {
      return NextResponse.json(
        {
          success: false,
          message: "A comunidade atingiu o limite máximo de membros",
        },
        { status: 400 }
      );
    }

    // Add the user to the community
    community.members.push(userId);
    await community.save();

    // Incrementar o contador de uso do convite em vez de marcá-lo como usado
    invitation.usageCount = (invitation.usageCount || 0) + 1;
    await invitation.save();

    // Populate the members field with user data
    const populatedCommunity = await Community.findById(community._id).populate(
      "members",
      "name nickname photo email"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Entrou na comunidade com sucesso",
        data: populatedCommunity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST request to leave a community
 * @param req - The request object
 * @param userId - The ID of the user
 * @returns A response with the result of leaving the community
 */
async function handleLeaveCommunity(req: NextRequest, userId: string) {
  try {
    await dbConnect();

    // Find the user's community
    const userCommunity = await Community.findOne({
      members: userId,
    });

    if (!userCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário não está em nenhuma comunidade" },
        { status: 404 }
      );
    }

    // Remove the user from the community
    userCommunity.members = userCommunity.members.filter(
      (memberId: { toString: () => string }) => memberId.toString() !== userId
    );

    // If the community is empty, delete it
    if (userCommunity.members.length === 0) {
      await Community.findByIdAndDelete(userCommunity._id);
      return NextResponse.json(
        {
          success: true,
          message: "Saiu da comunidade e a comunidade foi excluída com sucesso",
        },
        { status: 200 }
      );
    }

    // If the user is the creator, transfer ownership to the oldest member
    if (
      userCommunity.creator.toString() === userId &&
      userCommunity.members.length > 0
    ) {
      userCommunity.creator = userCommunity.members[0];
    }

    await userCommunity.save();

    return NextResponse.json(
      {
        success: true,
        message: "Saiu da comunidade com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for community endpoint
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Autenticação necessária" },
      { status: 401 }
    );
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email não encontrado na sessão" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return handleGetCommunity(req, user._id.toString());
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for community endpoint
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Autenticação necessária" },
      { status: 401 }
    );
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email não encontrado na sessão" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Obter ação do body apenas uma vez para evitar consumir o body múltiplas vezes
    let action: string | undefined;

    try {
      const reqClone = req.clone();
      const body = await reqClone.json();
      action = body.action;
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { success: false, message: "Formato de requisição inválido" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Ação é obrigatória" },
        { status: 400 }
      );
    }

    const userId = user._id.toString();

    switch (action) {
      case "create":
        return handleCreateCommunity(req, userId);
      case "invite":
        return handleCreateInvitation(req, userId);
      case "join":
        return handleJoinCommunity(req, userId);
      case "leave":
        return handleLeaveCommunity(req, userId);
      default:
        return NextResponse.json(
          { success: false, message: "Ação inválida" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
