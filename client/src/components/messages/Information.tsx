import React, { Fragment } from 'react'

import Avatar from "@components/common/Avatar"

function Information() {
    return (
        <Fragment>
            <div className="box p-6 text-center">
                <div className="flex justify-center mb-3">
                    <Avatar
                        online={ true }
                        src="http://localhost:4000/images/ade0b74e-94db-43b1-93b2-838f76ea3c4d.png"
                        size="large"
                        alt="Shohel Rana"
                    />
                </div>
                <h5 className="font-medium text-lg text-gray-800">Umme Hafsa Rupa</h5>
                <p className="text-gray-600">Software Engineer</p>
            </div>

            <div className="box p-4 mt-3">
                <div className="text-base font-medium">Personal Information</div>
                <div className="mt-4">
                    <div className="border-gray-200 flex items-center border-b pb-3">
                        <div className="">
                            <div className="text-gray-600">Country</div>
                            <div className="mt-0.5">New York City, USA</div>
                        </div>
                    </div>
                    <div className="border-gray-200 flex items-center border-b py-3">
                        <div className="">
                            <div className="text-gray-600">Phone</div>
                            <div className="mt-0.5">+32 19 23 62 24 34</div>
                        </div>
                    </div>
                    <div className="border-gray-200 flex items-center py-3">
                        <div className="">
                            <div className="text-gray-600">Email</div>
                            <div className="mt-0.5">johntravolta@left4code.com</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="box p-4 mt-3">
                <h5 className="text-base font-medium">Shared Files</h5>
            </div>

        </Fragment>
    )
}

export default Information