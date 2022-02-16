import React           from 'react'
import ReactDatePicker from "react-date-picker/dist/entry.nostyle"
import { Zoom }        from "@mui/material"
import "react-date-picker/dist/DatePicker.css"
import "react-calendar/dist/Calendar.css"
import moment          from "moment"

interface DatePickerProps {
    label: string
    name: string
    value: any
    onChange: ( date: string | null ) => void
    error?: string
}


function DatePicker( props: DatePickerProps ) {
    let { error, label, name, value, onChange, ...restProps } = props

    function onChangeHandle( date: any ) {
        onChange( date ? moment( date ).format( 'YYYY-MM-DD' ) : null )
    }

    value = value ? moment( value ).toDate() : null

    return (
        <div className="flex items-center">
            <div className="w-3/12 flex justify-end p-4">
                <label htmlFor={ name } className="font-medium text-gray-800 cursor-pointer">
                    { label }
                </label>
            </div>
            <div className="flex-auto p-4">
                <ReactDatePicker
                    name={ name }
                    className="!border-blue-300"
                    value={ value }
                    onChange={ onChangeHandle }
                    maxDate={new Date('2015-01-01')}
                    { ...restProps }
                />
                { error && (
                    <Zoom in>
                        <p className="font-medium text-red-600 text-xs">
                            { error }
                        </p>
                    </Zoom>
                ) }
            </div>
        </div>
    )
}

export default DatePicker