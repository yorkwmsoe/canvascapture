/* ASSIGNMENTS */

CREATE TABLE IF NOT EXISTS assignment
(
    id                                   integer not null primary key,
    name                                 text    not null,
    description                          text    not null,
    created_at                           date    not null,
    updated_at                           date    not null,
    due_at                               date,
    lock_at                              date,
    has_overrides                        bool    not null,
    all_dates                            date[],
    course_id                            integer not null,
    html_url                             text    not null,
    submissions_download_url             text    not null,
    assigment_group_id                   integer not null,
    due_date_required                    bool    not null,
    allowed_extensions                   text[],
    max_name_length                      integer not null,
    turnitin_enabled                     bool,
    vericite_enabled                     bool,
    turnitin_settings_id                 integer,
    grade_group_students_individually    bool    not null,
    external_tool_tag_attributes         external_tool_tag_attributes[],
    peer_reviews                         bool    not null,
    automatic_peer_reviews               bool    not null,
    peer_review_count                    integer,
    peer_reviews_assign_at               date,
    group_category_id                    integer,
    needs_grading_count                  integer,
    needs_grading_count_by_section       needs_grading_count_by_section[],
    position                             integer not null,
    post_to_sis                          bool,
    integration_id                       text,
    integration_data_id                  integer,
    points_possible                      integer not null,
    submission_types                     pg_enum("discussion_topic", "online_quiz", "on_paper", "none", "external_tool", "online_text_entry", "online_url", "online_upload", "media_recording", "student_annotation")[],
    has_submitted_submissions            bool    not null,
    grading_type                         text    not null,
    grading_standard_id                  text,
    published                            bool    not null,
    unpublishable                        bool    not null,
    only_visible_to_overrides            bool    not null,
    locked_for_user                      bool    not null,
    locked_info_id                       integer,
    lock_explanation                     text,
    quiz_id                              integer,
    anonymous_submissions                bool,
    discussion_topic_id                  integer,
    freeze_on_copy                       bool,
    frozen                               bool,
    frozen_attributes                    text[],
    submission                           submission,
    use_rubric_for_grading               bool,
    rubric_settings                      rubric_settings,
    rubric                               rubric_criteria[],
    assignment_visibility                integer[],
    overrides                            bool,
    omit_from_final_grade                bool,
    hide_in_gradebook                    bool,
    moderated_grading                    bool    not null,
    grader_count                         integer not null,
    final_grader_id                      integer not null,
    grader_comments_visible_to_graders   bool    not null,
    graders_anonymous_to_graders         bool    not null,
    grader_names_visible_to_final_grader bool    not null,
    anonymous_grading                    bool    not null,
    allowed_attempts                     integer not null,
    post_manually                        bool    not null,
    score_statistics                     score_statistic[],
    can_submit                           bool,
    ab_guid                              text[],
    annotatable_attachment_id            integer,
    anonymize_students                   bool,
    require_lockdown_browser             bool,
    important_dates                      bool,
    muted                                bool,
    anonymous_peer_reviews               bool    not null,
    anonymous_instructor_annotations     bool    not null,
    graded_submissions_exist             bool    not null,
    is_quiz_assignment                   bool    not null,
    in_closed_grading_period             bool    not null,
    can_duplicate                        bool    not null,
    original_course_id                   integer,
    original_assignment_id               integer,
    original_lti_resource_link_id        integer,
    original_assignment_name             text,
    original_quiz_id                     integer,
    workflow_state                       text    not null
);

CREATE TABLE IF NOT EXISTS score_statistic
(
    min     float,
    max     float,
    mean    float,
    upper_q float,
    median  float,
    lower_q float
);

CREATE TABLE IF NOT EXISTS rubric_criteria
(
    points              integer         not null,
    id                  text            not null,
    learning_outcome_id text,
    vendor_guid         text,
    description         text            not null,
    criterion_use_range bool            not null,
    ratings             rubric_rating[] not null,
    ignore_for_scoring  bool            not null
);

