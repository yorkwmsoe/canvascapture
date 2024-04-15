import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
    title: string
    Svg: React.ComponentType<React.ComponentProps<'svg'>>
    description: JSX.Element
}

const FeatureList: FeatureItem[] = [
    {
        title: 'Command Line Interface',
        Svg: require('@site/static/img/cli.svg').default,
        description: (
            <>
                With the Command Line Interface (CLI) you can retrieve work from
                Canvas.
            </>
        ),
    },
    {
        title: 'Desktop Application',
        Svg: require('@site/static/img/desktop.svg').default,
        description: (
            <>
                With the desktop application you will now be able to install it
                and use it retrieve work from Canvas.
            </>
        ),
    },
    {
        title: 'Documentation Site',
        Svg: require('@site/static/img/docs.svg').default,
        description: (
            <>
                This site is the documentation for the Canvas Capture project.
            </>
        ),
    },
]

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    )
}
