/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import 'reflect-metadata'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import {
    AssignmentGroup,
    DiscussionTopic,
    ExternalToolTagAttributes,
    NeedsGradingCountBySection,
    TurnitinSettings,
    RubricCriteria,
    ScoreStatistic,
    Submission,
    LockInfo,
} from '../entity.types'
import CanvasEntity from '../canvas-entity'

@Entity()
export class Assignment extends CanvasEntity {
    // the ID of the assignment
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // the name of the assignment
    @Column({ type: 'text' })
    name: string

    // the assignment description, in an HTML fragment
    @Column({ type: 'text' })
    description: string

    // The time at which this assignment was originally created
    @Column({ type: 'date' })
    created_at: Date

    // The time at which this assignment was last modified in any way
    @Column({ type: 'date' })
    updated_at: Date

    // the due date for the assignment. returns null if not present. NOTE: If this
    // assignment has assignment overrides, this field will be the due date as it
    // applies to the user requesting information from the API.
    @Column({ nullable: true, type: 'date' })
    due_at?: Date | null

    // the lock date (assignment is locked after this date). returns null if not
    // present. NOTE: If this assignment has assignment overrides, this field will
    // be the lock date as it applies to the user requesting information from the
    // API.
    @Column({ nullable: true, type: 'date' })
    lock_at?: Date | null

    // the unlock date (assignment is unlocked after this date) returns null if not
    // present NOTE: If this assignment has assignment overrides, this field will be
    // the unlock date as it applies to the user requesting information from the
    // API.
    @Column({ nullable: true, type: 'date' })
    unlock_at?: Date | null

    // whether this assignment has overrides
    @Column({ type: 'boolean' })
    has_overrides: boolean

    // (Optional) all dates associated with the assignment, if applicable
    @Column({ nullable: true, type: 'simple-array' })
    all_dates?: Date[]

    // the ID of the course the assignment belongs to
    @Column({ type: 'numeric' })
    course_id: number

    // the URL to the assignment's web page
    @Column({ type: 'text' })
    html_url: string

    // the URL to download all submissions as a zip
    @Column({ type: 'text' })
    submissions_download_url: string

    @Column({ nullable: true, type: 'numeric' })
    assignment_group_id?: number

    // the ID of the assignment's group
    @ManyToOne(
        'AssignmentGroup',
        (assignmentGroup: AssignmentGroup) => assignmentGroup.assignments
    )
    @JoinColumn()
    assignment_group: AssignmentGroup

    // Boolean flag indicating whether the assignment requires a due date based on
    // the account level setting
    @Column({ type: 'boolean' })
    due_date_required: boolean

    // Allowed file extensions, which take effect if submission_types includes
    // 'online_upload'.
    @Column({ nullable: true, type: 'simple-array' })
    allowed_extensions?: string[]

    // An integer indicating the maximum length an assignment's name may be
    @Column({ type: 'numeric' })
    max_name_length: number

    // Boolean flag indicating whether or not Turnitin has been enabled for the
    // assignment. NOTE: This flag will not appear unless your account has the
    // Turnitin plugin available
    @Column({ nullable: true, type: 'boolean' })
    turnitin_enabled?: boolean

    // Boolean flag indicating whether or not VeriCite has been enabled for the
    // assignment. NOTE: This flag will not appear unless your account has the
    // VeriCite plugin available
    @Column({ nullable: true, type: 'boolean' })
    vericite_enabled?: boolean

    @Column({ nullable: true, type: 'numeric' })
    turnitin_settingsId: number

    // Settings to pass along to turnitin to control what kinds of matches should be
    // considered. originality_report_visibility can be 'immediate',
    // 'after_grading', 'after_due_date', or 'never' exclude_small_matches_type can
    // be null, 'percent', 'words' exclude_small_matches_value: - if type is null,
    // this will be null also - if type is 'percent', this will be a number between
    // 0 and 100 representing match size to exclude as a percentage of the document
    // size. - if type is 'words', this will be number > 0 representing how many
    // words a match must contain for it to be considered NOTE: This flag will not
    // appear unless your account has the Turnitin plugin available
    @OneToOne(
        'TurnitinSettings',
        (turnitinSettings: TurnitinSettings) => turnitinSettings.assignment
    )
    @JoinColumn()
    turnitin_settings?: TurnitinSettings

