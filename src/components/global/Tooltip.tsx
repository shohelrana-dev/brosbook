import { forwardRef } from 'react'
import { Tooltip as BaseTooltip, TooltipProps } from '~/lib/nextui'

interface Props extends TooltipProps {
    disableWrapper?: boolean
}

const Tooltip = forwardRef(({ children, disableWrapper, ...rest }: Props, ref: any) => {
    return (
        <BaseTooltip
            placement='bottom'
            color='foreground'
            size='sm'
            delay={500}
            closeDelay={200}
            showArrow
            {...rest}
        >
            {disableWrapper ? children : <span ref={ref}>{children}</span>}
        </BaseTooltip>
    )
})

Tooltip.displayName = 'displayName'
export default Tooltip
