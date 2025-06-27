import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Ticket from "@models/Ticket";
import Community from "@models/Community";
import User from "@models/User";
import { getServerSession } from "next-auth/next";
import { isValidISO8601Date, isStartDateBeforeEndDate } from "@utils/index";
import { Types } from "mongoose";

// Definir interface para o objeto Community
interface ICommunity {
  _id: Types.ObjectId;
  name: string;
  creator: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

// Interface para um membro populado
interface IMember {
  _id: Types.ObjectId;
  name?: string;
  nickname?: string;
  photo?: string;
  email?: string;
}

// Interface para community com membros populados
interface ICommunityPopulated extends Omit<ICommunity, "members"> {
  members: IMember[];
}

/**
 * Handle GET request to retrieve community ranking information.
 *
 * @param {string} communityId - The ID of the community
 * @param {string} [gameId] - The gameId to filter tickets
 * @param {string} [startDate] - The start date for the date range filter
 * @param {string} [endDate] - The end date for the date range filter
 * @returns {Promise<NextResponse>}
 */
async function handleGetCommunityRanking(
  communityId: string,
  gameId?: string,
  startDate?: string,
  endDate?: string
): Promise<NextResponse> {
  await dbConnect();

  try {
    // Buscar a comunidade para obter seus membros
    const community = await Community.findById(communityId)
      .populate("members", "name nickname photo email")
      .lean();

    if (!community) {
      return NextResponse.json(
        { success: false, message: "Comunidade não encontrada" },
        { status: 404 }
      );
    }

    // Tratando o resultado como ICommunityPopulated para garantir a tipagem correta
    const typedCommunity = community as unknown as ICommunityPopulated;

    // Criar um array com os IDs dos membros
    const memberIds = typedCommunity.members.map((member) => member._id);

    // Preparar o estágio de match para o aggregation
    const matchStage: any = {};

    // Limitar aos usuários da comunidade
    matchStage.user = { $in: memberIds };

    // Filtrar por jogo, se especificado
    if (gameId) {
      matchStage.gameId = gameId;
    }

    // Filtrar por data, se especificada
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Executar a agregação para calcular o ranking
    const tickets = await Ticket.aggregate(
      [
        // Filtrar os tickets pelos critérios definidos
        { $match: matchStage },

        // Agrupar por usuário e calcular totais
        {
          $group: {
            _id: "$user",
            totalMatches: {
              $sum: {
                $cond: [{ $ifNull: ["$gameId", false] }, 1, 0],
              },
            },
            totalTickets: { $sum: "$amount" },
            createdAt: { $first: "$createdAt" },
          },
        },

        // Remodelar a saída
        {
          $project: {
            _id: 0,
            user: "$_id",
            totalMatches: 1,
            totalTickets: 1,
            createdAt: 1,
          },
        },

        // Fazer o lookup para os dados do usuário
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  photo: 1,
                  nickname: 1,
                  email: 1,
                  name: 1,
                },
              },
            ],
            as: "user",
          },
        },

        // Desenrolar o array de usuário
        { $unwind: "$user" },

        // Ordenar por pontuação (tickets, partidas e data de criação)
        {
          $sort: {
            totalTickets: -1,
            totalMatches: -1,
            createdAt: 1,
          },
        },

        // Preparar para atribuir rankings
        {
          $group: {
            _id: null,
            allDocs: { $push: "$$ROOT" },
          },
        },

        // Atribuir rankings
        {
          $project: {
            rankedDocs: {
              $map: {
                input: "$allDocs",
                as: "doc",
                in: {
                  $mergeObjects: [
                    "$$doc",
                    { rank: { $indexOfArray: ["$allDocs", "$$doc"] } },
                  ],
                },
              },
            },
          },
        },

        // Desenrolar os documentos ranqueados
        { $unwind: "$rankedDocs" },

        // Colocar os documentos ranqueados como raiz
        { $replaceRoot: { newRoot: "$rankedDocs" } },

        // Ajustar o ranking para começar em 1 em vez de 0
        { $addFields: { rank: { $add: ["$rank", 1] } } },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    );

    // Preparar informações sobre a comunidade para incluir na resposta
    const communityInfo = {
      _id: typedCommunity._id,
      name: typedCommunity.name,
      memberCount: typedCommunity.members.length,
      creator: typedCommunity.creator,
    };

    // Retornar os resultados
    return NextResponse.json(
      {
        success: true,
        data: tickets,
        community: communityInfo,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving community ranking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for community ranking endpoint
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Autenticação necessária" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Buscar a comunidade do usuário
    const userCommunity = await Community.findOne({
      members: user._id,
    });

    if (!userCommunity) {
      return NextResponse.json(
        { success: false, message: "Usuário não está em nenhuma comunidade" },
        { status: 404 }
      );
    }

    // Obter parâmetros da query
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    // Validar parâmetros
    if (startDate && !isValidISO8601Date(startDate)) {
      return NextResponse.json(
        { success: false, message: "Formato de data inicial inválido" },
        { status: 400 }
      );
    }

    if (endDate && !isValidISO8601Date(endDate)) {
      return NextResponse.json(
        { success: false, message: "Formato de data final inválido" },
        { status: 400 }
      );
    }

    if (startDate && endDate && !isStartDateBeforeEndDate(startDate, endDate)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data inicial não pode ser depois da data final",
        },
        { status: 400 }
      );
    }

    // Obter e retornar o ranking da comunidade
    return handleGetCommunityRanking(
      userCommunity._id.toString(),
      gameId,
      startDate,
      endDate
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
 * POST handler for community ranking endpoint - Método não permitido
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, message: "Método não permitido" },
    { status: 405 }
  );
}
