import tw from "twin.macro"
import { Box as BaseBox } from "./Global.styles"

export const Wrapper   = tw.div`relative z-50`
export const Box       = tw( BaseBox )`p-8 border-gray-200 rounded-2xl`
export const FooterBox = tw( Box )`text-center mt-2 text-gray-800 [a]:(text-blue-500 font-medium)`
export const Icon      = tw.div`flex justify-center mb-2`
export const Heading   = tw.h1`text-xl text-center mb-4 font-medium`
export const Describe  = tw.small`block text-gray-500 text-center mb-2`