CREATE TABLE IF NOT EXISTS rubric_rating
(
    points           integer not null,
    id               text    not null,
    description      text    not null,
    long_description text    not null
);

CREATE TABLE IF NOT EXISTS lock_info
(
    asset_string    text not null,
    unlock_at       date,
    lock_at         date,
    context_module  text,
    manually_locked bool
);

CREATE TABLE IF NOT EXISTS external_tool_tag_attributes
(
    url              text not null,
    new_tab          bool not null,
    resource_link_id text not null primary key
);

CREATE TABLE IF NOT EXISTS turnitin_settings
(
    id                            integer                                                          not null primary key,
    originality_report_visibility pg_enum('immediate', 'after_grading', 'after_due_date', 'never') not null,
    s_paper_check                 bool                                                             not null,
    internet_check                bool                                                             not null,
    journal_check                 bool                                                             not null,
    exclude_biblio                bool                                                             not null,
    exclude_quoted                bool                                                             not null,
    exclude_small_matches_type    pg_enum('percent', 'words', null)
);

CREATE TABLE IF NOT EXISTS needs_grading_count_by_section
(
    section_id          text    not null,
    needs_grading_count integer not null
);

CREATE TABLE IF NOT EXISTS rubric_settings
(
    points_possible text not null
);

/* COURSES */

CREATE TABLE IF NOT EXISTS course
(
    id                                   integer not null primary key,
    sis_course_id                        integer,
    uuid                                 text    not null,
    integration_id                       text,
    sis_import_id                        integer,
    name                                 text    not null,
    course_code                          text    not null,
    original_name                        text,
    workflow_state                       text,
    account_id                           integer not null,
    root_account_id                      integer not null,
    enrollment_term_id                   integer not null,
    grading_periods                      grading_period[],
    grading_standard_id                  integer,
    grade_passback_setting               text,
    created_at                           date    not null,
    start_at                             date,
    end_at                               date,
    locale                               text,
    enrollments                          enrollment[],
    total_students                       integer,
    calendar                             text,
    default_view                         text    not null,
    syllabus_body                        text,
    needs_grading_count                  integer,
    term                                 term,
    course_progress_id                   integer,
    apply_assignment_group_weights       boolean not null,
    is_public                            boolean,
    is_public_to_auth_users              boolean not null,
    public_syllabus                      boolean not null,
    public_syllabus_to_auth              boolean not null,
    public_description                   text,
    storage_quota_mb                     integer not null,
    storage_quota_used_mb                integer,
    hide_final_grades                    boolean not null,
    license                              text,
    allow_student_assignment_edits       boolean,
    allow_wiki_comments                  boolean,
    allow_student_forum_attachments      boolean,
    open_enrollment                      boolean,
    self_enrollment                      boolean,
    restrict_enrollments_to_course_dates boolean not null,
    course_format                        text,
    access_restricted_by_date            boolean,
    time_zone                            text,
    blueprint                            boolean,
    template                             boolean,
    last_update_event_date               date    not null
);

CREATE TABLE IF NOT EXISTS course_progress
(
    id                          integer not null primary key,
    requirement_count           integer not null,
    requirement_completed_count integer not null,
    next_requirement_url        text,
    completed_at                date,
    last_update_event_date      date
);

CREATE TABLE IF NOT EXISTS term
(
    id                     integer not null primary key,
    name                   text    not null,
    start_at               date    not null,
    end_at                 date,
    last_update_event_date date
);

/* DISCUSSION TOPICS */

