import { FormControl, InputLabel, OutlinedInput, OutlinedInputProps, FormHelperText } from "@mui/material"

export interface AnimatedInputProps extends Omit<OutlinedInputProps, 'error' | 'fullWidth' | 'id'> {
    error?: string
    wrapperClassname?: string
}

export default function AnimatedInput( props: AnimatedInputProps ) {
    let { label, name, error, wrapperClassname = '', ...rest } = props

    name = name ? name : ( label as string ).toLowerCase().replace(' ', '')

    return (
        <FormControl variant="outlined" size="small" fullWidth error={ !!error } className={ wrapperClassname }>
            <InputLabel htmlFor={ name }>{ label }</InputLabel>
            <OutlinedInput
                label={ label }
                name={ name }
                id={ name }
                error={ !!error }
                { ...rest }
            />
            { error ? <FormHelperText error>{ error }</FormHelperText> : null }
        </FormControl>
    )
}