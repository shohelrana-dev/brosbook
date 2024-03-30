import { forwardRef } from 'react'
import { Input, InputProps, Textarea, TextAreaProps } from '~/lib/nextui'
import { cn, ucfirst } from '~/lib/utils'

interface Props {
    error?: string
    wrapperClassname?: string
    textarea?: boolean
}

const BasicInput = forwardRef((props: Props & InputProps & TextAreaProps, ref: any) => {
    let { wrapperClassname, textarea, error, classNames, label, description, ...rest } = props
    const isError = !!error

    return (
        <div className={cn('mb-2 md:mb-4', wrapperClassname)}>
            {!!label && (
                <label htmlFor={rest.name} className='font-medium block mb-1'>
                    {label}
                </label>
            )}
            {!!description && <p className='text-xs text-gray-700 mb-3'>{description}</p>}
            {textarea ? (
                <Textarea
                    color='primary'
                    variant='bordered'
                    classNames={{
                        ...classNames,
                        inputWrapper: cn('border-large bg-white', classNames?.inputWrapper),
                        input: cn('text-sm', classNames?.input),
                    }}
                    size='lg'
                    labelPlacement='outside'
                    errorMessage={ucfirst(error)}
                    isInvalid={isError}
                    {...rest}
                    ref={ref}
                />
            ) : (
                <Input
                    color='primary'
                    variant='bordered'
                    classNames={{
                        ...classNames,
                        inputWrapper: cn('border-large bg-white', classNames?.inputWrapper),
                        input: cn('text-sm', classNames?.input),
                    }}
                    size='lg'
                    labelPlacement='outside'
                    errorMessage={ucfirst(error)}
                    isInvalid={isError}
                    {...rest}
                    ref={ref}
                />
            )}
        </div>
    )
})

BasicInput.displayName = 'BasicInput'
export default BasicInput
