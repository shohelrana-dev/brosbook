import React, {PropsWithChildren} from 'react'

function Divider(props: PropsWithChildren) {
    return (
        <div className="flex justify-center items-center w-full">
            <hr className=" w-full my-5 h-px bg-gray-200 border-0"/>
            <span className="px-3 font-medium text-gray-900">
                {props.children}
            </span>
            <hr className=" w-full my-5 h-px bg-gray-200 border-0"/>
        </div>
    )
}

export default Divider