import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  Progress,
  Badge
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import confetti from "canvas-confetti";

const ModalSpecialOffer = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  // Removido o estado de tempo
  const [showPulse, setShowPulse] = useState(false);
  const router = useRouter();
  
  // Efeito confetti aprimorado
  useEffect(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const coin = confetti.shapeFromText({ text: "🟡", scalar: 2 });
    const star = confetti.shapeFromText({ text: "⭐", scalar: 2 });
    
    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    
    // Função para criar um efeito confetti mais dramático
    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 2;
      
      confetti({
        shapes: [coin, star],
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347'],
        scalar: randomInRange(1, 3),
      });
      
      requestAnimationFrame(frame);
    };
    
    frame();
    
    // Pulsar o botão a cada 3 segundos
    const pulseInterval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 3000);
    
    return () => {
      clearInterval(pulseInterval);
    };
  }, []);
  
  // Funções de tempo removidas
  
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  
  const handleOfferClick = () => {
    console.log("Special offer CTA clicked");
    
    // Efeito adicional de confetti quando clica no botão
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 }
    });
    
    handleClose();
    router.push("/room/store?coupon=MONACO30");
  };
  
  return (
    <Modal
      isOpen={isVisible}
      placement="center"
      backdrop="blur"
      onClose={handleClose}
      className="light-shadow"
      size="lg"
    >
      <ModalContent className="border-4 border-yellow-500 bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
        {/* Banner promocional */}
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center py-1 transform -translate-y-full">
          <div className="flex items-center justify-center">
            <span className="mr-2">🎁</span> 
            <span>Oferta Especial</span>
          </div>
        </div>
        
        <ModalHeader className="flex flex-col items-center gap-1 text-center pb-0">
          <h3 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
            OFERTA ESPECIAL
          </h3>
          <div className="absolute top-24 transform -translate-x-1/2 -translate-y-8 bg-yellow-500 text-black font-bold px-4 py-1 rounded-full animate-bounce">
              30% OFF
            </div>
        </ModalHeader>
        
        <ModalBody className="py-5">
          <div className="flex justify-center mb-2 relative">
            
            <div className="relative">
              <Image
                src="/imgs/chest_special_offer_christmas.png"
                alt="Treasure Chest"
                width={300}
                height={300}
                className="drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          <div className="bg-indigo-800 p-4 rounded-lg mb-4 border border-indigo-600">
            <p className="text-center text-xl mb-2">
              Use o cupom <span className="font-bold text-yellow-300 text-2xl">MONACO30</span>
            </p>
            <p className="text-center text-sm opacity-80">
              Válido para qualquer compra em nossa loja!
            </p>
          </div>
          
          {/* Seção do contador removida */}
        </ModalBody>
        
        <ModalFooter className="flex flex-col items-center">
          <Button
            className={`w-full py-6 text-xl font-bold ${showPulse ? 'animate-pulse scale-105' : ''}`}
            radius="md"
            color="warning"
            variant="shadow"
            onClick={handleOfferClick}
            onPress={handleOfferClick}
          >
            APROVEITAR AGORA
          </Button>
          
          <p className="text-center text-xs mt-3 opacity-75">
            *Não acumula com outros descontos.
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalSpecialOffer;