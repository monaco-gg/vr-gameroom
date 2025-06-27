/**
 * Generates a random default community name in Portuguese
 * @returns {string} A random community name
 */
export function generateCommunityName(): string {
  const adjectives: string[] = [
    "Épicos",
    "Lendários",
    "Incríveis",
    "Poderosos",
    "Invencíveis",
    "Rápidos",
    "Corajosos",
    "Ferozes",
    "Habilidosos",
    "Extremos",
    "Invictos",
    "Potentes",
    "Supremos",
    "Elite",
    "Insuperáveis",
  ];

  const nouns: string[] = [
    "Campeões",
    "Guerreiros",
    "Titãs",
    "Lendas",
    "Heróis",
    "Gladiadores",
    "Mestres",
    "Especialistas",
    "Magos",
    "Ninjas",
    "Comandantes",
    "Conquistadores",
    "Dominadores",
    "Desafiantes",
    "Vencedores",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
}

/**
 * Generates a unique invitation code
 * @returns {string} A unique invitation code
 */
export function generateInvitationCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding confusing characters like 0, O, 1, I
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a deep link URL for community invitation
 * @param {string} code - The invitation code
 * @returns {string} A deep link URL
 */
export function generateInvitationLink(code: string): string {
  // Base URL should be configurable via environment variables
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://games.monaco.gg";
  return `${baseUrl}/room/community/join?code=${code}`;
}

/**
 * Generates a WhatsApp sharing link with invitation message
 * @param {string} code - The invitation code
 * @param {string} communityName - The name of the community
 * @returns {string} A WhatsApp sharing link
 */
export function generateWhatsAppInvitationLink(
  code: string,
  communityName: string
): string {
  const invitationLink = generateInvitationLink(code);
  const message = encodeURIComponent(
    `Junte-se à minha comunidade "${communityName}" no Game Room! Vamos competir juntos nos rankings. Use este link: ${invitationLink}`
  );
  return `https://wa.me/?text=${message}`;
}
