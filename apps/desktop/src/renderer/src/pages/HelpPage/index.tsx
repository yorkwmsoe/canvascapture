/**
 * Defines the HelpPage
 *
 * See the definition below for more details
 */
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { Button, Collapse, Layout, Typography } from 'antd'
import { LeftArrowIcon } from '@renderer/components/icons/LeftArrow'
import { Navbar } from '@renderer/components/Navbar'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ExternalLink } from '@renderer/components/ExternalLink'
import { useSettingsStore } from '@renderer/stores/settings.store'
import { FileOutlined } from '@ant-design/icons'

export function HelpPage() {
    // Get passed parameters
    const { previousPage, section, step } = useSearch({ from: '/help' })
    const navigate = useNavigate({ from: '/' })

    // Set key for which section to expand
    const key = section == undefined ? '' : section

    // Get the canvasDomain URL
    const { canvasDomain } = useSettingsStore()

    // Set the back button to return to the previous page
    const goBack = () => {
        if (previousPage == '/selection') {
            // Return to the correct step of the selection page
            navigate({ to: '/selection', search: { step: step } })
        } else {
            navigate({ to: previousPage })
        }
    }

    // Return the page
    return (
        <ErrorBoundary>
            <Layout
                style={{
                    height: '100%',
                }}
            >
                <Navbar>
                    <Button onClick={goBack} icon={<LeftArrowIcon />}>
                        Back
                    </Button>
                    <Typography.Title
                        level={3}
                        style={{
                            margin: 0,
                            height: 20,
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        Canvas Capture Help
                    </Typography.Title>
                    <div></div>
                </Navbar>
                <h2>Select a Section Below:</h2>
                <Collapse defaultActiveKey={key}>
                    <Collapse.Panel key={'settings'} header={'Setup/Settings'}>
                        <h1>Setup/Settings</h1>
                        <hr />
                        <h2>Canvas Access Token</h2>
                        <p>
                            This token allows Canvas Capture to fetch your
                            course and assignment data from the MSOE Canvas.
                        </p>
                        <h4>Setting Up a Canvas Access Token:</h4>
                        <ol>
                            <li>
                                Click{' '}
                                <ExternalLink
                                    href={`${canvasDomain}/profile/settings#access_tokens_holder`}
                                >
                                    <b>here</b>
                                </ExternalLink>{' '}
                                to go to your Canvas settings page
                                <ul>
                                    <li>
                                        The link will open in your default web
                                        browser
                                    </li>
                                    <li>
                                        You will have to log in to Canvas if you
                                        are not already logged in
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Under the section <b>Approved Integrations</b>,
                                click <b>New Access Token</b>
                            </li>
                            <li>
                                Enter anything for the purpose, such as{' '}
                                <b>Canvas Capture</b>
                            </li>
                            <li>
                                Enter an expiration date if desired
                                <ul>
                                    <li>
                                        You will have to generate a new token to
                                        continue using Canvas Capture after the
                                        expiration date
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Click <b>Generate Token</b>
                            </li>
                            <li>Copy the displayed token the your clipboard</li>
                            <li>Return to Canvas Capture</li>
                            <li>Navigate to the settings page</li>
                            <li>
                                Paste the copied token into the{' '}
                                <b>Canvas Access Token</b> input
                            </li>
                            <li>
                                Make sure to click <b>Save</b> before leaving
                                the settings page
                            </li>
                        </ol>
                        <hr />
                        <h2>Show Editor</h2>
                        <p>
                            This checkbox enables the editor, which allows you
                            to edit the generated PDFs prior saving them. See
                            the <b>Editor</b> section below for details on using
                            the editor.
                        </p>
                    </Collapse.Panel>
                    <Collapse.Panel
                        key={'process'}
                        header={'Report Generation'}
                    >
                        <h1>Report Generation</h1>
                        <hr />
                        <h2>Step-by-Step Instructions</h2>
                        <ol>
                            <li>
                                On the home page, enter a report name in the
                                input box
                                <ul>
                                    <li>
                                        Using the same name as a previously
                                        generated report will overwrite that
                                        previous report
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Click <b>Start</b>
                            </li>
                            <li>
                                From the displayed list, select the course(s)
                                from which to generate the report
                            </li>
                            <li>
                                Click <b>Next</b>
                            </li>
                            <li>
                                From the displayed list, select the
                                assignment(s) from which to generate the report
                                <ul>
                                    <li>
                                        You can select individual assignments by
                                        clicking the checkbox next to an
                                        assignment
                                        <ul>
                                            <li>
                                                You will have to expand a course
                                                to see the individual
                                                assignments
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        You can also select all assignments for
                                        a course by clicking the checkbox next
                                        to a course
                                    </li>
                                    <li>
                                        You can use the filter input to display
                                        only assignments that have the selected
                                        submission type(s)
                                        <ul>
                                            <li>
                                                You will still have to select
                                                your desired assignment(s) after
                                                filtering
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Click <b>Next</b>
                            </li>
                            <li>
                                Select any statistics graphs to include in the
                                report
                                <ul>
                                    <li>
                                        Select <b>Time to Grade</b> to include a
                                        graph of the amount of time taken to
                                        grade each assignment from when it was
                                        submitted
                                    </li>
                                    <li>
                                        Select <b>Average Assignment Grades</b>{' '}
                                        to include a graph of the average grade
                                        per assignment
                                    </li>
                                </ul>
                            </li>
                            <li>
                                If the editor is enabled, click <b>Next</b> and
                                follow the instructions in the <b>Editor</b>{' '}
                                section below
                            </li>
                            <li>
                                If the editor is not enabled, click{' '}
                                <b>Generate</b>
                            </li>
                            <li>
                                Once the report is generated, you will be
                                returned to the home page and a success message
                                will be displayed
                            </li>
                            <li>
                                To view the report, locate it in the{' '}
                                <b>Previously Generated Reports</b> section of
                                the home page and select it
                                <ul>
                                    <li>
                                        This will open your file explorer to the
                                        folder containing the report
                                    </li>
                                </ul>
                            </li>
                        </ol>
                    </Collapse.Panel>
                    <Collapse.Panel key={'editor'} header={'Editor'}>
                        <h1>Editor</h1>
                        <hr />
                        <h2>Select a File to Edit</h2>
                        <ol>
                            <li>
                                On the left side of the page, select a file to
                                edit
                                <ul>
                                    <li>
                                        Files are indicated by: <FileOutlined />
                                    </li>
                                </ul>
                            </li>
                            <li>
                                The contents of the file will be displayed in
                                the center of the page
                            </li>
                        </ol>
                        <hr />
                        <h2>Editing a File (Standard Editor)</h2>
                        <ul>
                            <li>
                                Click in any of the input boxes to change their
                                content
                            </li>
                            <li>
                                Click an <b>Add New Section Below</b> button to
                                insert a new section below that section
                            </li>
                            <li>
                                Click a <b>Delete Section</b> button to remove
                                that section from the report
                            </li>
                            <li>
                                Click an <b>Exclude Section</b> button to
                                exclude that section from the report, but have
                                it remain in the editor
                                <ul>
                                    <li>
                                        Click an <b>Include Section</b> button
                                        to once again include that section in
                                        the report
                                    </li>
                                    <li>
                                        Leaving a section title blank will also
                                        exclude that section from the generated
                                        report
                                    </li>
                                </ul>
                            </li>
                            <li>
                                For tables (rubrics), click in a cell to edit
                                that part of the table
                            </li>
                            <li>
                                Click <b>Revert Changes</b> to restore the file
                                to how it was originally generated
                            </li>
                            <li>
                                Make sure to click <b>Save Changes</b> before
                                selecting a different file or clicking{' '}
                                <b>Generate</b>
                            </li>
                        </ul>
                        <hr />
                        <Collapse>
                            <Collapse.Panel
                                key={0}
                                header={'Editing a File (Markdown Editor)'}
                            >
                                <h2>Editing a File (Markdown Editor)</h2>
                                <ul>
                                    <li>
                                        Click in the input box to edit the file
                                        <ul>
                                            <li>
                                                Any changes made in the Markdown
                                                Editor will be overwritten by
                                                any subsequent changes made in
                                                the Standard Editor
                                            </li>
                                            <li>
                                                Markdown syntax is supported
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Click <b>Revert Changes</b> to restore
                                        the file to how it was originally
                                        generated
                                    </li>
                                    <li>
                                        Make sure to click <b>Save Changes</b>{' '}
                                        before selecting a different file or
                                        clicking <b>Generate</b>
                                    </li>
                                </ul>
                            </Collapse.Panel>
                        </Collapse>
                        <hr />
                        <h2>Viewing a File</h2>
                        <ul>
                            <li>
                                With a file selected, click <b>View</b> to view
                                how the file will look when rendered
                                <ul>
                                    <li>
                                        Files will be combined into one PDF per
                                        course when generated
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <hr />
                        <h2>Generating the Report</h2>
                        <ol>
                            <li>
                                Once you have made and saved all of your
                                changes, click <b>Generate</b>
                            </li>
                            <li>
                                Once the report is generated, you will be
                                returned to the home page and a success message
                                will be displayed
                            </li>
                            <li>
                                To view the report, locate it in the{' '}
                                <b>Previously Generated Reports</b> section of
                                the home page and select it
                                <ul>
                                    <li>
                                        This will open your file explorer to the
                                        folder containing the report
                                    </li>
                                </ul>
                            </li>
                        </ol>
                    </Collapse.Panel>
                </Collapse>
            </Layout>
        </ErrorBoundary>
    )
}