CREATE TABLE IF NOT EXISTS discussion_topic
(
    id                        integer                   not null primary key,
    title                     text                      not null,
    message                   text                      not null,
    html_url                  text                      not null,
    posted_at                 date,
    last_reply_at             Date                      not null,
    require_initial_post      boolean                   not null,
    user_can_see_posts        boolean                   not null,
    discussion_subentry_count integer                   not null,
    read_state                pg_enum("read", "unread") not null,
    unread_count              integer                   not null,
    subscribed                boolean                   not null,
    subscription_hold         pg_enum("not_in_group_set", "not_in_group", "topic_is_announcement", "initial_post_required", null),
    assignment_id             integer,
    delayed_post_at           date                      not null,
    published                 boolean                   not null,
    lock_at                   date                      not null,
    locked                    boolean                   not null,
    pinned                    boolean                   not null,
    locked_for_user           boolean                   not null,
    lock_info                 boolean,
    lock_explanation          text,
    user_name                 text                      not null,
    topic_children            integer[]                 not null,
    group_topic_children      group_topic[]             not null,
    root_topic_id             integer,
    podcast_url               text                      not null,
    discussion_type           pg_enum("side_comment", "threaded"),
    group_category_id         integer,
    attachments               file[],
    permissions               permission[],
    allow_rating              boolean                   not null,
    only_graders_can_rate     boolean                   not null,
    sort_by_rating            boolean                   not null
);

CREATE TABLE IF NOT EXISTS group_topic
(
    id       integer not null primary key,
    group_id integer not null
);

CREATE TABLE IF NOT EXISTS permission
(
    permission_name text not null,
    allowed         bool not null
);

/* ENROLLMENTS */

CREATE TABLE IF NOT EXISTS enrollment
(
    id                                    integer                                                                                                       not null primary key,
    course_id                             integer                                                                                                       not null,
    sis_course_id                         text                                                                                                          not null,
    course_integration_id                 text                                                                                                          not null,
    course_section_id                     integer                                                                                                       not null,
    section_integration_id                text,
    sis_account_id                        text,
    sis_section_id                        text,
    sis_user_id                           text,
    enrollment_state                      text                                                                                                          not null,
    limit_privileges_to_course_section    boolean                                                                                                       not null,
    sis_import_id                         integer                                                                                                       not null,
    root_account_id                       integer                                                                                                       not null,
    type                                  pg_enum("StudentEnrollment", "TeacherEnrollment", "TaEnrollment", "DesignerEnrollment", "ObserverEnrollment") not null,
    user_id                               integer                                                                                                       not null,
    associated_user_id                    integer,
    role                                  text                                                                                                          not null,
    role_id                               integer                                                                                                       not null,
    created_at                            Date                                                                                                          not null,
    updated_at                            Date                                                                                                          not null,
    start_at                              Date                                                                                                          not null,
    end_at                                Date                                                                                                          not null,
    last_activity_at                      Date                                                                                                          not null,
    last_attended_at                      Date                                                                                                          not null,
    total_activity_time                   integer                                                                                                       not null,
    html_url                              text                                                                                                          not null,
    grades                                grade                                                                                                         not null,
    canvas_user                           canvas_user                                                                                                   not null,
    override_grade                        text                                                                                                          not null,
    override_score                        integer                                                                                                       not null,
    unposted_current_grade                text,
    unposted_final_grade                  text,
    unposted_current_score                text,
    unposted_final_score                  text,
    has_grading_periods                   boolean,
    totals_for_all_grading_periods_option boolean,
    current_grading_period_title          text,
    current_grading_period_id             integer,
    current_period_override_score         integer                                                                                                       not null,
    current_period_unposted_current_score integer,
    current_period_unposted_final_score   integer,
    current_period_unposted_current_grade text,
    current_period_unposted_final_grade   text
);

CREATE TABLE IF NOT EXISTS grade
(
    html_url                text    not null,
    current_grade           text    not null,
    final_grade             text    not null,
    current_score           text    not null,
    final_score             text    not null,
    current_points          integer not null,
    unposted_current_grade  text,
    unposted_final_grade    text,
    unposted_current_score  text,
    unposted_final_score    text,
    unposted_current_points integer not null
);

/* FILES */

