/**
 * Defines types matching assignment-related portions
 * of the Canvas API
 */
import { DiscussionTopic } from './discussion-topic'
import { Submission } from './submission'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class Assignment {
    // the ID of the assignment
    @PrimaryColumn()
    id: number

    // the name of the assignment
    @Column()
    name: string

    // the assignment description, in an HTML fragment
    @Column()
    description: string

    // The time at which this assignment was originally created
    @Column()
    created_at: Date

    // The time at which this assignment was last modified in any way
    @Column()
    updated_at: Date

    // the due date for the assignment. returns null if not present. NOTE: If this
    // assignment has assignment overrides, this field will be the due date as it
    // applies to the user requesting information from the API.
    @Column()
    due_at?: Date | null

    // the lock date (assignment is locked after this date). returns null if not
    // present. NOTE: If this assignment has assignment overrides, this field will
    // be the lock date as it applies to the user requesting information from the
    // API.
    @Column()
    lock_at?: Date | null

    // the unlock date (assignment is unlocked after this date) returns null if not
    // present NOTE: If this assignment has assignment overrides, this field will be
    // the unlock date as it applies to the user requesting information from the
    // API.
    @Column()
    unlock_at?: Date | null

    // whether this assignment has overrides
    @Column()
    has_overrides: boolean

    // (Optional) all dates associated with the assignment, if applicable
    @Column()
    all_dates?: Date[]

    // the ID of the course the assignment belongs to
    @Column()
    course_id: number

    // the URL to the assignment's web page
    @Column()
    html_url: string

    // the URL to download all submissions as a zip
    @Column()
    submissions_download_url: string

    // the ID of the assignment's group
    @ManyToOne(
        () => AssignmentGroup,
        (assignmentGroup) => assignmentGroup.assignments
    )
    @JoinColumn()
    assignment_group: AssignmentGroup

    // Boolean flag indicating whether the assignment requires a due date based on
    // the account level setting
    @Column()
    due_date_required: boolean

    // Allowed file extensions, which take effect if submission_types includes
    // 'online_upload'.
    @Column()
    allowed_extensions?: string[]

    // An integer indicating the maximum length an assignment's name may be
    @Column()
    max_name_length: number

    // Boolean flag indicating whether or not Turnitin has been enabled for the
    // assignment. NOTE: This flag will not appear unless your account has the
    // Turnitin plugin available
    @Column()
    turnitin_enabled?: boolean

    // Boolean flag indicating whether or not VeriCite has been enabled for the
    // assignment. NOTE: This flag will not appear unless your account has the
    // VeriCite plugin available
    @Column()
    vericite_enabled?: boolean

    // Settings to pass along to turnitin to control what kinds of matches should be
    // considered. originality_report_visibility can be 'immediate',
    // 'after_grading', 'after_due_date', or 'never' exclude_small_matches_type can
    // be null, 'percent', 'words' exclude_small_matches_value: - if type is null,
    // this will be null also - if type is 'percent', this will be a number between
    // 0 and 100 representing match size to exclude as a percentage of the document
    // size. - if type is 'words', this will be number > 0 representing how many
    // words a match must contain for it to be considered NOTE: This flag will not
    // appear unless your account has the Turnitin plugin available
    @OneToOne(() => TurnitinSettings)
    @Column()
    turnitin_settings?: TurnitinSettings

    // If this is a group assignment, boolean flag indicating whether or not
    // students will be graded individually.
    @Column()
    grade_group_students_individually: boolean

    // (Optional) assignment's settings for external tools if submission_types
    // include 'external_tool'. Only url and new_tab are included (new_tab defaults
    // to false).  Use the 'External Tools' API if you need more information about
    // an external tool.
    @OneToMany(
        () => ExternalToolTagAttributes,
        (externalToolTagAttributes) => externalToolTagAttributes.assignment
    )
    @JoinColumn()
    external_tool_tag_attributes?: ExternalToolTagAttributes[]

    // Boolean indicating if peer reviews are required for this assignment
    @Column()
    peer_reviews: boolean

    // Boolean indicating peer reviews are assigned automatically. If false, the
    // teacher is expected to manually assign peer reviews.
    @Column()
    automatic_peer_reviews: boolean

    // Integer representing the amount of reviews each user is assigned. NOTE: This
    // key is NOT present unless you have automatic_peer_reviews set to true.
    @Column()
    peer_review_count?: number

    // String representing a date the reviews are due by. Must be a date that occurs
    // after the default due date. If blank, or date is not after the assignment's
    // due date, the assignment's due date will be used. NOTE: This key is NOT
    // present unless you have automatic_peer_reviews set to true.
    @Column()
    peer_reviews_assign_at?: Date

    // Boolean representing whether or not members from within the same group on a
    // group assignment can be assigned to peer review their own group's work
    @Column()
    intra_group_peer_reviews: boolean

    // The ID of the assignment’s group set, if this is a group assignment. For
    // group discussions, set group_category_id on the discussion topic, not the
    // linked assignment.
    @JoinColumn()
    group_category_id?: number

    // if the requesting user has grading rights, the number of submissions that
    // need grading.
    @Column()
    needs_grading_count?: number

    // if the requesting user has grading rights and the
    // 'needs_grading_count_by_section' flag is specified, the number of submissions
    // that need grading split out by section. NOTE: This key is NOT present unless
    // you pass the 'needs_grading_count_by_section' argument as true.  ANOTHER
    // NOTE: it's possible to be enrolled in multiple sections, and if a student is
    // setup that way they will show an assignment that needs grading in multiple
    // sections (effectively the count will be duplicated between sections)
    @OneToMany(
        () => NeedsGradingCountBySection,
        (needsGradingCountBySection) => needsGradingCountBySection.assignment
    )
    @JoinColumn()
    needs_grading_count_by_section?: NeedsGradingCountBySection[]

    // the sorting order of the assignment in the group
    @Column()
    position: number

    // (optional, present if Sync Grades to SIS feature is enabled)
    @Column()
    post_to_sis?: boolean

    // (optional, Third Party unique identifier for Assignment)
    @Column()
    integration_id?: string

    // (optional, Third Party integration data for assignment)
    @Column()
    integration_data?: Record<string, string>

    // the maximum points possible for the assignment
    @Column()
    points_possible: number

    // the types of submissions allowed for this assignment list containing one or
    // more of the following: 'discussion_topic', 'online_quiz', 'on_paper', 'none',
    // 'external_tool', 'online_text_entry', 'online_url', 'online_upload',
    // 'media_recording', 'student_annotation'
    @Column()
    submission_types: string[]

    // If true, the assignment has been submitted to by at least one student
    @Column()
    has_submitted_submissions: boolean

    // The type of grading the assignment receives; one of 'pass_fail', 'percent',
    // 'letter_grade', 'gpa_scale', 'points'
    @Column()
    grading_type: string

    // The id of the grading standard being applied to this assignment. Valid if
    // grading_type is 'letter_grade' or 'gpa_scale'.
    @Column()
    grading_standard_id?: string

    // Whether the assignment is published
    @Column()
    published: boolean

    // Whether the assignment's 'published' state can be changed to false. Will be
    // false if there are student submissions for the assignment.
    @Column()
    unpublishable: boolean

    // Whether the assignment is only visible to overrides.
    @Column()
    only_visible_to_overrides: boolean

    // Whether or not this is locked for the user.
    @Column()
    locked_for_user: boolean

    // (Optional) Information for the user about the lock. Present when
    // locked_for_user is true.
    @Column()
    lock_info?: LockInfo

    // (Optional) An explanation of why this is locked for the user. Present when
    // locked_for_user is true.
    @Column()
    lock_explanation?: string

    // (Optional) id of the associated quiz (applies only when submission_types is
    // ['online_quiz'])
    @Column()
    quiz_id?: number

    // (Optional) whether anonymous submissions are accepted (applies only to quiz
    // assignments)
    @Column()
    anonymous_submissions?: boolean

    // (Optional) the DiscussionTopic associated with the assignment, if applicable
    @Column()
    discussion_topic?: DiscussionTopic

    // (Optional) Boolean indicating if assignment will be frozen when it is copied.
    // NOTE: This field will only be present if the AssignmentFreezer plugin is
    // available for your account.
    @Column()
    freeze_on_copy?: boolean

    // (Optional) Boolean indicating if assignment is frozen for the calling user.
    // NOTE: This field will only be present if the AssignmentFreezer plugin is
    // available for your account.
    @Column()
    frozen?: boolean

    // (Optional) Array of frozen attributes for the assignment. Only account
    // administrators currently have permission to change an attribute in this list.
    // Will be empty if no attributes are frozen for this assignment. Possible
    // frozen attributes are: title, description, lock_at, points_possible,
    // grading_type, submission_types, assignment_group_id, allowed_extensions,
    // group_category_id, notify_of_update, peer_reviews NOTE: This field will only
    // be present if the AssignmentFreezer plugin is available for your account.
    @Column()
    frozen_attributes?: string[]

    // (Optional) If 'submission' is included in the 'include' parameter, includes a
    // Submission object that represents the current user's (user who is requesting
    // information from the api) current submission for the assignment. See the
    // Submissions API for an example response. If the user does not have a
    // submission, this key will be absent.
    @OneToOne(() => Submission)
    @JoinColumn()
    submission?: Submission

    // (Optional) If true, the rubric is directly tied to grading the assignment.
    // Otherwise, it is only advisory. Included if there is an associated rubric.
    @Column()
    use_rubric_for_grading?: boolean

    // (Optional) An object describing the basic attributes of the rubric, including
    // the point total. Included if there is an associated rubric.
    @OneToOne(() => RubricSettings)
    @JoinColumn()
    rubric_settings?: RubricSettings

    // (Optional) A list of scoring criteria and ratings for each rubric criterion.
    // Included if there is an associated rubric.
    @OneToMany(
        () => RubricCriteria,
        (rubricCriteria) => rubricCriteria.assignment
    )
    @JoinColumn()
    rubric?: RubricCriteria[]

    // (Optional) If 'assignment_visibility' is included in the 'include' parameter,
    // includes an array of student IDs who can see this assignment.
    @Column()
    assignment_visibility?: number[]

    // (Optional) If 'overrides' is included in the 'include' parameter, includes an
    // array of assignment override objects.
    @Column()
    overrides?: boolean

    // (Optional) If true, the assignment will be omitted from the student's final
    // grade
    @Column()
    omit_from_final_grade?: boolean

    // (Optional) If true, the assignment will not be shown in any gradebooks
    @Column()
    hide_in_gradebook?: boolean

    // Boolean indicating if the assignment is moderated.
    @Column()
    moderated_grading: boolean

    // The maximum number of provisional graders who may issue grades for this
    // assignment. Only relevant for moderated assignments. Must be a positive
    // value, and must be set to 1 if the course has fewer than two active
    // instructors. Otherwise, the maximum value is the number of active instructors
    // in the course minus one, or 10 if the course has more than 11 active
    // instructors.
    @Column()
    grader_count: number

    // The user ID of the grader responsible for choosing final grades for this
    // assignment. Only relevant for moderated assignments.
    @Column()
    final_grader_id?: number

    // Boolean indicating if provisional graders' comments are visible to other
    // provisional graders. Only relevant for moderated assignments.
    @Column()
    grader_comments_visible_to_graders: boolean

    // Boolean indicating if provisional graders' identities are hidden from other
    // provisional graders. Only relevant for moderated assignments with
    // grader_comments_visible_to_graders set to true.
    @Column()
    graders_anonymous_to_graders: boolean

    // Boolean indicating if provisional grader identities are visible to the final
    // grader. Only relevant for moderated assignments.
    @Column()
    grader_names_visible_to_final_grader: boolean

    // Boolean indicating if the assignment is graded anonymously. If true, graders
    // cannot see student identities.
    @Column()
    anonymous_grading: boolean

    // The number of submission attempts a student can make for this assignment. -1
    // is considered unlimited.
    @Column()
    allowed_attempts: number

    // Whether the assignment has manual posting enabled. Only relevant for courses
    // using New Gradebook.
    @Column()
    post_manually: boolean

    // (Optional) If 'score_statistics' and 'submission' are included in the
    // 'include' parameter and statistics are available, includes the min, max, and
    // mode for this assignment
    @OneToMany(
        () => ScoreStatistic,
        (scoreStatistic) => scoreStatistic.assignment
    )
    @JoinColumn()
    score_statistics?: ScoreStatistic[]

    // (Optional) If retrieving a single assignment and 'can_submit' is included in
    // the 'include' parameter, flags whether user has the right to submit the
    // assignment (i.e. checks enrollment dates, submission types, locked status,
    // attempts remaining, etc...). Including 'can submit' automatically includes
    // 'submission' in the include parameter. Not available when observed_users are
    // included.
    @Column()
    can_submit?: boolean

    // (Optional) The academic benchmark(s) associated with the assignment or the
    // assignment's rubric. Only included if 'ab_guid' is included in the 'include'
    // parameter.
    @Column()
    ab_guid?: string[]

    // The id of the attachment to be annotated by students. Relevant only if
    // submission_types includes 'student_annotation'.
    @Column()
    annotatable_attachment_id?: number

    // (Optional) Boolean indicating whether student names are anonymized
    @Column()
    anonymize_students?: boolean

    // (Optional) Boolean indicating whether the Respondus LockDown Browser® is
    // required for this assignment.
    @Column()
    require_lockdown_browser?: boolean

    // (Optional) Boolean indicating whether this assignment has important dates.
    @Column()
    important_dates?: boolean

    // (Optional, Deprecated) Boolean indicating whether notifications are muted for
    // this assignment.
    @Column()
    muted?: boolean

    // Boolean indicating whether peer reviews are anonymous.
    @Column()
    anonymous_peer_reviews: boolean

    // Boolean indicating whether instructor anotations are anonymous.
    @Column()
    anonymous_instructor_annotations: boolean

    // Boolean indicating whether this assignment has graded submissions.
    @Column()
    graded_submissions_exist: boolean

    // Boolean indicating whether this is a quiz lti assignment.
    @Column()
    is_quiz_assignment: boolean

    // Boolean indicating whether this assignment is in a closed grading period.
    @Column()
    in_closed_grading_period: boolean

    // Boolean indicating whether this assignment can be duplicated.
    @Column()
    can_duplicate: boolean

    // If this assignment is a duplicate, it is the original assignment's course_id
    @Column()
    original_course_id?: number

    // If this assignment is a duplicate, it is the original assignment's id
    @Column()
    original_assignment_id?: number

    // If this assignment is a duplicate, it is the original assignment's
    // lti_resource_link_id
    @Column()
    original_lti_resource_link_id?: number

    // If this assignment is a duplicate, it is the original assignment's name
    @Column()
    original_assignment_name?: string

    // If this assignment is a duplicate, it is the original assignment's quiz_id
    @Column()
    original_quiz_id?: number

    // String indicating what state this assignment is in.
    workflow_state: string
}

