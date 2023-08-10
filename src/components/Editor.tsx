import { FC, useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import { TOOLS } from '../conf/tools'

export const Editor: FC<{
    onInit?: (editor: EditorJS) => void
}> = ({ onInit }) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const current = ref.current
        if (!current) return

        const editor = new EditorJS({
            holder: current,
            tools: TOOLS,
        })

        if (onInit) onInit(editor)

        return () => {
            const destroy = async () => {
                await editor.isReady
                console.log('destroy')
                editor.destroy()
            }
            destroy()
        }
    }, [ref, onInit])

    return (
        <div
            ref={ref}
            style={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        ></div>
    )
}
