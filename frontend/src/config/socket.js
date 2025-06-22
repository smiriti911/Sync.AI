import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  if (!socketInstance) {
    socketInstance = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },

      query: {
        projectId: projectId,
      },
    });
  }
  return socketInstance;
};

export const receiveMessage= (eventName, callback)=>{
  socketInstance.on(eventName, callback);
}


export const sendMessage= (eventName, data)=>{
  socketInstance.emit(eventName, data);
}
