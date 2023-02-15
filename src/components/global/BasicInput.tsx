import React, { InputHTMLAttributes } from 'react'
import classNames from "classnames"

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string,
    textarea?: boolean
    error?: string
    helpText?: string
    labelHide?: boolean
    wrapperClassname?: string
}

export default function BasicInput( props: BasicInputProps ){
    let { label, name, textarea, className = '', type = 'text', error, helpText, labelHide = false, ...rest } = props
    if( className ){
        className = 'block w-full outline-none py-2 px-3 rounded-lg border-2 border-blue-50 focus:border-blue-300 ' + className
    } else{
        className = 'block w-full outline-none py-2 px-3 rounded-lg border-2 border-blue-50 focus:border-blue-300'
    }
    const id = name ? name : label.replace( ' ', '' )

    return (
        <div className={ classNames( "mb-2 md:mb-4", props.wrapperClassname ) }>
            { ! labelHide || helpText ? (
                <div className="mb-2">
                    { ! labelHide ? <label htmlFor={ id } className="font-medium text-gray-800 cursor-pointer block">
                        { label }
                    </label> : null }
                    { helpText ? <p className="text-gray-400 text-xs mb-3">{ helpText }</p> : null }
                </div>
            ) : null }
            <div>
                { ! textarea ? (
                    <input id={ id } type={ type } className={ className } name={ name }
                           placeholder={ label }  { ...rest }/>
                ) : (
                    <textarea id={ id } className={ className } name={ name } placeholder={ label } { ...rest }/>
                ) }
                { error ? (
                    <p className="font-medium text-red-600 text-[12px]">
                        { error }
                    </p>
                ) : null }
            </div>
        </div>
    )
}