    // If this is a group assignment, boolean flag indicating whether or not
    // students will be graded individually.
    @Column({ type: 'boolean' })
    grade_group_students_individually: boolean

    @Column({ nullable: true, type: 'numeric' })
    external_tool_tag_attributesId: number

    // (Optional) assignment's settings for external tools if submission_types
    // include 'external_tool'. Only url and new_tab are included (new_tab defaults
    // to false).  Use the 'External Tools' API if you need more information about
    // an external tool.
    @OneToMany(
        'ExternalToolTagAttributes',
        (externalToolTagAttributes: ExternalToolTagAttributes) =>
            externalToolTagAttributes.assignment
    )
    @JoinColumn()
    external_tool_tag_attributes?: ExternalToolTagAttributes[]

    // Boolean indicating if peer reviews are required for this assignment
    @Column({ type: 'boolean' })
    peer_reviews: boolean

    // Boolean indicating peer reviews are assigned automatically. If false, the
    // teacher is expected to manually assign peer reviews.
    @Column({ type: 'boolean' })
    automatic_peer_reviews: boolean

    // Integer representing the amount of reviews each user is assigned. NOTE: This
    // key is NOT present unless you have automatic_peer_reviews set to true.
    @Column({ nullable: true, type: 'numeric' })
    peer_review_count?: number

    // String representing a date the reviews are due by. Must be a date that occurs
    // after the default due date. If blank, or date is not after the assignment's
    // due date, the assignment's due date will be used. NOTE: This key is NOT
    // present unless you have automatic_peer_reviews set to true.
    @Column({ nullable: true, type: 'date' })
    peer_reviews_assign_at?: Date

    // Boolean representing whether or not members from within the same group on a
    // group assignment can be assigned to peer review their own group's work
    @Column({ type: 'boolean' })
    intra_group_peer_reviews: boolean

    // The ID of the assignment’s group set, if this is a group assignment. For
    // group discussions, set group_category_id on the discussion topic, not the
    // linked assignment.
    @Column({ nullable: true, type: 'numeric' })
    group_category_id?: number

    // if the requesting user has grading rights, the number of submissions that
    // need grading.
    @Column({ nullable: true, type: 'numeric' })
    needs_grading_count?: number

    @Column({ nullable: true, type: 'numeric' })
    needs_grading_count_by_sectionId: number

    // if the requesting user has grading rights and the
    // 'needs_grading_count_by_section' flag is specified, the number of submissions
    // that need grading split out by section. NOTE: This key is NOT present unless
    // you pass the 'needs_grading_count_by_section' argument as true.  ANOTHER
    // NOTE: it's possible to be enrolled in multiple sections, and if a student is
    // setup that way they will show an assignment that needs grading in multiple
    // sections (effectively the count will be duplicated between sections)
    @OneToMany(
        'NeedsGradingCountBySection',
        (needsGradingCountBySection: NeedsGradingCountBySection) =>
            needsGradingCountBySection.assignment
    )
    @JoinColumn()
    needs_grading_count_by_section?: NeedsGradingCountBySection[]

    // the sorting order of the assignment in the group
    @Column({ type: 'numeric' })
    position: number

    // (optional, present if Sync Grades to SIS feature is enabled)
    @Column({ nullable: true, type: 'boolean' })
    post_to_sis?: boolean

    // (optional, Third Party unique identifier for Assignment)
    @Column({ nullable: true, type: 'text' })
    integration_id?: string

    // (optional, Third Party integration data for assignment)
    @Column({ nullable: true, type: 'simple-json' })
    integration_data?: Record<string, string>