@Entity()
export class AssignmentDate {
    // (Optional, missing if 'base' is present) id of the assignment override this
    // date represents
    @Column()
    id?: number

    // (Optional, present if 'id' is missing) whether this date represents the
    // assignment's or quiz's default due date
    @Column()
    base?: boolean

    @Column()
    title: string

    // The due date for the assignment. Must be between the unlock date and the lock
    // date if there are lock dates
    @Column()
    due_at: Date

    // The unlock date for the assignment. Must be before the due date if there is a
    // due date.
    @Column()
    unlock_at: Date

    // The lock date for the assignment. Must be after the due date if there is a
    // due date.
    @Column()
    lock_at: Date
}

/**
 * Represents a group of assignments in a course.
 * An assignment group is used to organize assignments and can also include grading rules for that group.
 *
 * @see {@link https://canvas.instructure.com/doc/api/assignment_groups.html} for more details.
 */
@Entity()
export class AssignmentGroup {
    /**
     * The unique identifier for the Assignment Group.
     */
    @PrimaryColumn()
    id: number

    /**
     * (Not part of the official Canvas Assignment Group API, added for convenience)
     * The ID of the course this Assignment Group belongs to.
     * This field was added as it might be helpful for associating assignment groups
     * with courses in future implementations.
     */
    @Column()
    course_id?: number

