import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Order } from '../../types/Order';
import { OrdersBoard } from '../OrdersBoard';
import { Container } from './styles';
import socketIo from 'socket.io-client';

export function Orders() {

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3333', {
      transports: ['websocket'],
    });
    socket.on('order@new', (order) => {
      setOrders(prevState => prevState.concat(order));
    });
  }, []);

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data);
    });
  }, []);

  const waitingOrders = orders.filter((order) => order.status === 'WAITING');
  const productionOrders = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const doneOrders = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) => prevState.filter(order => order._id !== orderId));
  }

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    setOrders((prevState) => prevState.map((order) => (
      order._id === orderId
        ? { ...order, status }
        : order
    )));
  }

  return (
    <Container>
      <OrdersBoard title='Fila de espera' icon='🕐' orders={waitingOrders} onCancelOrder={handleCancelOrder} onChangeOrderStatus={handleOrderStatusChange} />
      <OrdersBoard title='Em preparo' icon='⌛' orders={productionOrders} onCancelOrder={handleCancelOrder} onChangeOrderStatus={handleOrderStatusChange} />
      <OrdersBoard title='Pronto!' icon='✅' orders={doneOrders} onCancelOrder={handleCancelOrder} onChangeOrderStatus={handleOrderStatusChange} />
    </Container>
  );
}