    // the maximum points possible for the assignment
    @Column({ type: 'numeric' })
    points_possible: number

    // the types of submissions allowed for this assignment list containing one or
    // more of the following: 'discussion_topic', 'online_quiz', 'on_paper', 'none',
    // 'external_tool', 'online_text_entry', 'online_url', 'online_upload',
    // 'media_recording', 'student_annotation'
    @Column({ type: 'simple-array' })
    submission_types: string[]

    // If true, the assignment has been submitted to by at least one student
    @Column({ type: 'boolean' })
    has_submitted_submissions: boolean

    // The type of grading the assignment receives; one of 'pass_fail', 'percent',
    // 'letter_grade', 'gpa_scale', 'points'
    @Column({ type: 'text' })
    grading_type: string

    // The id of the grading standard being applied to this assignment. Valid if
    // grading_type is 'letter_grade' or 'gpa_scale'.
    @Column({ nullable: true, type: 'text' })
    grading_standard_id?: string

    // Whether the assignment is published
    @Column({ type: 'boolean' })
    published: boolean

    // Whether the assignment's 'published' state can be changed to false. Will be
    // false if there are student submissions for the assignment.
    @Column({ type: 'boolean' })
    unpublishable: boolean

    // Whether the assignment is only visible to overrides.
    @Column({ type: 'boolean' })
    only_visible_to_overrides: boolean

    // Whether or not this is locked for the user.
    @Column({ type: 'boolean' })
    locked_for_user: boolean

    @Column({ nullable: true, type: 'numeric' })
    lock_info_id: number

    // (Optional) Information for the user about the lock. Present when
    // locked_for_user is true.
    @OneToOne('LockInfo', (lockInfo: LockInfo) => lockInfo.assignment)
    @JoinColumn()
    lock_info?: LockInfo

    // (Optional) An explanation of why this is locked for the user. Present when
    // locked_for_user is true.
    @Column({ nullable: true, type: 'text' })
    lock_explanation?: string

    // (Optional) id of the associated quiz (applies only when submission_types is
    // ['online_quiz'])
    @Column({ nullable: true, type: 'numeric' })
    quiz_id?: number

    // (Optional) whether anonymous submissions are accepted (applies only to quiz
    // assignments)
    @Column({ nullable: true, type: 'boolean' })
    anonymous_submissions?: boolean

    @Column({ nullable: true, type: 'numeric' })
    discussion_topicId: number

    // (Optional) the DiscussionTopic associated with the assignment, if applicable
    @OneToOne(
        'DiscussionTopic',
        (discussionTopic: DiscussionTopic) => discussionTopic.assignment
    )
    @JoinColumn()
    discussion_topic?: DiscussionTopic

    // (Optional) Boolean indicating if assignment will be frozen when it is copied.
    // NOTE: This field will only be present if the AssignmentFreezer plugin is
    // available for your account.
    @Column({ nullable: true, type: 'boolean' })
    freeze_on_copy?: boolean

    // (Optional) Boolean indicating if assignment is frozen for the calling user.
    // NOTE: This field will only be present if the AssignmentFreezer plugin is
    // available for your account.
    @Column({ nullable: true, type: 'boolean' })
    frozen?: boolean

    // (Optional) Array of frozen attributes for the assignment. Only account
    // administrators currently have permission to change an attribute in this list.
    // Will be empty if no attributes are frozen for this assignment. Possible
    // frozen attributes are: title, description, lock_at, points_possible,
    // grading_type, submission_types, assignment_group_id, allowed_extensions,
    // group_category_id, notify_of_update, peer_reviews NOTE: This field will only
    // be present if the AssignmentFreezer plugin is available for your account.
    @Column({ nullable: true, type: 'simple-array' })
    frozen_attributes?: string[]

    @Column({ nullable: true, type: 'numeric' })
    submission_id: number

