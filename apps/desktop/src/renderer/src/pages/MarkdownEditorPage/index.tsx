import { MarkdownEditor } from '@renderer/components/MarkdownEditor'
import { Navbar } from '@renderer/components/Navbar'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { useNavigate } from '@tanstack/react-router'
import { Button, Typography } from 'antd'

const md = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`

export function MarkdownEditorPage() {
    const navigate = useNavigate({ from: '/markdown-editor' })

    const goToHomePage = () => {
        navigate({ to: '/' })
    }

    return (
        <>
            <Navbar>
                <Button onClick={goToHomePage} icon={<LeftArrowIcon />}>
                    Back
                </Button>
            </Navbar>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Markdown Editor
            </Typography.Title>
            <div style={{ marginInline: '1rem' }}>
                <MarkdownEditor defaultValue={md} />
            </div>
        </>
    )
}
