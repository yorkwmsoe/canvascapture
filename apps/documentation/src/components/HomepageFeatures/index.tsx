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
        title: 'Desktop Application',
        Svg: require('@site/static/img/desktop.svg').default,
        description: (
            <>
                The desktop application is where users interact with Canvas
                Capture.
            </>
        ),
    },
    {
        title: 'Documentation Site',
        Svg: require('@site/static/img/docs.svg').default,
        description: (
            <>
                This site is the developer notes for the Canvas Capture project.
            </>
        ),
    },
    {
        title: 'COMING SOON: Database',
        Svg: require('@site/static/img/database.svg').default,
        description: (
            <>
                The database will be used to cache data and improve performance.
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
