import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const ModalNotification = ({ totalSteps, stepContent, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom-center"
      hideCloseButton={true}
      backdrop="blur"
    >
      <ModalContent>
        <div className="ml-6 mt-6">{stepContent[currentStep].label}</div>
        <ModalHeader className="flex flex-col gap-1 text-3xl">
          {stepContent[currentStep].title}
        </ModalHeader>
        <ModalBody>
          {stepContent[currentStep].texts.map((text, index) => (
            <p key={index} className="text-base text-gray-400">
              <a className="text-indigo-600">✦ </a>
              {text}
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col w-full">
            {stepContent[currentStep].extraButtons &&
              stepContent[currentStep].extraButtons.map((button, index) => (
                <Button
                  radius="md"
                  key={index}
                  color={button.color || "primary"}
                  onPress={button.onClick}
                  className={button.className}
                >
                  {button.text}
                </Button>
              ))}
            <Button
              className="w-full mb-4"
              radius="md"
              color={stepContent[currentStep].buttonColor || "default"}
              onPress={nextStep}
            >
              {stepContent[currentStep].buttonText}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ModalNotification;
