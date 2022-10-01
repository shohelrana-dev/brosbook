import Router                                         from 'next/router'
import { GetServerSidePropsContext, NextPageContext } from "next"

export default function redirect ( ctx: GetServerSidePropsContext, target: string ) {
    if( ctx.res ){
        ctx.res.writeHead( 303, { Location: target } )
        ctx.res.end()
    } else{
        void Router.push( target )
    }
}