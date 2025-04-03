import { Octokit } from '@octokit/rest'
import { readFile } from 'fs'

const settingsFilePath = '../desktop/src/renderer/src/apis/LinkSettings.json'

export const getDescriptionFromClassroomInvite = async (url: string) => {
    let classToken: string
    let doChase: boolean
    try {
        const { gitHubClassroomToken, chaseLinks } =
            await loadSettingsFromFile()
        classToken = gitHubClassroomToken
        doChase = chaseLinks
    } catch (e) {
        classToken = ''
        doChase = false
    }

    let readme = ''
    if (doChase) {
        const octokit = new Octokit({
            auth: classToken,
        })

        const classrooms = await octokit.request('GET /classrooms', {
            headers: {
                'X-Github-API-Version': '2022-11-28',
            },
        }) //Gets every class the user owns

        const classroom_assignments = {}
        const assignments = {}
        const readmes = []

        //Loops through every class the user owns
        for (const classes in classrooms['data']) {
            const classID = classrooms['data'][classes]['id']
            classroom_assignments[classID] = await octokit.request(
                `GET /classrooms/${classID}/assignments`,
                {
                    classroom_id: `${classID}`,
                    headers: {
                        'X-Github-Api-Version': '2022-11-28',
                    },
                }
            )

            //Loops through all assignments in the class of this loop
            for (const classAssignments in classroom_assignments[classID][
                'data'
            ]) {
                const aid =
                    classroom_assignments[classID]['data'][classAssignments][
                        'id'
                    ]

                assignments[aid] = await octokit.request(
                    `GET /assignments/${aid}`,
                    {
                        assignment_id: `${aid}`,
                        headers: {
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    }
                )

                //If this is the assignment we are looking for
                if (assignments[aid]['data']['invite_link'] == url) {
                    //If the assignment has a starting repository, which means it should have a readme
                    if (assignments[aid]['data']['starter_code_repository']) {
                        const full_name =
                            assignments[aid]['data']['starter_code_repository'][
                                'full_name'
                            ]
                        const owner = full_name.split('/')[0]
                        const repo = full_name.split('/')[1]
                        readmes[classAssignments] = await octokit.request(
                            `GET /repos/${assignments[aid]['data']['starter_code_repository']['full_name']}/readme`,
                            {
                                owner: owner,
                                repo: repo,
                                header: {
                                    'X-GitHub-Api-Version': '2022-11-28',
                                },
                            }
                        )

                        //Gets the readme and formats it properly
                        await fetch(
                            readmes[classAssignments]['data']['download_url']
                        )
                            .then((response) => response.text())
                            .then((text) => {
                                readme =
                                    `<blockquote style="border-left: 4px solid #ccc; padding-left: 10px; font-style: italic;">\n\n` +
                                    text +
                                    `\n</blockquote>\n`
                            })
                    }
                }
            }
        }
    }
    return readme
}

export const loadSettingsFromFile = (): Promise<{
    gitHubClassroomToken: string
    chaseLinks: boolean
}> => {
    return new Promise((resolve, reject) => {
        readFile(settingsFilePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err)
            }
            try {
                const settings = JSON.parse(data)
                resolve(settings)
            } catch (error) {
                reject(error)
            }
        })
    })
}
