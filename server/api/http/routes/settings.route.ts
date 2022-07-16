import { Router }         from "express"
import { ensureAuth }     from "@middleware/auth"
import SettingsValidation from "@validations/settings.validation"
import SettingController from "@controllers/setting.controller"
import SettingService    from "@services/setting.service"

const validation         = new SettingsValidation()
const settingController = new SettingController( new SettingService() )

const router = Router()

/**
 * @desc Update user profile
 * @route PUT settings/update_profile
 * @access Private
 */
router.put( '/update_profile', ensureAuth, validation.updateProfile(), settingController.updateProfile )

/**
 * @desc change account password
 * @route PUT settings/change_password
 * @access Private
 */
router.put( '/change_password', ensureAuth, validation.changePassword(), settingController.changePassword )

export default router