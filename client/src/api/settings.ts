import API                        from "@utils/API";
import { ChangePasswordFormData } from "@interfaces/user.interfaces"

const settingsApi = {
    updateProfile: ( data: FormData ) => API.put( `/settings/update_profile`, data, { headers: { 'Content-Type': 'multipart/form-data' } } ),
    changePassword: ( data: ChangePasswordFormData ) => API.put( `/settings/change_password`, data )
}

export default settingsApi