    // (Optional) If 'submission' is included in the 'include' parameter, includes a
    // Submission object that represents the current user's (user who is requesting
    // information from the api) current submission for the assignment. See the
    // Submissions API for an example response. If the user does not have a
    // submission, this key will be absent.
    @OneToOne('Submission', (submission: Submission) => submission.assignment)
    @JoinColumn()
    submission?: Submission

    // (Optional) If true, the rubric is directly tied to grading the assignment.
    // Otherwise, it is only advisory. Included if there is an associated rubric.
    @Column({ nullable: true, type: 'boolean' })
    use_rubric_for_grading?: boolean

    @Column({ nullable: true, type: 'numeric' })
    rubric_settingsId: number

    // (Optional) An object describing the basic attributes of the rubric, including
    // the point total. Included if there is an associated rubric.
    @OneToOne('RubricSettings') // TypeORM will drop in rubric settings as a column
    @JoinColumn() // instead of making a relation, don't need 2nd param
    rubric_settings?: RubricSettings

    @Column({ nullable: true, type: 'simple-array' })
    rubricIds: number[]

    // (Optional) A list of scoring criteria and ratings for each rubric criterion.
    // Included if there is an associated rubric.
    @OneToMany(
        'RubricCriteria',
        (rubricCriteria: RubricCriteria) => rubricCriteria.assignment
    )
    @JoinColumn()
    rubric?: RubricCriteria[]

    // (Optional) If 'assignment_visibility' is included in the 'include' parameter,
    // includes an array of student IDs who can see this assignment.
    @Column({ nullable: true, type: 'simple-array' })
    assignment_visibility?: number[]

    // (Optional) If 'overrides' is included in the 'include' parameter, includes an
    // array of assignment override objects.
    @Column({ nullable: true, type: 'simple-array' })
    overrides?: boolean

    // (Optional) If true, the assignment will be omitted from the student's final
    // grade
    @Column({ nullable: true, type: 'boolean' })
    omit_from_final_grade?: boolean

    // (Optional) If true, the assignment will not be shown in any gradebooks
    @Column({ nullable: true, type: 'boolean' })
    hide_in_gradebook?: boolean

    // Boolean indicating if the assignment is moderated.
    @Column({ type: 'boolean' })
    moderated_grading: boolean

    // The maximum number of provisional graders who may issue grades for this
    // assignment. Only relevant for moderated assignments. Must be a positive
    // value, and must be set to 1 if the course has fewer than two active
    // instructors. Otherwise, the maximum value is the number of active instructors
    // in the course minus one, or 10 if the course has more than 11 active
    // instructors.
    @Column({ type: 'numeric' })
    grader_count: number

    // The user ID of the grader responsible for choosing final grades for this
    // assignment. Only relevant for moderated assignments.
    @Column({ nullable: true, type: 'numeric' })
    final_grader_id?: number

    // Boolean indicating if provisional graders' comments are visible to other
    // provisional graders. Only relevant for moderated assignments.
    @Column({ type: 'boolean' })
    grader_comments_visible_to_graders: boolean

    // Boolean indicating if provisional graders' identities are hidden from other
    // provisional graders. Only relevant for moderated assignments with
    // grader_comments_visible_to_graders set to true.
    @Column({ type: 'boolean' })
    graders_anonymous_to_graders: boolean

    // Boolean indicating if provisional grader identities are visible to the final
    // grader. Only relevant for moderated assignments.
    @Column({ type: 'boolean' })
    grader_names_visible_to_final_grader: boolean

    // Boolean indicating if the assignment is graded anonymously. If true, graders
    // cannot see student identities.
    @Column({ type: 'boolean' })
    anonymous_grading: boolean

    // The number of submission attempts a student can make for this assignment. -1
    // is considered unlimited.
    @Column({ type: 'numeric' })
    allowed_attempts: number

    // Whether the assignment has manual posting enabled. Only relevant for courses
    // using New Gradebook.
    @Column({ type: 'boolean' })
    post_manually: boolean

