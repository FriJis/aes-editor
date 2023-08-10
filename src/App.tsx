import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    InputAdornment,
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

    const save = async () => {
        const data = await editor?.save()
        const hash = aes.encrypt(JSON.stringify(data), password)
        setHash(hash)
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
    }

    return (
        <Container
            sx={{ gap: '10px', display: 'flex', flexDirection: 'column' }}
        >
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
                    <Button onClick={load}>decode</Button>
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
