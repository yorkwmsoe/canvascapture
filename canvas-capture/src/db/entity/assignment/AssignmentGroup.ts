/**
 * Represents a group of assignments in a course.
 * An assignment group is used to organize assignments and can also include grading rules for that group.
 *
 * @see {@link https://canvas.instructure.com/doc/api/assignment_groups.html} for more details.
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import { Assignment, Course, Quiz } from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class AssignmentGroup extends CanvasEntity {
    /**
     * The unique identifier for the Assignment Group.
     */
    @PrimaryColumn({ type: 'numeric' })
    id: number

    @Column({ nullable: true, type: 'numeric' })
    courseId?: number

    /**
     * (Not part of the official Canvas Assignment Group API, added for convenience)
     * The ID of the course this Assignment Group belongs to.
     * This field was added as it might be helpful for associating assignment groups
     * with courses in future implementations.
     */
    @ManyToOne('Course', (course: Course) => course.assignment_groups)
    @JoinColumn()
    course: Course

    /**
     * The name of the Assignment Group.
     */
    @Column({ type: 'text' })
    name: string

    /**
     * The position (order) of the Assignment Group within the course.
     */
    @Column({ type: 'numeric' })
    position: number

    /**
     * The weight of the Assignment Group, typically used for weighted grading.
     */
    @Column({ type: 'numeric' })
    group_weight: number

    /**
     * The SIS (Student Information System) source ID for the Assignment Group.
     */
    @Column({ type: 'text' })
    sis_source_id: string

    /**
     * Additional integration data for the Assignment Group.
     */
    @Column({ type: 'simple-json' })
    integration_data: object

    /**
     * The list of assignments that belong to this Assignment Group.
     */
    @OneToMany(
        'Assignment',
        (assignment: Assignment) => assignment.assignment_group
    )
    @JoinColumn()
    assignments: Assignment[]

    @OneToMany('Quiz', (quiz: Quiz) => quiz.assignment_group)
    @JoinColumn()
    quizzes: Quiz[]

    /**
     * Any grading rules that apply to this Assignment Group.
     */
    @Column({ type: 'text' })
    rules: string

    constructor(data?: Partial<AssignmentGroup>) {
        super(data)
        Object.assign(this, data)
    }
}