    /**
     * The name of the Assignment Group.
     */
    @Column()
    name: string

    /**
     * The position (order) of the Assignment Group within the course.
     */
    @Column()
    position: number

    /**
     * The weight of the Assignment Group, typically used for weighted grading.
     */
    @Column()
    group_weight: number

    /**
     * The SIS (Student Information System) source ID for the Assignment Group.
     */
    @Column()
    sis_source_id: string

    /**
     * Additional integration data for the Assignment Group.
     */
    @Column()
    integration_data: object

    /**
     * The list of assignments that belong to this Assignment Group.
     */
    @OneToMany(() => Assignment, (assignment) => assignment.assignment_group)
    @JoinColumn()
    assignments: Assignment[]

    /**
     * Any grading rules that apply to this Assignment Group.
     */
    @Column()
    rules: string
}

@Entity()
export class ScoreStatistic {
    @ManyToOne(() => Assignment, (assignment) => assignment.score_statistics)
    @JoinColumn()
    assignment: Assignment

    // Min score
    @Column()
    min: number

    // Max score
    @Column()
    max: number

    // Mean score
    @Column()
    mean: number

    // Upper quartile score
    @Column()
    upper_q: number

    // Median score
    @Column()
    median: number

    // Lower quartile score
    lower_q: number
}

