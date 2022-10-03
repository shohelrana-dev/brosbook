import { Router }         from "express"
import { ensureAuth }    from "@middleware/auth.middleware"
import SettingValidation from "@modules/settings/setting.validation"
import SettingController from "@modules/settings/setting.controller"
import SettingService     from "./setting.service"

const validation         = new SettingValidation()
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