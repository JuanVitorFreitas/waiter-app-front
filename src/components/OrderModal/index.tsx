import { ModalBody, OrderDetails, Overlay, Actions } from './styles';
import closeIcon from '../../assets/images/close-icon.svg';
import { Order } from '../../types/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import React, { useEffect } from 'react';

export interface OrderModalProps {
  visible: boolean;
  order: Order | null;
  isLoading: boolean;
  onCancelOrder: () => Promise<void>;
  onClose: () => void;
  onChangeOrderStatus: () => void;

}

export function OrderModal({ visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus }: OrderModalProps) {

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyPress);

    return (() => document.removeEventListener('keydown', handleKeyPress));
  }, []);

  if (!visible || !order) {
    return null;
  }

  const total = order.products.reduce((total, { product, quantity }) => {
    return total + (product.price * quantity);
  }, 0);

  function handleClickOverlay(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if ((e.target as HTMLDivElement).id === 'overlay') {
      onClose();
    }
  }

  return (
    <Overlay onClick={handleClickOverlay} id='overlay'>
      <ModalBody>

        <header>
          <strong>Mesa {order.table}</strong>
          <button type='button' onClick={onClose}>
            <img src={closeIcon} alt='Ícone de fechar' />
          </button>
        </header>

        <div className="status-container">
          <small>Status do pedido</small>
          <div>
            <span>
              {order.status === 'WAITING' && '🕐'}
              {order.status === 'IN_PRODUCTION' && '👨‍🍳'}
              {order.status === 'DONE' && '✅'}
            </span>
            <strong>
              {order.status === 'WAITING' && 'Fila de espera'}
              {order.status === 'IN_PRODUCTION' && 'Em produção'}
              {order.status === 'DONE' && 'Pronto!'}
            </strong>
          </div>
        </div>

        <OrderDetails>
          <strong>Itens</strong>
          <div className="order-items">
            {order.products.map(({ _id, product, quantity }) => (
              <div className="item" key={_id}>
                <img
                  width="56"
                  height="28.51"
                  src={`http://localhost:3333/uploads/${product.imagePath}`}
                  alt={product.name}
                />

                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

        </OrderDetails>

        {order.status !== 'DONE' && (
          <Actions>
            <button type='button' className='primary' disabled={isLoading} onClick={onChangeOrderStatus}>
              <span>{order.status === 'WAITING' ? '👨‍🍳' : '✅'}</span>
              <strong>{order.status === 'WAITING' ? 'Mover para produção' : 'Concluir Pedido'}</strong>
            </button>

            <button type='button' className='secondary' onClick={onCancelOrder} disabled={isLoading}>
              Cancelar pedido
            </button>
          </Actions>
        )}

      </ModalBody>
    </Overlay>
  );
}