    @Column({ nullable: true, type: 'simple-array' })
    score_statisticsIds: number[]

    // (Optional) If 'score_statistics' and 'submission' are included in the
    // 'include' parameter and statistics are available, includes the min, max, and
    // mode for this assignment
    @OneToMany(
        'ScoreStatistic',
        (scoreStatistic: ScoreStatistic) => scoreStatistic.assignment
    )
    @JoinColumn()
    score_statistics?: ScoreStatistic[]

    // (Optional) If retrieving a single assignment and 'can_submit' is included in
    // the 'include' parameter, flags whether user has the right to submit the
    // assignment (i.e. checks enrollment dates, submission types, locked status,
    // attempts remaining, etc...). Including 'can submit' automatically includes
    // 'submission' in the include parameter. Not available when observed_users are
    // included.
    @Column({ nullable: true, type: 'boolean' })
    can_submit?: boolean

    // (Optional) The academic benchmark(s) associated with the assignment or the
    // assignment's rubric. Only included if 'ab_guid' is included in the 'include'
    // parameter.
    @Column({ nullable: true, type: 'simple-array' })
    ab_guid?: string[]

    // The id of the attachment to be annotated by students. Relevant only if
    // submission_types includes 'student_annotation'.
    @Column({ nullable: true, type: 'numeric' })
    annotatable_attachment_id?: number

    // (Optional) Boolean indicating whether student names are anonymized
    @Column({ nullable: true, type: 'boolean' })
    anonymize_students?: boolean

    // (Optional) Boolean indicating whether the Respondus LockDown Browser® is
    // required for this assignment.
    @Column({ nullable: true, type: 'boolean' })
    require_lockdown_browser?: boolean

    // (Optional) Boolean indicating whether this assignment has important dates.
    @Column({ nullable: true, type: 'boolean' })
    important_dates?: boolean

    // (Optional, Deprecated) Boolean indicating whether notifications are muted for
    // this assignment.
    @Column({ nullable: true, type: 'boolean' })
    muted?: boolean

    // Boolean indicating whether peer reviews are anonymous.
    @Column({ type: 'boolean' })
    anonymous_peer_reviews: boolean

    // Boolean indicating whether instructor anotations are anonymous.
    @Column({ type: 'boolean' })
    anonymous_instructor_annotations: boolean

    // Boolean indicating whether this assignment has graded submissions.
    @Column({ type: 'boolean' })
    graded_submissions_exist: boolean

    // Boolean indicating whether this is a quiz lti assignment.
    @Column({ type: 'boolean' })
    is_quiz_assignment: boolean

    // Boolean indicating whether this assignment is in a closed grading period.
    @Column({ type: 'boolean' })
    in_closed_grading_period: boolean

    // Boolean indicating whether this assignment can be duplicated.
    @Column({ type: 'boolean' })
    can_duplicate: boolean

    // If this assignment is a duplicate, it is the original assignment's course_id
    @Column({ nullable: true, type: 'numeric' })
    original_course_id?: number

    // If this assignment is a duplicate, it is the original assignment's id
    @Column({ nullable: true, type: 'numeric' })
    original_assignment_id?: number

    // If this assignment is a duplicate, it is the original assignment's
    // lti_resource_link_id
    @Column({ nullable: true, type: 'numeric' })
    original_lti_resource_link_id?: number

    // If this assignment is a duplicate, it is the original assignment's name
    @Column({ nullable: true, type: 'text' })
    original_assignment_name?: string

    // If this assignment is a duplicate, it is the original assignment's quiz_id
    @Column({ nullable: true, type: 'numeric' })
    original_quiz_id?: number

    // String indicating what state this assignment is in.
    @Column({ type: 'text' })
    workflow_state: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date

    constructor(data?: Partial<Assignment>) {
        super(data)
        if (data) {
            Object.assign(data)
        }
    }
}

export class RubricSettings {
    @Column({ type: 'text' })
    points_possible: string
}
