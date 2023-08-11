import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    InputAdornment,
    Snackbar,
    TextField,
} from '@mui/material'
import { Editor } from './components/Editor'
import { useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import { aes } from './utils/aes'
import { copy } from './utils/common'

function App() {
    const [editor, setEditor] = useState<EditorJS | null>(null)
    const [password, setPassword] = useState('')
    const [hash, setHash] = useState('')
    const [error, setError] = useState<null | string>(null)
    const [showError, setShowError] = useState(false)
    const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false)

    const save = async () => {
        try {
            const data = await editor?.save()
            const hash = aes.encrypt(JSON.stringify(data), password)
            const decryptedData = aes.decrypt(hash, password)
            if (JSON.stringify(data) !== decryptedData)
                throw new Error('Data compatibility error')
            setHash(hash)
            copy(hash)
            setShowCopiedSnackbar(true)
        } catch (error: any) {
            setShowError(true)
            setError(error.message)
        }
    }

    const load = async () => {
        try {
            const json = aes.decrypt(hash, password)

            const data = JSON.parse(json)

            editor?.render(data)
        } catch (error: any) {
            setShowError(true)
            setError(error.message)
        }
    }

    const copyClick = () => {
        copy(hash)
        setShowCopiedSnackbar(true)
    }

    return (
        <Container
            sx={{ gap: '10px', display: 'flex', flexDirection: 'column' }}
        >
            <Snackbar
                open={showCopiedSnackbar}
                autoHideDuration={2000}
                onClose={() => setShowCopiedSnackbar(false)}
                message="Copied!"
            />
            <Dialog open={showError} onClose={() => setShowError(false)}>
                <DialogContent>{error}</DialogContent>
            </Dialog>
            <Card>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        placeholder="Hash"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={copyClick}>copy</Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
                <CardActions>
                    <Button onClick={load}>decrypt</Button>
                    <Button onClick={save}>encrypt</Button>
                </CardActions>
            </Card>
            <Card>
                <CardContent>
                    <Editor onInit={setEditor} />
                </CardContent>
            </Card>
        </Container>
    )
}

export default App
