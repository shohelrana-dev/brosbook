import React, { InputHTMLAttributes } from 'react'

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string,
    textarea?: boolean
    error?: string
    helpText?: string
    labelHide?: boolean
}

export default function BasicInput( props: BasicInputProps ) {
    let { label, name, textarea, className = '', type='text', error, helpText, labelHide= false, ...rest } = props
    if ( className ) {
        className = 'block w-full outline-none py-2 px-3 rounded-lg border-2 border-blue-50 focus:border-blue-300 ' + className
    } else {
        className = 'block w-full outline-none py-2 px-3 rounded-lg border-2 border-blue-50 focus:border-blue-300'
    }
    const id = name ? name : label.replace(' ', '')

    return (
        <div className="mb-2 md:mb-4">
            <div className="mb-2">
                {!labelHide ? <label htmlFor={id} className="font-medium text-gray-800 cursor-pointer block">
                    {label}
                </label> : null}
                {helpText ? <p className="text-gray-400 text-xs mb-3">{helpText}</p> : null}
            </div>
            <div>
                { !textarea ? (
                    <input id={ id } type={type} className={ className } name={ name } placeholder={label}  { ...rest }/>
                    ) : (
                    <textarea id={ id } className={ className } name={ name } placeholder={label} { ...rest }/>
                )}
                { error ? (
                    <p className="font-medium text-red-600 text-[12px]">
                        { error }
                    </p>
                ): null }
            </div>
        </div>
    )
}