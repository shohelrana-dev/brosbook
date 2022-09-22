import { Router }         from "express"
import { ensureAuth }     from "@api/middleware/auth"
import SettingsValidation from "@api/modules/settings/settings.validation"
import SettingController  from "@api/modules/settings/setting.controller"
import SettingService     from "@services/setting.service"

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