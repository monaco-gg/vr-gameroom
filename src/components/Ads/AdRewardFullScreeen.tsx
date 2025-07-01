import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: (isError: boolean) => void;
  onReward: (payload: googletag.RewardedPayload) => void;
};

declare global {
  namespace googletag {
    interface Slot {
      // Add any properties/methods you need, or use an empty interface if unknown
      [key: string]: any;
    }
    interface RewardedPayload {
      // Define the properties you expect from the payload, or use 'any' if unknown
      [key: string]: any;
    }
  }
  interface Window {
    googletag: any;
  }
}

export default function AdRewardedFullScreen({ isOpen, onClose, onReward }: Props) {
  
  const slotRef = useRef<googletag.Slot | null>(null);
  const closedRef = useRef(false);
  
  useEffect(() => {
    console.log("🔍 AdRewardedFullScreen useEffect triggered, isOpen:", isOpen);
    
    if (!isOpen) {
      console.log("🚫 Modal não está aberto, saindo...");
      return;
    }

    console.log("🚀 Iniciando carregamento do anúncio recompensado...");

    // Verifica se o adUnitPath está definido
    const adUnitPath = process.env.NEXT_PUBLIC_GOOGLE_AD_UNIT_PATH;
    
    if (!adUnitPath || adUnitPath.trim() === "") {
      console.error("❌ AdUnitPath não está definido. Verifique a variável de ambiente NEXT_PUBLIC_GOOGLE_AD_UNIT_PATH");
      throw new Error("AdUnitPath não está definido. Verifique a variável de ambiente NEXT_PUBLIC_GOOGLE_AD_UNIT_PATH");
    }
    else{
      console.log("✅ AdUnitPath está definido:", adUnitPath);
    }

    // Carrega o script GPT se ainda não estiver presente
    if (!window.googletag) {
      console.log("📥 Carregando script GPT...");
      const script = document.createElement("script");
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      script.onload = () => console.log("✅ Script GPT carregado com sucesso");
      script.onerror = () => console.error("❌ Erro ao carregar script GPT");
      document.head.appendChild(script);
    } else {
      console.log("✅ Script GPT já está carregado");
    }

    const initRewardedAd = () => {
      console.log("🔧 Inicializando anúncio recompensado...");
      window.googletag = window.googletag || { cmd: [] };

      window.googletag.cmd.push(() => {
        console.log("📋 Executando comando GPT...");
        console.log("🎯 Definindo slot com adUnitPath:", adUnitPath);
        
        const rewardedSlot = window.googletag.defineOutOfPageSlot(
          adUnitPath,
          window.googletag.enums.OutOfPageFormat.REWARDED
        );

        if (!rewardedSlot) {
          console.error("❌ Rewarded ad não suportado ou erro na definição do slot");
          onClose(true);
          return;
        }

        console.log("✅ Slot recompensado criado com sucesso:", rewardedSlot);
        slotRef.current = rewardedSlot;

        console.log("🔗 Adicionando serviço pubads...");
        rewardedSlot.addService(window.googletag.pubads());

        window.googletag.pubads().addEventListener("rewardedSlotReady", (event: any) => {
          console.log("📺 Anúncio pronto, exibindo...", event);
          event.makeRewardedVisible();
        });

        window.googletag.pubads().addEventListener("rewardedSlotGranted", (event: any) => {
          console.log("🎉 Recompensa concedida:", event.payload);
          onReward(event.payload);
          if (!closedRef.current) {
            closedRef.current = true;
            onClose(false);
          }
        });

        window.googletag.pubads().addEventListener("rewardedSlotClosed", () => {
          console.log("🛑 Anúncio fechado.");
          if (!closedRef.current) {
            closedRef.current = true;
            onClose(false);
          }
        });

        console.log("🚀 Habilitando serviços e exibindo anúncio...");
        window.googletag.enableServices();
        window.googletag.display(rewardedSlot);
      });
    };

    // Espera o script GPT carregar
    console.log("⏳ Aguardando API GPT ficar pronta...");
    let attempts = 0;
    const maxAttempts = 30; // 3 segundos máximo
    
    const interval = setInterval(() => {
      attempts++;
      console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - googletag.apiReady:`, window.googletag?.apiReady);
      
      if (window.googletag?.apiReady) {
        console.log("✅ API GPT pronta, iniciando anúncio...");
        clearInterval(interval);
        initRewardedAd();
      } else if (attempts >= maxAttempts) {
        console.error("❌ Timeout: API GPT não ficou pronta em 3 segundos");
        clearInterval(interval);
        onClose(true);
      }
    }, 100);

    return () => {
      console.log("🧹 Cleanup: Limpando recursos do anúncio...");
      clearInterval(interval);

      if (slotRef.current) {
        console.log("🗑️ Destruindo slot do anúncio...");
        window.googletag.destroySlots([slotRef.current]);
        slotRef.current = null;
      }
    };
  }, [isOpen, onClose, onReward]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="text-white text-lg">Carregando anúncio recompensado...</div>
    </div>
  );
}
