import { useState, useEffect } from "react";
import request from "@utils/api";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await request(`/orders`, "GET", undefined, {}, true);

        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          throw new Error("Resposta da API não está no formato esperado");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Ocorreu um erro ao buscar os pedidos")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
};