CREATE TABLE IF NOT EXISTS file
(
    id               integer                                               not null primary key,
    uuid             text                                                  not null,
    folder_id        integer                                               not null,
    display_name     text                                                  not null,
    filename         text                                                  not null,
    content_type     text                                                  not null,
    url              text                                                  not null,
    size             integer                                               not null,
    created_at       Date                                                  not null,
    updated_at       Date                                                  not null,
    unlock_at        Date                                                  not null,
    locked           boolean                                               not null,
    hidden           boolean                                               not null,
    lock_at          Date                                                  not null,
    hidden_for_user  boolean                                               not null,
    visibility_level pg_enum("course", "instituiton", "public", "inherit") not null,
    thumbnail_url    text                                                  not null,
    modified_at      Date                                                  not null,
    mime_class       text                                                  not null,
    media_entry_id   text                                                  not null,
    locked_for_user  boolean                                               not null,
    lock_info        lock_info                                             not null,
    lock_explanation text                                                  not null,
    preview_url      text
);

/* GRADING PERIODS*/

CREATE TABLE IF NOT EXISTS grading_period
(
    id         integer not null primary key,
    title      text    not null,
    start_date Date    not null,
    end_date   Date    not null,
    close_date Date    not null,
    weight     integer not null,
    is_closed  boolean not null
);

/* QUIZZES */

CREATE TABLE IF NOT EXISTS quiz
(
    id                                   integer        not null primary key,
    title                                text           not null,
    html_url                             text           not null,
    mobile_url                           text           not null,
    description                          text           not null,
    quiz_type                            text           not null,
    time_limit                           integer,
    timer_autosubmit_disabled            boolean        not null,
    shuffle_answers                      boolean        not null,
    show_correct_answers                 boolean        not null,
    scoring_policy                       text           not null,
    allowed_attempts                     integer        not null,
    one_question_at_a_time               boolean        not null,
    question_count                       integer        not null,
    points_possible                      integer        not null,
    cant_go_back                         boolean        not null,
    access_code                          text,
    ip_filter                            text,
    due_at                               Date,
    lock_at                              Date,
    unlock_at                            Date,
    published                            boolean        not null,
    unpublishable                        boolean        not null,
    locked_for_user                      boolean        not null,
    lock_info                            quiz_lock_info not null,
    lock_explanation                     text           not null,
    hide_results                         boolean,
    show_correct_answers_at              date,
    hide_correct_answers_at              date,
    all_dates                            quiz_date[],
    can_unpublish                        boolean        not null,
    can_update                           boolean        not null,
    require_lockdown_browser             boolean        not null,
    require_lockdown_browser_for_results boolean        not null,
    require_lockdown_browser_monitor     boolean        not null,
    speed_grader_url                     text           not null,
    permissions                          quiz_permissions,
    quiz_reports_url                     text,
    quiz_statistics_url                  text,
    message_students_url                 text,
    section_count                        integer        not null,
    important_dates                      boolean        not null,
    quiz_submission_versions_html_url    text           not null,
    assignment_id                        integer        not null,
    one_time_results                     boolean        not null,
    only_visible_to_overrides            boolean        not null,
    assignment_group_id                  integer        not null,
    show_correct_answers_last_attempt    boolean        not null,
    version_number                       integer        not null,
    has_access_code                      boolean        not null,
    post_to_sis                          boolean        not null,
    migration_id                         integer        not null,
    in_paced_course                      boolean        not null,
    question_types                       text[]         not null
);

CREATE TABLE IF NOT EXISTS quiz_lock_info
(
    missing_permission text not null,
    asset_string       text not null
);

CREATE TABLE IF NOT EXISTS quiz_date
(
    due_at    Date,
    unlock_at Date,
    lock_at   Date,
    base      boolean not null
);