@Entity()
export class RubricCriteria {
    @Column()
    points: number

    // The id of rubric criteria.
    @PrimaryColumn()
    id: string

    // (Optional) The id of the learning outcome this criteria uses, if any.
    @Column()
    learning_outcome_id?: string

    // (Optional) The 3rd party vendor's GUID for the outcome this criteria
    // references, if any.
    @Column()
    vendor_guid?: string

    @Column()
    description: string

    @Column()
    long_description: string

    @Column()
    criterion_use_range: boolean

    @OneToMany(
        () => RubricRating,
        (rubricRating) => rubricRating.rubric_criteria
    )
    @Column()
    ratings: RubricRating[]

    @Column()
    ignore_for_scoring: boolean

    @ManyToOne(() => Assignment, (assignment) => assignment.rubric)
    @JoinColumn()
    assignment: Assignment
}

@Entity()
export class RubricRating {
    @Column()
    points: number

    @PrimaryColumn()
    id: string

    @Column()
    description: string

    @Column()
    long_description: string

    @ManyToOne(() => RubricCriteria, (rubricCriteria) => rubricCriteria.ratings)
    @JoinColumn()
    rubric_criteria: RubricCriteria
}

@Entity()
export class LockInfo {
    // Asset string for the object causing the lock
    @Column()
    asset_string: string

