import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) return JSON.parse(storagedCart);

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const cartProduct = cart.find((product) => product.id === productId);
      const cartAmount = cartProduct?.amount || 0;
      const { data: productStocks } = await api.get<Stock>(
        `/stock/${productId}`
      );
      const { data: product } = await api.get(`/products/${productId}`);

      if (!product) throw new Error("2");
      if (cartAmount >= productStocks.amount) throw new Error("1");

      if (cartProduct) {
        const newProduct = {
          ...cartProduct,
          amount: cartProduct.amount + 1,
        };
        const newCart = cart.map((product) =>
          product.id === productId ? newProduct : product
        );
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
        setCart(newCart);
      } else {
        const newCart = [...cart, { ...product, amount: 1 }];
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
        setCart(newCart);
      }
    } catch (err) {
      const errors: { [key: string]: string } = {
        "1": "Quantidade solicitada fora de estoque",
      };
      toast.error(errors[err.message] || "Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const product = cart.find((p) => p.id === productId);
      if (!product) throw new Error();

      const newCart = cart.filter((product) => product.id !== productId);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
      setCart(newCart);
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    if (amount <= 0) return;
    try {
      const cartProduct = cart.find((product) => product.id === productId);
      const { data: productStocks } = await api.get<Stock>(
        `/stock/${productId}`
      );

      if (amount > productStocks.amount) throw new Error("1");
      if (!cartProduct) throw new Error();

      const newProduct = { ...cartProduct, amount };

      const newCart = cart.map((product) =>
        product.id === productId ? newProduct : product
      );
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
      setCart(newCart);
    } catch (err) {
      const errors: { [key: string]: string } = {
        "1": "Quantidade solicitada fora de estoque",
      };
      
      toast.error(
        errors[err.message] || "Erro na alteração de quantidade do produto"
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
