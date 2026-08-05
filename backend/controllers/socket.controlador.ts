import { Server, Socket } from 'socket.io';
import { AppDataSource } from '../data-source';
import { Notificacion } from '../../src/entities/Notificacion';
import { triggerUnifiedWebhook } from '../utils/n8n-client';

export const handleSocketEvents = (io: Server, socket: Socket) => {
  const user = (socket as any).user;
  if (user) {
      const { id: userId, rol: role, nombre: name, correo: email } = user;
      (socket as any).userName = name;
      (socket as any).userRole = role;
      (socket as any).userEmail = email;
      if (role === 'SuperUsuario' || role === 'Admin_Labs' || role === 'Admin_Acade' || role === 'Admin') {
        socket.join('admins');
      }
      if (userId) {
        socket.join(`user_${userId}`);
      }
  }

  socket.on('join', (data) => {
    const { userId, role, name } = data;
    (socket as any).userName = name; 
    (socket as any).userRole = role;
    if (role === 'Admin' || role === 'SuperUsuario') {
      socket.join('admins');
    }
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
};
