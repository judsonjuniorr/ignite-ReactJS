import { createContext, ReactNode } from "react";
import { useEffect, useState } from "react";

import { api } from "./services/api";

interface ITransaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

type ITransactionInput = Omit<ITransaction, "id" | "createdAt">;

interface ITransactionsProviderProps {
  children: ReactNode;
}

interface ITransactionsContext {
  transactions: ITransaction[];
  createTransaction: (transaction: ITransactionInput) => void;
}

export const TransactionsContext = createContext<ITransactionsContext>(
  {} as ITransactionsContext
);

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    api
      .get("transactions")
      .then(({ data }) => setTransactions(data.transactions));
  }, []);

  function createTransaction(transaction: ITransactionInput) {
    api.post("/transactions", transaction);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}