CREATE TABLE IF NOT EXISTS quiz_permissions
(
    manage               boolean not null,
    read                 boolean not null,
    permission_to_create boolean not null,
    update               boolean not null,
    submit               boolean not null,
    preview              boolean not null,
    delete               boolean not null,
    read_statistics      boolean not null,
    grade                boolean not null,
    review_grades        boolean not null,
    view_answer_audits   boolean not null
);

/* QUIZ QUESTIONS */

CREATE TABLE IF NOT EXISTS quiz_question
(
    id                                integer                  not null primary key,
    quiz_id                           integer                  not null,
    quiz_group_id                     integer,
    assessment_question_id            integer                  not null,
    position                          integer                  not null,
    question_name                     text                     not null,
    question_type                     text                     not null,
    question_text                     text                     not null,
    points_possible                   integer                  not null,
    correct_comments                  text                     not null,
    incorrect_comments                text                     not null,
    neutral_comments                  text                     not null,
    correct_comments_html             text                     not null,
    incorrect_comments_html           text                     not null,
    neutral_comments_html             text                     not null,
    answers                           quiz_submission_answer[] not null,
    variables                         variable[]               not null,
    formulas                          text[]                   not null,
    answer_tolerance                  integer,
    formula_decimal_places            integer,
    matches                           match[],
    matching_answer_incorrect_matches text
);

CREATE TABLE IF NOT EXISTS quiz_submission_answer
(
    id            text    not null,
    text          text    not null,
    comments      text    not null,
    comments_html text    not null,
    weight        integer not null,
    blank_id      text    not null
);

CREATE TABLE IF NOT EXISTS question_data
(
    quiz_id              integer                  not null primary key,
    question_name        text                     not null,
    question_description text                     not null,
    position             integer                  not null,
    points_possible      integer                  not null,
    correct_comments     text                     not null,
    neutral_comments     text                     not null,
    incorrect_comments   text                     not null,
    correct_answers      quiz_submission_answer[] not null,
    correct              text                     not null
);

CREATE TABLE IF NOT EXISTS variable
(
    name  text    not null,
    min   integer not null,
    max   integer not null,
    scale integer not null
);

CREATE TABLE IF NOT EXISTS match
(
    text     text    not null,
    match_id integer not null
);

/* QUIZ SUBMISSION QUESTIONS */

CREATE TABLE quiz_submission_question
(
    id                     integer    not null primary key,
    quiz_id                integer    not null,
    quiz_group_id          integer,
    assessment_question_id integer    not null,
    position               integer    not null,
    question_name          text       not null,
    question_type          text       not null,
    question_text          text       not null,
    answers                answer[]   not null,
    variables              variable[] not null,
    formulas               text[]  not null,
    answer_tolerance       integer,
    formula_decimal_places integer,
    matches                match[]    not null,
    flagged                boolean    not null,
    correct                text       not null
);

CREATE TABLE IF NOT EXISTS answer
(
    id   integer not null primary key,
    text text,
    html text
);

/* QUIZ SUBMISSIONS */

CREATE TABLE IF NOT EXISTS quiz_submission
(
    id                           integer not null primary key,
    quiz_id                      integer not null,
    quiz_version                 integer not null,
    user_id                      integer,
    submission_id                integer,
    score                        integer,
    kept_score                   integer,
    started_at                   Date,
    end_at                       Date,
    finished_at                  Date,
    attempt                      integer not null,
    workflow_state               text    not null,
    fudge_points                 integer,
    quiz_points_possible         integer not null,
    extra_attempts               integer,
    extra_time                   integer,
    manually_unlocked            boolean,
    validation_token             text    not null,
    score_before_regrade         integer,
    has_seen_results             boolean,
    time_spent                   integer,
    attempts_left                integer not null,
    overdue_and_needs_submission boolean not null,
    excused                      boolean,
    html_url                     text    not null,
    result_url                   text    not null
);

/* SUBMISSIONS */