    // (Optional) Time at which this was/will be unlocked. Must be before the due
    // date.
    @Column()
    unlock_at?: Date

    // (Optional) Time at which this was/will be locked. Must be after the due date.
    @Column()
    lock_at?: Date

    // (Optional) Context module causing the lock.
    @Column()
    context_module: string

    @Column()
    manually_locked: boolean
}

@Entity()
export class ExternalToolTagAttributes {
    @ManyToOne(
        () => Assignment,
        (assignment) => assignment.external_tool_tag_attributes
    )
    @JoinColumn()
    assignment: Assignment

    // URL to the external tool
    @Column()
    url: string

    // Whether or not there is a new tab for the external tool
    @Column()
    new_tab: boolean

    // the identifier for this tool_tag
    @Column()
    resource_link_id: string
}

// originality_report_visibility can be 'immediate',
// 'after_grading', 'after_due_date', or 'never' exclude_small_matches_type can
// be null, 'percent', 'words' exclude_small_matches_value: - if type is null,
// this will be null also - if type is 'percent', this will be a number between
// 0 and 100 representing match size to exclude as a percentage of the document
// size. - if type is 'words', this will be number > 0 representing how many
@Entity()
export class TurnitinSettings {
    @Column()
    originality_report_visibility: OriginallyReportVisibility

    @Column()
    s_paper_check: boolean

    @Column()
    internet_check: boolean

    @Column()
    journal_check: boolean

    @Column()
    exclude_biblio: boolean

    @Column()
    exclude_quoted: boolean

    @Column()
    exclude_small_matches_type: ExcludeSmallMatchesType

    @Column()
    exclude_small_matches_value: number | null
}

export type OriginallyReportVisibility =
    | 'immediate'
    | 'after_grading'
    | 'after_due_date'
    | 'never'

export type ExcludeSmallMatchesType = 'percent' | 'words' | null

@Entity()
export class NeedsGradingCountBySection {
    @ManyToOne(
        () => Assignment,
        (assignment) => assignment.needs_grading_count_by_section
    )
    @JoinColumn()
    assignment: Assignment

    @Column()
    section_id: string

    @Column()
    needs_grading_count: number
}

export class RubricSettings {
    @Column()
    points_possible: string
}
