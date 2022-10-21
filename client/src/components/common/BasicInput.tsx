import React, { InputHTMLAttributes } from 'react'
import { Zoom }                       from "@mui/material"

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string,
    textarea?: boolean
    error?: { msg: string }
}

export default function BasicInput( props: LabeledInputProps ) {
    let { label, name, textarea, className, value, error, onChange, ...rest } = props
    if ( className ) {
        className = className + ' input-basic'
    } else {
        className = 'input-basic'
    }

    return (
        <div className="flex items-center">
            <div className="w-3/12 p-4">
                <label htmlFor={ name } className="font-medium text-gray-800 cursor-pointer block text-right">
                    { label }
                </label>
            </div>
            <div className="flex-auto p-4">
                { !textarea && <input id={ name } className={ className } name={ name } value={ value }
                                      onChange={ onChange } { ...rest } /> }
                { textarea && <textarea id={ name } className={ className } name={ name } value={ value }
                                        onChange={ onChange }/> }
                { error && (
                    <Zoom in>
                        <p className="font-medium text-red-600 text-[12px]">
                            { error.msg }
                        </p>
                    </Zoom>
                ) }
            </div>
        </div>
    )
}