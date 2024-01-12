import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'
import { RootState } from '~/store/index'

const initialState: Socket | null = null
export const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setSocket: (state, { payload }: PayloadAction<Socket>) => {
			state = payload as any
		},
	},
})
export const selectSocket = (state: RootState) => state.socket

export const { setSocket } = socketSlice.actions
