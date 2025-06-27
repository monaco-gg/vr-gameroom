import { useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import {
  isValidNickname,
  isValidDateOfBirth,
  isValidPhoneNumber,
} from "@utils/index";

export function useFormValidation(
  initialValues = {
    nickname: "",
    dateOfBirth: "",
    phoneNumber: "",
  }
) {
  const [fields, setFields] = useState(initialValues);
  const [errors, setErrors] = useState({
    nickname: "",
    dateOfBirth: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    nickname: false,
    dateOfBirth: false,
    phoneNumber: false,
  });

  const validateField = useCallback((field, value) => {
    let error = "";
    if (!value.trim()) {
      error = "Este campo é obrigatório.";
    } else {
      switch (field) {
        case "nickname":
          error = isValidNickname(value)
            ? ""
            : "Nickname inválido, use apenas letras e números.";
          break;
        case "dateOfBirth":
          error = isValidDateOfBirth(value)
            ? ""
            : "Data de nascimento inválida, use o formato DD/MM/AAAA.";
          break;
        case "phoneNumber":
          error = isValidPhoneNumber(value)
            ? ""
            : "Número de telefone inválido.";
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const debouncedValidateField = useMemo(
    () => debounce(validateField, 300),
    [validateField]
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setFields((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        debouncedValidateField(field, value);
      }
    },
    [debouncedValidateField, touched]
  );

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      debouncedValidateField.cancel(); // Cancela qualquer ação debounced pendente
      validateField(field, fields[field]);
    },
    [validateField, fields, debouncedValidateField]
  );

  return {
    fields,
    errors,
    handleInputChange,
    handleBlur,
  };
}