CREATE TABLE IF NOT EXISTS submission
(
    id                               integer                                                                                                             not null primary key,
    assignment_id                    integer                                                                                                             not null,
    assignment                       assignment,
    course                           course,
    attempt                          integer                                                                                                             not null,
    body                             text                                                                                                                not null,
    grade                            text                                                                                                                not null,
    grade_matches_current_submission boolean                                                                                                             not null,
    html_url                         text,
    preview_url                      text                                                                                                                not null,
    score                            integer                                                                                                             not null,
    submission_comments              submission_comment[],
    submission_type                  pg_enum("online_text_entry", "online_url", "online_upload", "online_quiz", "media_recording", "student_annotation") not null,
    submitted_at                     Date                                                                                                                not null,
    url                              text,
    user_id                          integer                                                                                                             not null,
    grader_id                        integer                                                                                                             not null,
    graded_at                        Date                                                                                                                not null,
    canvas_user                      canvas_user,
    late                             boolean                                                                                                             not null,
    assignment_visible               boolean,
    excused                          boolean                                                                                                             not null,
    missing                          boolean                                                                                                             not null,
    late_policy_status               pg_enum('missing', 'late', 'none', 'extended'),
    points_deducted                  integer,
    seconds_late                     integer                                                                                                             not null,
    workflow_state                   pg_enum("submitted", "unsubmitted", "graded", "pending_review"),
    extra_attempts                   integer                                                                                                             not null,
    anonymous_id                     text                                                                                                                not null,
    posted_at                        Date                                                                                                                not null,
    read_status                      pg_enum("read", "unread"),
    redo_request                     boolean                                                                                                             not null,
    entered_grade                    text                                                                                                                not null,
    entered_score                    integer                                                                                                             not null,
    rubric_assessment                rubric_assessment,
    attachments                      submission_attachment[],
    media_comment                    media_comment
);

CREATE TABLE IF NOT EXISTS submission_attachment
(
    id              integer not null primary key,
    uuid            text    not null,
    folder_id       integer not null,
    display_name    text    not null,
    filename        text    not null,
    upload_status   text    not null,
    content_type    text    not null,
    url             text    not null,
    size            integer not null,
    created_at      date    not null,
    updated_at      date    not null,
    unlock_at       date,
    locked          boolean not null,
    hidden          boolean not null,
    lock_at         date,
    hidden_for_user boolean not null,
    thumbnail_url   text    not null,
    modified_at     date    not null,
    mime_class      text    not null,
    media_entry_id  date,
    category        text    not null,
    locked_for_user boolean not null,
    preview_url     text
);

CREATE TABLE IF NOT EXISTS submission_comment
(
    id            integer,
    author_id     integer,
    author_name   text,
    author        user_display,
    comment       text,
    created_at    date,
    edited_at     date,
    media_comment media_comment
);

CREATE TABLE IF NOT EXISTS media_comment
(
    content_type text not null,
    display_name text,
    media_id     text not null,
    media_type   text not null,
    url          text not null
);

CREATE TABLE IF NOT EXISTS rubric_assessment
(
    rubric_name                 text,
    rubric_assessment_criterion rubric_assessment_criterion
);

CREATE TABLE IF NOT EXISTS rubric_assessment_criterion
(
    points    integer not null,
    comments  text    not null,
    rating_id text    not null
);

/* USERS */

CREATE TABLE IF NOT EXISTS canvas_user
(
    id                     integer not null primary key,
    name                   text    not null,
    sortable_name          text    not null,
    last_name              text    not null,
    first_name             text    not null,
    short_name             text    not null,
    sis_user_id            text,
    integration_id         text,
    login_id               text,
    avatar_url             text,
    avatar_state           text,
    enrollments            enrollment[],
    email                  text,
    locale                 text,
    last_login             date,
    time_zone              text,
    bio                    text,
    pronouns               text,
    last_update_event_date date
);

CREATE TABLE IF NOT EXISTS user_display
(
    id                     integer not null primary key,
    short_name             text    not null,
    avatar_image_url       text,
    html_url               text,
    last_update_event_date date
);