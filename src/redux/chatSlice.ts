import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

type ConvertTime = (timeString: string | number) => string;

export interface MsgDataPayload {
  message: string;
  user: string;
}
export interface MessageModified extends MsgDataPayload {
  id: string;
}
export interface MessagesChat extends MessageModified {
  hourAndMinutes: string;
  addTime: number;
}
export interface ChatAppData {
  msgsChat: MessagesChat[];
}

const initialState: ChatAppData = {
  msgsChat: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getMsg(state) {
      state.msgsChat = state.msgsChat.sort((a, b) => b.addTime - a.addTime);
    },
    addMsg(state, action: PayloadAction<MsgDataPayload>) {
      const convertTime: ConvertTime = (timeString) => {
        const formatTwoNums: (num: number) => string = (num) => {
          const checkLength = num.toString().length === 1;
          return checkLength ? `0${num}` : `${num}`;
        };
        const timeToDate = new Date(Number(timeString));
        const hourOfTime = formatTwoNums(timeToDate.getHours());
        const minOfTime = formatTwoNums(timeToDate.getMinutes());
        return `${hourOfTime}:${minOfTime}`;
      };
      const timeMilisec = new Date().getTime();

      state.msgsChat.push({
        id: uuidv4(),
        message: action.payload.message,
        user: action.payload.user,
        addTime: timeMilisec,
        hourAndMinutes: convertTime(timeMilisec),
      });
      state.msgsChat = state.msgsChat.sort((a, b) => b.addTime - a.addTime);
    },
    deleteMsg(state, action: PayloadAction<string>) {
      const msgFiltered = state.msgsChat.filter(
        (msg) => msg.id !== action.payload
      );
      state.msgsChat = msgFiltered.sort((a, b) => b.addTime - a.addTime);
    },
    updateMsg(state, action: PayloadAction<MessageModified>) {
      const msgIndex = state.msgsChat.findIndex(
        (msg) => msg.id === action.payload.id
      );
      if (msgIndex >= 0) {
        const msgToUpdate = state.msgsChat[msgIndex];
        if (msgToUpdate) {
          msgToUpdate.message = action.payload.message;
          state.msgsChat[msgIndex] = msgToUpdate;
        }
      }
    },
  },
});

export const { addMsg, deleteMsg, updateMsg, getMsg } = chatSlice.actions;
export default chatSlice.reducer;