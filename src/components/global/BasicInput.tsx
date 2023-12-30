import { InputHTMLAttributes, LegacyRef } from 'react'
import classNames from "classnames"

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string,
    textarea?: boolean
    error?: string
    helpText?: string
    labelHide?: boolean
    wrapperClassname?: string
    inputRef?: LegacyRef<any>
}

export default function BasicInput( props: BasicInputProps ) {
    let {
            label,
            name,
            textarea,
            className,
            type = 'text',
            error,
            helpText,
            labelHide = false,
            wrapperClassname,
            inputRef,
            ...rest
        } = props

    className = classNames('block w-full font-kanit outline-none py-2 px-3 rounded-lg border-2 border-solid border-gray-200 focus:border-theme-light-green', className)

    const id = name ? name : label.replace(' ', '')

    return (
        <div className={ classNames("mb-2 md:mb-4", wrapperClassname) }>
            { !labelHide || helpText ? (
                <div className="mb-2">
                    { !labelHide ? <label htmlFor={ id } className="font-medium text-gray-900 cursor-pointer block">
                        { label }
                    </label> : null }
                    { helpText ? <p className="text-gray-600 text-xs mb-3">{ helpText }</p> : null }
                </div>
            ) : null }
            <div>
                { !textarea ? (
                    <input id={ id } type={ type } className={ className } name={ name }
                           placeholder={ label } ref={ inputRef }  { ...rest }/>
                ) : (
                    <textarea id={ id } className={ className } name={ name } placeholder={ label }
                              ref={ inputRef } { ...rest }/>
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