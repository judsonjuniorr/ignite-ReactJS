import logo from "../../assets/logo.svg";

import * as S from "./styles";

interface IHeaderProps {
  onOpenNewTransactionModal: () => void;
}

export function Header({onOpenNewTransactionModal}: IHeaderProps) {
  return (
    <S.Container>
      <S.Content>
        <img src={logo} alt="dt money" />
        <button type="button" onClick={onOpenNewTransactionModal}>
          Nova transação
        </button>
      </S.Content>
    </S.Container>
  );
}
