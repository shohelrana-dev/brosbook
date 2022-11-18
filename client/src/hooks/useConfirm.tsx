import alertConfirm from "react-alert-confirm"
import ButtonOutline from "@components/common/ButtonOutline"
import Button from "@components/common/Button"
import "react-alert-confirm/dist/index.css"

alertConfirm.config({
    lang: "en"
})

export interface Options {
    title: string
    message?: string
    okButtonLabel?: string
    cancelButtonLabel?: string
}

export default function useConfirm(){
    async function confirm(options: Options) {
        const {title, message, okButtonLabel = 'Yes', cancelButtonLabel = 'Cancel'} = options
        return await alertConfirm({
            style: { width: "80%", maxWidth: '320px', borderRadius: '15px' },
            title: (<h3 className="text-lg font-bold">{title}</h3>),
            maskClosable: true,
            content: message,
            footer: (dispatch) => {
                return (
                    <div className="basis-full">
                        <Button fullWidth size="sm" className="mb-3" onClick={() => dispatch('ok')}>
                            {okButtonLabel}
                        </Button>
                        <ButtonOutline size="sm" fullWidth onClick={() => dispatch('cancel')}>
                            {cancelButtonLabel}
                        </ButtonOutline>
                    </div>
                )
            }
        })
    }

    return confirm
}
