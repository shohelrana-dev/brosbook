import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { RootState } from '~/store/index'

const initialState: { socket: Socket | null } = { socket: null }

export const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		addedSocket: (state, { payload }: PayloadAction<Socket>) => {
			state.socket = payload as any
		},
		removedSocket: state => {
			state.socket = null
		},
	},
})
export const selectSocket = (state: RootState) => state.socket.socket

export const useSocket = (): Socket | null => useSelector(selectSocket)

export const { addedSocket, removedSocket } = socketSlice.actions
