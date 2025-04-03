import { MigrationInterface, QueryRunner } from 'typeorm'

export class FrontEnd1743716276793 implements MigrationInterface {
    name = 'FrontEnd1743716276793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_display" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "short_name" text NOT NULL, "avatar_image_url" text, "html_url" text NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "submission_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "author_id" numeric NOT NULL, "author_name" text NOT NULL, "comment" text NOT NULL, "created_at" date NOT NULL, "edited_at" date NOT NULL, "authorId" numeric, "mediaCommentMediaId" text, "submissionId" numeric, CONSTRAINT "REL_85500b87f8bc1a38301af5db73" UNIQUE ("mediaCommentMediaId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "user" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "sortable_name" text NOT NULL, "last_name" text NOT NULL, "first_name" text NOT NULL, "short_name" text NOT NULL, "sis_user_id" text, "sis_import_id" numeric, "integration_id" text, "login_id" text NOT NULL, "avatar_url" text NOT NULL, "avatar_state" text, "email" text, "locale" text, "last_login" date, "time_zone" text, "bio" text, "enrollmentsId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "submission_attachment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" numeric NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "upload_status" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "hidden_for_user" boolean NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "category" text NOT NULL, "locked_for_user" boolean NOT NULL, "submissionId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "assignment_id" numeric NOT NULL, "attempt" numeric NOT NULL, "body" text NOT NULL, "grade" text NOT NULL, "grade_matches_current_submission" boolean NOT NULL, "html_url" text, "preview_url" text NOT NULL, "score" numeric NOT NULL, "submission_commentsIds" text, "submission_type" text NOT NULL, "submitted_at" date NOT NULL, "url" text, "user_id" numeric NOT NULL, "grader_id" numeric NOT NULL, "graded_at" date NOT NULL, "userId" numeric, "late" boolean NOT NULL, "assignment_visible" boolean, "excused" boolean NOT NULL, "missing" boolean NOT NULL, "late_policy_status" text, "points_deducted" numeric, "seconds_late" numeric NOT NULL, "workflow_state" text NOT NULL, "extra_attempts" numeric, "anonymous_id" text NOT NULL, "posted_at" date NOT NULL, "read_status" text, "redo_request" boolean NOT NULL, "entered_grade" text NOT NULL, "entered_score" numeric NOT NULL, "media_commentId" numeric, "assignmentId" numeric, "courseId" text, "mediaCommentMediaId" text, CONSTRAINT "REL_ef99745f278ca701c5efe5d8dd" UNIQUE ("assignmentId"), CONSTRAINT "REL_7bd626272858ef6464aa257909" UNIQUE ("userId"), CONSTRAINT "REL_aa507b5db29b1ab1b65544c910" UNIQUE ("mediaCommentMediaId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "assignment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "due_at" date, "lock_at" date, "unlock_at" date, "has_overrides" boolean NOT NULL, "all_dates" text, "course_id" numeric NOT NULL, "html_url" text NOT NULL, "submissions_download_url" text NOT NULL, "assignment_group_id" numeric, "due_date_required" boolean NOT NULL, "allowed_extensions" text, "max_name_length" numeric NOT NULL, "turnitin_enabled" boolean, "vericite_enabled" boolean, "turnitin_settingsId" numeric, "grade_group_students_individually" boolean NOT NULL, "external_tool_tag_attributesId" numeric, "peer_reviews" boolean NOT NULL, "automatic_peer_reviews" boolean NOT NULL, "peer_review_count" numeric, "peer_reviews_assign_at" date, "intra_group_peer_reviews" boolean NOT NULL, "group_category_id" numeric, "needs_grading_count" numeric, "needs_grading_count_by_sectionId" numeric, "position" numeric NOT NULL, "post_to_sis" boolean, "integration_id" text, "integration_data" text, "points_possible" numeric NOT NULL, "submission_types" text NOT NULL, "has_submitted_submissions" boolean NOT NULL, "grading_type" text NOT NULL, "grading_standard_id" text, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info_id" numeric, "lock_explanation" text, "quiz_id" numeric, "anonymous_submissions" boolean, "discussion_topicId" numeric, "freeze_on_copy" boolean, "frozen" boolean, "frozen_attributes" text, "submission_id" numeric, "use_rubric_for_grading" boolean, "rubric_settingsId" numeric, "rubricIds" text, "assignment_visibility" text, "overrides" text, "omit_from_final_grade" boolean, "hide_in_gradebook" boolean, "moderated_grading" boolean NOT NULL, "grader_count" numeric NOT NULL, "final_grader_id" numeric, "grader_comments_visible_to_graders" boolean NOT NULL, "graders_anonymous_to_graders" boolean NOT NULL, "grader_names_visible_to_final_grader" boolean NOT NULL, "anonymous_grading" boolean NOT NULL, "allowed_attempts" numeric NOT NULL, "post_manually" boolean NOT NULL, "score_statisticsIds" text, "can_submit" boolean, "ab_guid" text, "annotatable_attachment_id" numeric, "anonymize_students" boolean, "require_lockdown_browser" boolean, "important_dates" boolean, "muted" boolean, "anonymous_peer_reviews" boolean NOT NULL, "anonymous_instructor_annotations" boolean NOT NULL, "graded_submissions_exist" boolean NOT NULL, "is_quiz_assignment" boolean NOT NULL, "in_closed_grading_period" boolean NOT NULL, "can_duplicate" boolean NOT NULL, "original_course_id" numeric, "original_assignment_id" numeric, "original_lti_resource_link_id" numeric, "original_assignment_name" text, "original_quiz_id" numeric, "workflow_state" text NOT NULL, "assignmentGroupId" numeric, "turnitinSettingsId" numeric, "lockInfoAssetString" text, "discussionTopicId" numeric, "submissionId" numeric, "rubricSettingsPoints_possible" text NOT NULL, CONSTRAINT "REL_d7a7ff231c8a414a4786f0eda3" UNIQUE ("turnitinSettingsId"), CONSTRAINT "REL_5974c4c01db31c18802ae348e7" UNIQUE ("lockInfoAssetString"), CONSTRAINT "REL_bcfcd42d6d375b74a0cb217ed6" UNIQUE ("quiz_id"), CONSTRAINT "REL_41fbd4d914c50ec129cf973610" UNIQUE ("discussionTopicId"), CONSTRAINT "REL_f8a7760a0a4a8a662d19b9fa82" UNIQUE ("submissionId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "assignment_date" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "base" boolean, "title" text NOT NULL, "due_at" date NOT NULL, "unlock_at" date NOT NULL, "lock_at" date NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "assignment_group" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "courseId" text, "name" text NOT NULL, "position" numeric NOT NULL, "group_weight" numeric NOT NULL, "sis_source_id" text NOT NULL, "integration_data" text NOT NULL, "rules" text NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "external_tool_tag_attributes" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "url" text NOT NULL, "new_tab" boolean NOT NULL, "resource_link_id" text PRIMARY KEY NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "lock_info" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "asset_string" text PRIMARY KEY NOT NULL, "unlock_at" date, "lock_at" date, "context_module" text NOT NULL, "manually_locked" boolean NOT NULL, "file_id" numeric, "assignmentId" numeric, CONSTRAINT "REL_691294c6a79f33a3ad4ccfbf7b" UNIQUE ("assignmentId"), CONSTRAINT "REL_efec4a6fb81d5b0642d28fdbbb" UNIQUE ("file_id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "needs_grading_count_by_section" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "section_id" text PRIMARY KEY NOT NULL, "needs_grading_count" numeric NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_criteria" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "learning_outcome_id" text, "vendor_guid" text, "description" text NOT NULL, "long_description" text NOT NULL, "criterion_use_range" boolean NOT NULL, "ignore_for_scoring" boolean NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_rating" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "description" text NOT NULL, "long_description" text NOT NULL, "rubricCriteriaId" text)`
        )
        await queryRunner.query(
            `CREATE TABLE "score_statistic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "mean" numeric NOT NULL, "upper_q" numeric NOT NULL, "median" numeric NOT NULL, "lower_q" numeric NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "turnitin_settings" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "originality_report_visibility" text NOT NULL, "s_paper_check" boolean NOT NULL, "internet_check" boolean NOT NULL, "journal_check" boolean NOT NULL, "exclude_biblio" boolean NOT NULL, "exclude_quoted" boolean NOT NULL, "exclude_small_matches_type" text NOT NULL, "exclude_small_matches_value" numeric, "assignmentId" numeric, CONSTRAINT "REL_948553dbefee660af977e8b646" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "blueprint_restrictions" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content" boolean NOT NULL, "points" boolean NOT NULL, "due_dates" boolean NOT NULL, "availability_dates" boolean NOT NULL, "courseId" text PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "course" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "sis_course_id" numeric, "uuid" text NOT NULL, "integration_id" text, "sis_import_id" text, "name" text NOT NULL, "course_code" text NOT NULL, "original_name" text, "workflow_state" text NOT NULL, "account_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "enrollment_term_id" numeric NOT NULL, "grading_standard_id" numeric, "grade_passback_setting" text, "created_at" date NOT NULL, "start_at" date, "end_at" date, "locale" text, "total_students" numeric, "default_view" text NOT NULL, "syllabus_body" text, "needs_grading_count" numeric, "apply_assignment_group_weights" boolean NOT NULL, "permissions" text, "is_public" boolean, "is_public_to_auth_users" boolean NOT NULL, "public_syllabus" boolean NOT NULL, "public_syllabus_to_auth" boolean NOT NULL, "public_description" text, "storage_quota_mb" numeric NOT NULL, "storage_quota_used_mb" numeric, "hide_final_grades" boolean NOT NULL, "license" text, "allow_student_assignment_edits" boolean, "allow_wiki_comments" boolean, "allow_student_forum_attachments" boolean, "open_enrollment" boolean, "self_enrollment" boolean, "restrict_enrollments_to_course_dates" boolean NOT NULL, "course_format" text, "access_restricted_by_date" boolean, "time_zone" text, "blueprint" boolean, "blueprint_restrictionsId" numeric, "blueprint_restrictions_by_object_type" json, "template" boolean, "assignment_groupsIds" text, "courseProgressCourseId" numeric, "blueprintRestrictionsCourseId" text, "calendarIcs" text NOT NULL, CONSTRAINT "REL_176e1fe6a79f62e0f66994452f" UNIQUE ("courseProgressCourseId"), CONSTRAINT "REL_76e7ec4cb66fa0e276e1341efc" UNIQUE ("blueprintRestrictionsCourseId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "course_progress" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "requirement_count" numeric NOT NULL, "requirement_completed_count" numeric NOT NULL, "next_requirement_url" text, "completed_at" date, "courseId" text PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "term" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" date NOT NULL, "start_at" date NOT NULL, "end_at" date)`
        )
        await queryRunner.query(
            `CREATE TABLE "discussion_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "message" text NOT NULL, "html_url" text NOT NULL, "posted_at" date, "last_reply_at" date NOT NULL, "require_initial_post" boolean NOT NULL, "user_can_see_posts" boolean NOT NULL, "discussion_subentry_count" numeric NOT NULL, "read_state" text NOT NULL, "unread_count" numeric NOT NULL, "subscribed" boolean NOT NULL, "subscription_hold" text, "assignment_id" numeric, "delayed_post_at" date NOT NULL, "published" boolean NOT NULL, "lock_at" date NOT NULL, "locked" boolean NOT NULL, "pinned" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" boolean, "lock_explanation" text, "user_name" text NOT NULL, "topic_children" text NOT NULL, "root_topic_id" numeric, "podcast_url" text NOT NULL, "discussion_type" text NOT NULL, "group_category_id" numeric, "permissions" text NOT NULL, "allow_rating" boolean NOT NULL, "only_graders_can_rate" boolean NOT NULL, "sort_by_rating" boolean NOT NULL, "assignmentId" numeric, CONSTRAINT "REL_cece40a698be539595c41f1387" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "group_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "group_id" numeric NOT NULL, "discussionTopicId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "enrollment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "sis_course_id" text NOT NULL, "course_integration_id" text NOT NULL, "course_section_id" numeric NOT NULL, "section_integration_id" numeric, "sis_account_id" text, "sis_section_id" text, "sis_user_id" text, "enrollment_state" text NOT NULL, "limit_privileges_to_course_section" boolean NOT NULL, "sis_import_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "type" text NOT NULL, "user_id" numeric NOT NULL, "associated_user_id" numeric NOT NULL, "role" text NOT NULL, "role_id" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "start_at" date NOT NULL, "end_at" date NOT NULL, "last_activity_at" date NOT NULL, "last_attended_at" date NOT NULL, "total_activity_time" numeric NOT NULL, "html_url" text NOT NULL, "override_grade" text NOT NULL, "override_score" text NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "has_grading_periods" boolean, "totals_for_all_grading_periods_option" boolean, "current_grading_period_title" text, "current_grading_period_id" numeric, "current_period_override_grade" text NOT NULL, "current_period_override_score" numeric NOT NULL, "current_period_unposted_current_score" numeric, "current_period_unposted_final_score" numeric, "current_period_unposted_current_grade" text, "current_period_unposted_final_grade" text, "courseId" text, "gradesEnrollmentId" numeric, "userId" numeric, CONSTRAINT "REL_298aa846f79fca9dcc319bbde1" UNIQUE ("gradesEnrollmentId"), CONSTRAINT "REL_e97ecbf11356b5173ce7fb0b06" UNIQUE ("userId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "grade" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "html_url" text NOT NULL, "current_grade" text NOT NULL, "final_grade" text NOT NULL, "current_score" text NOT NULL, "final_score" text NOT NULL, "current_points" numeric NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "unposted_current_points" numeric NOT NULL, "enrollment_id" numeric PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "file" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "unlock_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "lock_at" date NOT NULL, "hidden_for_user" boolean NOT NULL, "visibility_level" text NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "media_entry_id" text NOT NULL, "locked_for_user" boolean NOT NULL, "lock_explanation" varchar NOT NULL, "preview_url" varchar NOT NULL, "lockInfoAssetString" text, "discussionTopicId" numeric, CONSTRAINT "REL_fea9cade6fd5f1819602503a8e" UNIQUE ("lockInfoAssetString"))`
        )
        await queryRunner.query(
            `CREATE TABLE "grading_period" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "close_date" date NOT NULL, "weight" numeric NOT NULL, "is_closed" boolean NOT NULL, "courseId" text)`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "html_url" text NOT NULL, "mobile_url" text NOT NULL, "description" text NOT NULL, "quiz_type" text NOT NULL, "time_limit" numeric, "timer_autosubmit_disabled" boolean NOT NULL, "shuffle_answers" boolean NOT NULL, "show_correct_answers" boolean NOT NULL, "scoring_policy" text NOT NULL, "allowed_attempts" numeric NOT NULL, "one_question_at_a_time" numeric NOT NULL, "question_count" numeric NOT NULL, "points_possible" numeric NOT NULL, "cant_go_back" boolean NOT NULL, "access_code" text, "ip_filter" text, "due_at" date, "lock_at" date, "unlock_at" date, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" text NOT NULL, "lock_explanation" text NOT NULL, "hide_results" boolean, "show_correct_answers_at" date, "hide_correct_answers_at" date, "all_dates" text NOT NULL, "can_unpublish" boolean NOT NULL, "can_update" boolean NOT NULL, "require_lockdown_browser" boolean NOT NULL, "require_lockdown_browser_for_results" boolean NOT NULL, "require_lockdown_browser_monitor" boolean NOT NULL, "lockdown_browser_monitor_data" text NOT NULL, "speed_grader_url" text NOT NULL, "permissions" text NOT NULL, "quiz_reports_url" text NOT NULL, "quiz_statistics_url" text NOT NULL, "message_students_url" text NOT NULL, "section_count" numeric NOT NULL, "important_dates" boolean NOT NULL, "quiz_submission_versions_html_url" text NOT NULL, "one_time_results" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "show_correct_answers_last_attempt" boolean NOT NULL, "version_number" numeric NOT NULL, "has_access_code" boolean NOT NULL, "post_to_sis" boolean NOT NULL, "migration_id" numeric NOT NULL, "in_paced_course" boolean NOT NULL, "question_types" text NOT NULL, "assignmentId" numeric, "assignmentGroupId" numeric, CONSTRAINT "REL_cefa2a420bf9c9752794759549" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "formula" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "formula" text PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "match" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "text" text NOT NULL, "match_id" numeric PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "question_data" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "quiz_id" numeric NOT NULL, "question_name" text NOT NULL, "question_description" text NOT NULL, "position" numeric NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "neutral_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "correct" text NOT NULL, "question_type" text NOT NULL, PRIMARY KEY ("quiz_id", "question_name"))`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_question" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_group_id" numeric, "assessment_question_id" numeric NOT NULL, "position" numeric NOT NULL, "question_name" text NOT NULL, "question_type" text NOT NULL, "question_text" text NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "neutral_comments" text NOT NULL, "correct_comments_html" text NOT NULL, "incorrect_comments_html" text NOT NULL, "neutral_comments_html" text NOT NULL, "answer_tolerance" numeric, "formula_decimal_places" numeric, "matching_answer_incorrect_matches" text, "quizId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_submission_answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "text" text NOT NULL, "comments" text NOT NULL, "comments_html" text NOT NULL, "weight" numeric NOT NULL, "blank_id" text NOT NULL, "quizQuestionId" numeric, "questionDataQuizId" numeric, "questionDataQuestionName" text)`
        )
        await queryRunner.query(
            `CREATE TABLE "variable" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "name" text PRIMARY KEY NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "scale" numeric NOT NULL, "quiz_questionId" numeric, "quizQuestionId" numeric, "quizSubmissionQuestionId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_version" numeric NOT NULL, "user_id" numeric, "submission_id" numeric, "score" numeric, "kept_score" numeric, "started_at" date, "end_at" date, "finished_at" date, "attempt" numeric NOT NULL, "workflow_state" text NOT NULL, "fudge_points" numeric, "quiz_points_possible" numeric NOT NULL, "extra_attempts" numeric, "extra_time" numeric, "manually_unlocked" boolean, "validation_token" text NOT NULL, "score_before_regrade" numeric, "has_seen_results" boolean, "time_spent" numeric, "attempts_left" numeric NOT NULL, "overdue_and_needs_submission" boolean NOT NULL, "excused" boolean, "html_url" text NOT NULL, "result_url" text NOT NULL, "quizId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "html" varchar NOT NULL, "quizSubmissionQuestionId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_submission_question" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_id" numeric NOT NULL, "quiz_group_id" numeric, "assessment_question_id" numeric NOT NULL, "position" numeric NOT NULL, "question_name" text NOT NULL, "question_type" text NOT NULL, "question_text" text NOT NULL, "answer_tolerance" numeric, "formula_decimal_places" numeric, "flagged" boolean NOT NULL, "correct" text NOT NULL)`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_assessment_criterion" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "points" numeric NOT NULL, "comments" text NOT NULL, "rating_id" text NOT NULL, "rubricCriteriaId" text, "submissionId" numeric)`
        )
        await queryRunner.query(
            `CREATE TABLE "media_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content-type" text NOT NULL, "display_name" text NOT NULL, "media_id" text PRIMARY KEY NOT NULL, "media_type" text NOT NULL, "url" text NOT NULL, "submissionId" numeric, "submissionCommentId" numeric, CONSTRAINT "REL_1656c306c331c3849e35f802d2" UNIQUE ("submissionId"), CONSTRAINT "REL_fb83368172786be55b469391b0" UNIQUE ("submissionCommentId"))`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_submission_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "author_id" numeric NOT NULL, "author_name" text NOT NULL, "comment" text NOT NULL, "created_at" date NOT NULL, "edited_at" date NOT NULL, "authorId" numeric, "mediaCommentMediaId" text, "submissionId" numeric, CONSTRAINT "REL_85500b87f8bc1a38301af5db73" UNIQUE ("mediaCommentMediaId"), CONSTRAINT "FK_c699d3303f761f0789bef03112f" FOREIGN KEY ("authorId") REFERENCES "user_display" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_85500b87f8bc1a38301af5db732" FOREIGN KEY ("mediaCommentMediaId") REFERENCES "media_comment" ("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_085f08fcc3ca2a4213abd937e51" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_submission_comment"("date_last_received_from_canvas", "id", "author_id", "author_name", "comment", "created_at", "edited_at", "authorId", "mediaCommentMediaId", "submissionId") SELECT "date_last_received_from_canvas", "id", "author_id", "author_name", "comment", "created_at", "edited_at", "authorId", "mediaCommentMediaId", "submissionId" FROM "submission_comment"`
        )
        await queryRunner.query(`DROP TABLE "submission_comment"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_submission_comment" RENAME TO "submission_comment"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_user" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "sortable_name" text NOT NULL, "last_name" text NOT NULL, "first_name" text NOT NULL, "short_name" text NOT NULL, "sis_user_id" text, "sis_import_id" numeric, "integration_id" text, "login_id" text NOT NULL, "avatar_url" text NOT NULL, "avatar_state" text, "email" text, "locale" text, "last_login" date, "time_zone" text, "bio" text, "enrollmentsId" numeric, CONSTRAINT "FK_da769620f6608223f9f11f4197d" FOREIGN KEY ("enrollmentsId") REFERENCES "enrollment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_user"("date_last_received_from_canvas", "id", "name", "sortable_name", "last_name", "first_name", "short_name", "sis_user_id", "sis_import_id", "integration_id", "login_id", "avatar_url", "avatar_state", "email", "locale", "last_login", "time_zone", "bio", "enrollmentsId") SELECT "date_last_received_from_canvas", "id", "name", "sortable_name", "last_name", "first_name", "short_name", "sis_user_id", "sis_import_id", "integration_id", "login_id", "avatar_url", "avatar_state", "email", "locale", "last_login", "time_zone", "bio", "enrollmentsId" FROM "user"`
        )
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`)
        await queryRunner.query(
            `CREATE TABLE "temporary_submission_attachment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" numeric NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "upload_status" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "hidden_for_user" boolean NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "category" text NOT NULL, "locked_for_user" boolean NOT NULL, "submissionId" numeric, CONSTRAINT "FK_b4e5dc5b58c73c3adc62e1b9e61" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_submission_attachment"("date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "upload_status", "content-type", "url", "size", "created_at", "updated_at", "locked", "hidden", "hidden_for_user", "thumbnail_url", "modified_at", "mime_class", "category", "locked_for_user", "submissionId") SELECT "date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "upload_status", "content-type", "url", "size", "created_at", "updated_at", "locked", "hidden", "hidden_for_user", "thumbnail_url", "modified_at", "mime_class", "category", "locked_for_user", "submissionId" FROM "submission_attachment"`
        )
        await queryRunner.query(`DROP TABLE "submission_attachment"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_submission_attachment" RENAME TO "submission_attachment"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "assignment_id" numeric NOT NULL, "attempt" numeric NOT NULL, "body" text NOT NULL, "grade" text NOT NULL, "grade_matches_current_submission" boolean NOT NULL, "html_url" text, "preview_url" text NOT NULL, "score" numeric NOT NULL, "submission_commentsIds" text, "submission_type" text NOT NULL, "submitted_at" date NOT NULL, "url" text, "user_id" numeric NOT NULL, "grader_id" numeric NOT NULL, "graded_at" date NOT NULL, "userId" numeric, "late" boolean NOT NULL, "assignment_visible" boolean, "excused" boolean NOT NULL, "missing" boolean NOT NULL, "late_policy_status" text, "points_deducted" numeric, "seconds_late" numeric NOT NULL, "workflow_state" text NOT NULL, "extra_attempts" numeric, "anonymous_id" text NOT NULL, "posted_at" date NOT NULL, "read_status" text, "redo_request" boolean NOT NULL, "entered_grade" text NOT NULL, "entered_score" numeric NOT NULL, "media_commentId" numeric, "assignmentId" numeric, "courseId" text, "mediaCommentMediaId" text, CONSTRAINT "REL_ef99745f278ca701c5efe5d8dd" UNIQUE ("assignmentId"), CONSTRAINT "REL_7bd626272858ef6464aa257909" UNIQUE ("userId"), CONSTRAINT "REL_aa507b5db29b1ab1b65544c910" UNIQUE ("mediaCommentMediaId"), CONSTRAINT "FK_ef99745f278ca701c5efe5d8ddd" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_497c52c7cc9496b41fce5afae6d" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_aa507b5db29b1ab1b65544c9107" FOREIGN KEY ("mediaCommentMediaId") REFERENCES "media_comment" ("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_submission"("date_last_received_from_canvas", "id", "assignment_id", "attempt", "body", "grade", "grade_matches_current_submission", "html_url", "preview_url", "score", "submission_commentsIds", "submission_type", "submitted_at", "url", "user_id", "grader_id", "graded_at", "userId", "late", "assignment_visible", "excused", "missing", "late_policy_status", "points_deducted", "seconds_late", "workflow_state", "extra_attempts", "anonymous_id", "posted_at", "read_status", "redo_request", "entered_grade", "entered_score", "media_commentId", "assignmentId", "courseId", "mediaCommentMediaId") SELECT "date_last_received_from_canvas", "id", "assignment_id", "attempt", "body", "grade", "grade_matches_current_submission", "html_url", "preview_url", "score", "submission_commentsIds", "submission_type", "submitted_at", "url", "user_id", "grader_id", "graded_at", "userId", "late", "assignment_visible", "excused", "missing", "late_policy_status", "points_deducted", "seconds_late", "workflow_state", "extra_attempts", "anonymous_id", "posted_at", "read_status", "redo_request", "entered_grade", "entered_score", "media_commentId", "assignmentId", "courseId", "mediaCommentMediaId" FROM "submission"`
        )
        await queryRunner.query(`DROP TABLE "submission"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_submission" RENAME TO "submission"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_assignment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "due_at" date, "lock_at" date, "unlock_at" date, "has_overrides" boolean NOT NULL, "all_dates" text, "course_id" numeric NOT NULL, "html_url" text NOT NULL, "submissions_download_url" text NOT NULL, "assignment_group_id" numeric, "due_date_required" boolean NOT NULL, "allowed_extensions" text, "max_name_length" numeric NOT NULL, "turnitin_enabled" boolean, "vericite_enabled" boolean, "turnitin_settingsId" numeric, "grade_group_students_individually" boolean NOT NULL, "external_tool_tag_attributesId" numeric, "peer_reviews" boolean NOT NULL, "automatic_peer_reviews" boolean NOT NULL, "peer_review_count" numeric, "peer_reviews_assign_at" date, "intra_group_peer_reviews" boolean NOT NULL, "group_category_id" numeric, "needs_grading_count" numeric, "needs_grading_count_by_sectionId" numeric, "position" numeric NOT NULL, "post_to_sis" boolean, "integration_id" text, "integration_data" text, "points_possible" numeric NOT NULL, "submission_types" text NOT NULL, "has_submitted_submissions" boolean NOT NULL, "grading_type" text NOT NULL, "grading_standard_id" text, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info_id" numeric, "lock_explanation" text, "quiz_id" numeric, "anonymous_submissions" boolean, "discussion_topicId" numeric, "freeze_on_copy" boolean, "frozen" boolean, "frozen_attributes" text, "submission_id" numeric, "use_rubric_for_grading" boolean, "rubric_settingsId" numeric, "rubricIds" text, "assignment_visibility" text, "overrides" text, "omit_from_final_grade" boolean, "hide_in_gradebook" boolean, "moderated_grading" boolean NOT NULL, "grader_count" numeric NOT NULL, "final_grader_id" numeric, "grader_comments_visible_to_graders" boolean NOT NULL, "graders_anonymous_to_graders" boolean NOT NULL, "grader_names_visible_to_final_grader" boolean NOT NULL, "anonymous_grading" boolean NOT NULL, "allowed_attempts" numeric NOT NULL, "post_manually" boolean NOT NULL, "score_statisticsIds" text, "can_submit" boolean, "ab_guid" text, "annotatable_attachment_id" numeric, "anonymize_students" boolean, "require_lockdown_browser" boolean, "important_dates" boolean, "muted" boolean, "anonymous_peer_reviews" boolean NOT NULL, "anonymous_instructor_annotations" boolean NOT NULL, "graded_submissions_exist" boolean NOT NULL, "is_quiz_assignment" boolean NOT NULL, "in_closed_grading_period" boolean NOT NULL, "can_duplicate" boolean NOT NULL, "original_course_id" numeric, "original_assignment_id" numeric, "original_lti_resource_link_id" numeric, "original_assignment_name" text, "original_quiz_id" numeric, "workflow_state" text NOT NULL, "assignmentGroupId" numeric, "turnitinSettingsId" numeric, "lockInfoAssetString" text, "discussionTopicId" numeric, "submissionId" numeric, "rubricSettingsPoints_possible" text NOT NULL, CONSTRAINT "REL_d7a7ff231c8a414a4786f0eda3" UNIQUE ("turnitinSettingsId"), CONSTRAINT "REL_5974c4c01db31c18802ae348e7" UNIQUE ("lockInfoAssetString"), CONSTRAINT "REL_bcfcd42d6d375b74a0cb217ed6" UNIQUE ("quiz_id"), CONSTRAINT "REL_41fbd4d914c50ec129cf973610" UNIQUE ("discussionTopicId"), CONSTRAINT "REL_f8a7760a0a4a8a662d19b9fa82" UNIQUE ("submissionId"), CONSTRAINT "FK_6565d2c7cc3c2a0ae2438f77122" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d7a7ff231c8a414a4786f0eda31" FOREIGN KEY ("turnitinSettingsId") REFERENCES "turnitin_settings" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5974c4c01db31c18802ae348e78" FOREIGN KEY ("lockInfoAssetString") REFERENCES "lock_info" ("asset_string") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bcfcd42d6d375b74a0cb217ed64" FOREIGN KEY ("quiz_id") REFERENCES "quiz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_41fbd4d914c50ec129cf973610d" FOREIGN KEY ("discussionTopicId") REFERENCES "discussion_topic" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f8a7760a0a4a8a662d19b9fa82a" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_assignment"("date_last_received_from_canvas", "id", "name", "description", "created_at", "updated_at", "due_at", "lock_at", "unlock_at", "has_overrides", "all_dates", "course_id", "html_url", "submissions_download_url", "assignment_group_id", "due_date_required", "allowed_extensions", "max_name_length", "turnitin_enabled", "vericite_enabled", "turnitin_settingsId", "grade_group_students_individually", "external_tool_tag_attributesId", "peer_reviews", "automatic_peer_reviews", "peer_review_count", "peer_reviews_assign_at", "intra_group_peer_reviews", "group_category_id", "needs_grading_count", "needs_grading_count_by_sectionId", "position", "post_to_sis", "integration_id", "integration_data", "points_possible", "submission_types", "has_submitted_submissions", "grading_type", "grading_standard_id", "published", "unpublishable", "only_visible_to_overrides", "locked_for_user", "lock_info_id", "lock_explanation", "quiz_id", "anonymous_submissions", "discussion_topicId", "freeze_on_copy", "frozen", "frozen_attributes", "submission_id", "use_rubric_for_grading", "rubric_settingsId", "rubricIds", "assignment_visibility", "overrides", "omit_from_final_grade", "hide_in_gradebook", "moderated_grading", "grader_count", "final_grader_id", "grader_comments_visible_to_graders", "graders_anonymous_to_graders", "grader_names_visible_to_final_grader", "anonymous_grading", "allowed_attempts", "post_manually", "score_statisticsIds", "can_submit", "ab_guid", "annotatable_attachment_id", "anonymize_students", "require_lockdown_browser", "important_dates", "muted", "anonymous_peer_reviews", "anonymous_instructor_annotations", "graded_submissions_exist", "is_quiz_assignment", "in_closed_grading_period", "can_duplicate", "original_course_id", "original_assignment_id", "original_lti_resource_link_id", "original_assignment_name", "original_quiz_id", "workflow_state", "assignmentGroupId", "turnitinSettingsId", "lockInfoAssetString", "discussionTopicId", "submissionId", "rubricSettingsPoints_possible") SELECT "date_last_received_from_canvas", "id", "name", "description", "created_at", "updated_at", "due_at", "lock_at", "unlock_at", "has_overrides", "all_dates", "course_id", "html_url", "submissions_download_url", "assignment_group_id", "due_date_required", "allowed_extensions", "max_name_length", "turnitin_enabled", "vericite_enabled", "turnitin_settingsId", "grade_group_students_individually", "external_tool_tag_attributesId", "peer_reviews", "automatic_peer_reviews", "peer_review_count", "peer_reviews_assign_at", "intra_group_peer_reviews", "group_category_id", "needs_grading_count", "needs_grading_count_by_sectionId", "position", "post_to_sis", "integration_id", "integration_data", "points_possible", "submission_types", "has_submitted_submissions", "grading_type", "grading_standard_id", "published", "unpublishable", "only_visible_to_overrides", "locked_for_user", "lock_info_id", "lock_explanation", "quiz_id", "anonymous_submissions", "discussion_topicId", "freeze_on_copy", "frozen", "frozen_attributes", "submission_id", "use_rubric_for_grading", "rubric_settingsId", "rubricIds", "assignment_visibility", "overrides", "omit_from_final_grade", "hide_in_gradebook", "moderated_grading", "grader_count", "final_grader_id", "grader_comments_visible_to_graders", "graders_anonymous_to_graders", "grader_names_visible_to_final_grader", "anonymous_grading", "allowed_attempts", "post_manually", "score_statisticsIds", "can_submit", "ab_guid", "annotatable_attachment_id", "anonymize_students", "require_lockdown_browser", "important_dates", "muted", "anonymous_peer_reviews", "anonymous_instructor_annotations", "graded_submissions_exist", "is_quiz_assignment", "in_closed_grading_period", "can_duplicate", "original_course_id", "original_assignment_id", "original_lti_resource_link_id", "original_assignment_name", "original_quiz_id", "workflow_state", "assignmentGroupId", "turnitinSettingsId", "lockInfoAssetString", "discussionTopicId", "submissionId", "rubricSettingsPoints_possible" FROM "assignment"`
        )
        await queryRunner.query(`DROP TABLE "assignment"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_assignment" RENAME TO "assignment"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_assignment_group" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "courseId" text, "name" text NOT NULL, "position" numeric NOT NULL, "group_weight" numeric NOT NULL, "sis_source_id" text NOT NULL, "integration_data" text NOT NULL, "rules" text NOT NULL, CONSTRAINT "FK_8e128f73db466ae506aca21b86a" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_assignment_group"("date_last_received_from_canvas", "id", "courseId", "name", "position", "group_weight", "sis_source_id", "integration_data", "rules") SELECT "date_last_received_from_canvas", "id", "courseId", "name", "position", "group_weight", "sis_source_id", "integration_data", "rules" FROM "assignment_group"`
        )
        await queryRunner.query(`DROP TABLE "assignment_group"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_assignment_group" RENAME TO "assignment_group"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_external_tool_tag_attributes" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "url" text NOT NULL, "new_tab" boolean NOT NULL, "resource_link_id" text PRIMARY KEY NOT NULL, "assignmentId" numeric, CONSTRAINT "FK_02bc2819c2ba15736bd13572ea2" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_external_tool_tag_attributes"("date_last_received_from_canvas", "url", "new_tab", "resource_link_id", "assignmentId") SELECT "date_last_received_from_canvas", "url", "new_tab", "resource_link_id", "assignmentId" FROM "external_tool_tag_attributes"`
        )
        await queryRunner.query(`DROP TABLE "external_tool_tag_attributes"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_external_tool_tag_attributes" RENAME TO "external_tool_tag_attributes"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_lock_info" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "asset_string" text PRIMARY KEY NOT NULL, "unlock_at" date, "lock_at" date, "context_module" text NOT NULL, "manually_locked" boolean NOT NULL, "file_id" numeric, "assignmentId" numeric, CONSTRAINT "REL_691294c6a79f33a3ad4ccfbf7b" UNIQUE ("assignmentId"), CONSTRAINT "REL_efec4a6fb81d5b0642d28fdbbb" UNIQUE ("file_id"), CONSTRAINT "FK_691294c6a79f33a3ad4ccfbf7b2" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_efec4a6fb81d5b0642d28fdbbbe" FOREIGN KEY ("file_id") REFERENCES "file" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_lock_info"("date_last_received_from_canvas", "asset_string", "unlock_at", "lock_at", "context_module", "manually_locked", "file_id", "assignmentId") SELECT "date_last_received_from_canvas", "asset_string", "unlock_at", "lock_at", "context_module", "manually_locked", "file_id", "assignmentId" FROM "lock_info"`
        )
        await queryRunner.query(`DROP TABLE "lock_info"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_lock_info" RENAME TO "lock_info"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_needs_grading_count_by_section" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "section_id" text PRIMARY KEY NOT NULL, "needs_grading_count" numeric NOT NULL, "assignmentId" numeric, CONSTRAINT "FK_04d4b9e7057f7e1444489ed58e3" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_needs_grading_count_by_section"("date_last_received_from_canvas", "section_id", "needs_grading_count", "assignmentId") SELECT "date_last_received_from_canvas", "section_id", "needs_grading_count", "assignmentId" FROM "needs_grading_count_by_section"`
        )
        await queryRunner.query(`DROP TABLE "needs_grading_count_by_section"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_needs_grading_count_by_section" RENAME TO "needs_grading_count_by_section"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_rubric_criteria" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "learning_outcome_id" text, "vendor_guid" text, "description" text NOT NULL, "long_description" text NOT NULL, "criterion_use_range" boolean NOT NULL, "ignore_for_scoring" boolean NOT NULL, "assignmentId" numeric, CONSTRAINT "FK_7d3d1ba84b9b96001f9bcd1fd64" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_rubric_criteria"("date_last_received_from_canvas", "points", "id", "learning_outcome_id", "vendor_guid", "description", "long_description", "criterion_use_range", "ignore_for_scoring", "assignmentId") SELECT "date_last_received_from_canvas", "points", "id", "learning_outcome_id", "vendor_guid", "description", "long_description", "criterion_use_range", "ignore_for_scoring", "assignmentId" FROM "rubric_criteria"`
        )
        await queryRunner.query(`DROP TABLE "rubric_criteria"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_rubric_criteria" RENAME TO "rubric_criteria"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_rubric_rating" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "description" text NOT NULL, "long_description" text NOT NULL, "rubricCriteriaId" text, CONSTRAINT "FK_9295be872e2b918194e46fbc14d" FOREIGN KEY ("rubricCriteriaId") REFERENCES "rubric_criteria" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_rubric_rating"("date_last_received_from_canvas", "points", "id", "description", "long_description", "rubricCriteriaId") SELECT "date_last_received_from_canvas", "points", "id", "description", "long_description", "rubricCriteriaId" FROM "rubric_rating"`
        )
        await queryRunner.query(`DROP TABLE "rubric_rating"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_rubric_rating" RENAME TO "rubric_rating"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_score_statistic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "mean" numeric NOT NULL, "upper_q" numeric NOT NULL, "median" numeric NOT NULL, "lower_q" numeric NOT NULL, "assignmentId" numeric, CONSTRAINT "FK_5faf8fd8484e50d8d8f094db460" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_score_statistic"("date_last_received_from_canvas", "id", "min", "max", "mean", "upper_q", "median", "lower_q", "assignmentId") SELECT "date_last_received_from_canvas", "id", "min", "max", "mean", "upper_q", "median", "lower_q", "assignmentId" FROM "score_statistic"`
        )
        await queryRunner.query(`DROP TABLE "score_statistic"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_score_statistic" RENAME TO "score_statistic"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_turnitin_settings" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "originality_report_visibility" text NOT NULL, "s_paper_check" boolean NOT NULL, "internet_check" boolean NOT NULL, "journal_check" boolean NOT NULL, "exclude_biblio" boolean NOT NULL, "exclude_quoted" boolean NOT NULL, "exclude_small_matches_type" text NOT NULL, "exclude_small_matches_value" numeric, "assignmentId" numeric, CONSTRAINT "REL_948553dbefee660af977e8b646" UNIQUE ("assignmentId"), CONSTRAINT "FK_948553dbefee660af977e8b6466" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_turnitin_settings"("date_last_received_from_canvas", "id", "originality_report_visibility", "s_paper_check", "internet_check", "journal_check", "exclude_biblio", "exclude_quoted", "exclude_small_matches_type", "exclude_small_matches_value", "assignmentId") SELECT "date_last_received_from_canvas", "id", "originality_report_visibility", "s_paper_check", "internet_check", "journal_check", "exclude_biblio", "exclude_quoted", "exclude_small_matches_type", "exclude_small_matches_value", "assignmentId" FROM "turnitin_settings"`
        )
        await queryRunner.query(`DROP TABLE "turnitin_settings"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_turnitin_settings" RENAME TO "turnitin_settings"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_blueprint_restrictions" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content" boolean NOT NULL, "points" boolean NOT NULL, "due_dates" boolean NOT NULL, "availability_dates" boolean NOT NULL, "courseId" text PRIMARY KEY NOT NULL, CONSTRAINT "FK_f2e4dc404addbe9d311fee8ec8f" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_blueprint_restrictions"("date_last_received_from_canvas", "content", "points", "due_dates", "availability_dates", "courseId") SELECT "date_last_received_from_canvas", "content", "points", "due_dates", "availability_dates", "courseId" FROM "blueprint_restrictions"`
        )
        await queryRunner.query(`DROP TABLE "blueprint_restrictions"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_blueprint_restrictions" RENAME TO "blueprint_restrictions"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_course" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "sis_course_id" numeric, "uuid" text NOT NULL, "integration_id" text, "sis_import_id" text, "name" text NOT NULL, "course_code" text NOT NULL, "original_name" text, "workflow_state" text NOT NULL, "account_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "enrollment_term_id" numeric NOT NULL, "grading_standard_id" numeric, "grade_passback_setting" text, "created_at" date NOT NULL, "start_at" date, "end_at" date, "locale" text, "total_students" numeric, "default_view" text NOT NULL, "syllabus_body" text, "needs_grading_count" numeric, "apply_assignment_group_weights" boolean NOT NULL, "permissions" text, "is_public" boolean, "is_public_to_auth_users" boolean NOT NULL, "public_syllabus" boolean NOT NULL, "public_syllabus_to_auth" boolean NOT NULL, "public_description" text, "storage_quota_mb" numeric NOT NULL, "storage_quota_used_mb" numeric, "hide_final_grades" boolean NOT NULL, "license" text, "allow_student_assignment_edits" boolean, "allow_wiki_comments" boolean, "allow_student_forum_attachments" boolean, "open_enrollment" boolean, "self_enrollment" boolean, "restrict_enrollments_to_course_dates" boolean NOT NULL, "course_format" text, "access_restricted_by_date" boolean, "time_zone" text, "blueprint" boolean, "blueprint_restrictionsId" numeric, "blueprint_restrictions_by_object_type" json, "template" boolean, "assignment_groupsIds" text, "courseProgressCourseId" numeric, "blueprintRestrictionsCourseId" text, "calendarIcs" text NOT NULL, CONSTRAINT "REL_176e1fe6a79f62e0f66994452f" UNIQUE ("courseProgressCourseId"), CONSTRAINT "REL_76e7ec4cb66fa0e276e1341efc" UNIQUE ("blueprintRestrictionsCourseId"), CONSTRAINT "FK_176e1fe6a79f62e0f66994452fc" FOREIGN KEY ("courseProgressCourseId") REFERENCES "course_progress" ("courseId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_76e7ec4cb66fa0e276e1341efc9" FOREIGN KEY ("blueprintRestrictionsCourseId") REFERENCES "blueprint_restrictions" ("courseId") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_course"("date_last_received_from_canvas", "id", "sis_course_id", "uuid", "integration_id", "sis_import_id", "name", "course_code", "original_name", "workflow_state", "account_id", "root_account_id", "enrollment_term_id", "grading_standard_id", "grade_passback_setting", "created_at", "start_at", "end_at", "locale", "total_students", "default_view", "syllabus_body", "needs_grading_count", "apply_assignment_group_weights", "permissions", "is_public", "is_public_to_auth_users", "public_syllabus", "public_syllabus_to_auth", "public_description", "storage_quota_mb", "storage_quota_used_mb", "hide_final_grades", "license", "allow_student_assignment_edits", "allow_wiki_comments", "allow_student_forum_attachments", "open_enrollment", "self_enrollment", "restrict_enrollments_to_course_dates", "course_format", "access_restricted_by_date", "time_zone", "blueprint", "blueprint_restrictionsId", "blueprint_restrictions_by_object_type", "template", "assignment_groupsIds", "courseProgressCourseId", "blueprintRestrictionsCourseId", "calendarIcs") SELECT "date_last_received_from_canvas", "id", "sis_course_id", "uuid", "integration_id", "sis_import_id", "name", "course_code", "original_name", "workflow_state", "account_id", "root_account_id", "enrollment_term_id", "grading_standard_id", "grade_passback_setting", "created_at", "start_at", "end_at", "locale", "total_students", "default_view", "syllabus_body", "needs_grading_count", "apply_assignment_group_weights", "permissions", "is_public", "is_public_to_auth_users", "public_syllabus", "public_syllabus_to_auth", "public_description", "storage_quota_mb", "storage_quota_used_mb", "hide_final_grades", "license", "allow_student_assignment_edits", "allow_wiki_comments", "allow_student_forum_attachments", "open_enrollment", "self_enrollment", "restrict_enrollments_to_course_dates", "course_format", "access_restricted_by_date", "time_zone", "blueprint", "blueprint_restrictionsId", "blueprint_restrictions_by_object_type", "template", "assignment_groupsIds", "courseProgressCourseId", "blueprintRestrictionsCourseId", "calendarIcs" FROM "course"`
        )
        await queryRunner.query(`DROP TABLE "course"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_course" RENAME TO "course"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_course_progress" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "requirement_count" numeric NOT NULL, "requirement_completed_count" numeric NOT NULL, "next_requirement_url" text, "completed_at" date, "courseId" text PRIMARY KEY NOT NULL, CONSTRAINT "FK_2cfdeb07b732bd12041e29bf328" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_course_progress"("date_last_received_from_canvas", "requirement_count", "requirement_completed_count", "next_requirement_url", "completed_at", "courseId") SELECT "date_last_received_from_canvas", "requirement_count", "requirement_completed_count", "next_requirement_url", "completed_at", "courseId" FROM "course_progress"`
        )
        await queryRunner.query(`DROP TABLE "course_progress"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_course_progress" RENAME TO "course_progress"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_discussion_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "message" text NOT NULL, "html_url" text NOT NULL, "posted_at" date, "last_reply_at" date NOT NULL, "require_initial_post" boolean NOT NULL, "user_can_see_posts" boolean NOT NULL, "discussion_subentry_count" numeric NOT NULL, "read_state" text NOT NULL, "unread_count" numeric NOT NULL, "subscribed" boolean NOT NULL, "subscription_hold" text, "assignment_id" numeric, "delayed_post_at" date NOT NULL, "published" boolean NOT NULL, "lock_at" date NOT NULL, "locked" boolean NOT NULL, "pinned" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" boolean, "lock_explanation" text, "user_name" text NOT NULL, "topic_children" text NOT NULL, "root_topic_id" numeric, "podcast_url" text NOT NULL, "discussion_type" text NOT NULL, "group_category_id" numeric, "permissions" text NOT NULL, "allow_rating" boolean NOT NULL, "only_graders_can_rate" boolean NOT NULL, "sort_by_rating" boolean NOT NULL, "assignmentId" numeric, CONSTRAINT "REL_cece40a698be539595c41f1387" UNIQUE ("assignmentId"), CONSTRAINT "FK_cece40a698be539595c41f13871" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_discussion_topic"("date_last_received_from_canvas", "id", "title", "message", "html_url", "posted_at", "last_reply_at", "require_initial_post", "user_can_see_posts", "discussion_subentry_count", "read_state", "unread_count", "subscribed", "subscription_hold", "assignment_id", "delayed_post_at", "published", "lock_at", "locked", "pinned", "locked_for_user", "lock_info", "lock_explanation", "user_name", "topic_children", "root_topic_id", "podcast_url", "discussion_type", "group_category_id", "permissions", "allow_rating", "only_graders_can_rate", "sort_by_rating", "assignmentId") SELECT "date_last_received_from_canvas", "id", "title", "message", "html_url", "posted_at", "last_reply_at", "require_initial_post", "user_can_see_posts", "discussion_subentry_count", "read_state", "unread_count", "subscribed", "subscription_hold", "assignment_id", "delayed_post_at", "published", "lock_at", "locked", "pinned", "locked_for_user", "lock_info", "lock_explanation", "user_name", "topic_children", "root_topic_id", "podcast_url", "discussion_type", "group_category_id", "permissions", "allow_rating", "only_graders_can_rate", "sort_by_rating", "assignmentId" FROM "discussion_topic"`
        )
        await queryRunner.query(`DROP TABLE "discussion_topic"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_discussion_topic" RENAME TO "discussion_topic"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_group_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "group_id" numeric NOT NULL, "discussionTopicId" numeric, CONSTRAINT "FK_9ff385e3d7858a41cfb23c42917" FOREIGN KEY ("discussionTopicId") REFERENCES "discussion_topic" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_group_topic"("date_last_received_from_canvas", "id", "group_id", "discussionTopicId") SELECT "date_last_received_from_canvas", "id", "group_id", "discussionTopicId" FROM "group_topic"`
        )
        await queryRunner.query(`DROP TABLE "group_topic"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_group_topic" RENAME TO "group_topic"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_enrollment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "sis_course_id" text NOT NULL, "course_integration_id" text NOT NULL, "course_section_id" numeric NOT NULL, "section_integration_id" numeric, "sis_account_id" text, "sis_section_id" text, "sis_user_id" text, "enrollment_state" text NOT NULL, "limit_privileges_to_course_section" boolean NOT NULL, "sis_import_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "type" text NOT NULL, "user_id" numeric NOT NULL, "associated_user_id" numeric NOT NULL, "role" text NOT NULL, "role_id" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "start_at" date NOT NULL, "end_at" date NOT NULL, "last_activity_at" date NOT NULL, "last_attended_at" date NOT NULL, "total_activity_time" numeric NOT NULL, "html_url" text NOT NULL, "override_grade" text NOT NULL, "override_score" text NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "has_grading_periods" boolean, "totals_for_all_grading_periods_option" boolean, "current_grading_period_title" text, "current_grading_period_id" numeric, "current_period_override_grade" text NOT NULL, "current_period_override_score" numeric NOT NULL, "current_period_unposted_current_score" numeric, "current_period_unposted_final_score" numeric, "current_period_unposted_current_grade" text, "current_period_unposted_final_grade" text, "courseId" text, "gradesEnrollmentId" numeric, "userId" numeric, CONSTRAINT "REL_298aa846f79fca9dcc319bbde1" UNIQUE ("gradesEnrollmentId"), CONSTRAINT "REL_e97ecbf11356b5173ce7fb0b06" UNIQUE ("userId"), CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_298aa846f79fca9dcc319bbde11" FOREIGN KEY ("gradesEnrollmentId") REFERENCES "grade" ("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e97ecbf11356b5173ce7fb0b060" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_enrollment"("date_last_received_from_canvas", "id", "sis_course_id", "course_integration_id", "course_section_id", "section_integration_id", "sis_account_id", "sis_section_id", "sis_user_id", "enrollment_state", "limit_privileges_to_course_section", "sis_import_id", "root_account_id", "type", "user_id", "associated_user_id", "role", "role_id", "created_at", "updated_at", "start_at", "end_at", "last_activity_at", "last_attended_at", "total_activity_time", "html_url", "override_grade", "override_score", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "has_grading_periods", "totals_for_all_grading_periods_option", "current_grading_period_title", "current_grading_period_id", "current_period_override_grade", "current_period_override_score", "current_period_unposted_current_score", "current_period_unposted_final_score", "current_period_unposted_current_grade", "current_period_unposted_final_grade", "courseId", "gradesEnrollmentId", "userId") SELECT "date_last_received_from_canvas", "id", "sis_course_id", "course_integration_id", "course_section_id", "section_integration_id", "sis_account_id", "sis_section_id", "sis_user_id", "enrollment_state", "limit_privileges_to_course_section", "sis_import_id", "root_account_id", "type", "user_id", "associated_user_id", "role", "role_id", "created_at", "updated_at", "start_at", "end_at", "last_activity_at", "last_attended_at", "total_activity_time", "html_url", "override_grade", "override_score", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "has_grading_periods", "totals_for_all_grading_periods_option", "current_grading_period_title", "current_grading_period_id", "current_period_override_grade", "current_period_override_score", "current_period_unposted_current_score", "current_period_unposted_final_score", "current_period_unposted_current_grade", "current_period_unposted_final_grade", "courseId", "gradesEnrollmentId", "userId" FROM "enrollment"`
        )
        await queryRunner.query(`DROP TABLE "enrollment"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_enrollment" RENAME TO "enrollment"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_grade" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "html_url" text NOT NULL, "current_grade" text NOT NULL, "final_grade" text NOT NULL, "current_score" text NOT NULL, "final_score" text NOT NULL, "current_points" numeric NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "unposted_current_points" numeric NOT NULL, "enrollment_id" numeric PRIMARY KEY NOT NULL, CONSTRAINT "FK_3d1e9bb5e4300e8fe445842e023" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_grade"("date_last_received_from_canvas", "html_url", "current_grade", "final_grade", "current_score", "final_score", "current_points", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "unposted_current_points", "enrollment_id") SELECT "date_last_received_from_canvas", "html_url", "current_grade", "final_grade", "current_score", "final_score", "current_points", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "unposted_current_points", "enrollment_id" FROM "grade"`
        )
        await queryRunner.query(`DROP TABLE "grade"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_grade" RENAME TO "grade"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_file" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "unlock_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "lock_at" date NOT NULL, "hidden_for_user" boolean NOT NULL, "visibility_level" text NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "media_entry_id" text NOT NULL, "locked_for_user" boolean NOT NULL, "lock_explanation" varchar NOT NULL, "preview_url" varchar NOT NULL, "lockInfoAssetString" text, "discussionTopicId" numeric, CONSTRAINT "REL_fea9cade6fd5f1819602503a8e" UNIQUE ("lockInfoAssetString"), CONSTRAINT "FK_fea9cade6fd5f1819602503a8e4" FOREIGN KEY ("lockInfoAssetString") REFERENCES "lock_info" ("asset_string") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_36a17a69882dcddd2b0d44a3db6" FOREIGN KEY ("discussionTopicId") REFERENCES "discussion_topic" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_file"("date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "content-type", "url", "size", "created_at", "updated_at", "unlock_at", "locked", "hidden", "lock_at", "hidden_for_user", "visibility_level", "thumbnail_url", "modified_at", "mime_class", "media_entry_id", "locked_for_user", "lock_explanation", "preview_url", "lockInfoAssetString", "discussionTopicId") SELECT "date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "content-type", "url", "size", "created_at", "updated_at", "unlock_at", "locked", "hidden", "lock_at", "hidden_for_user", "visibility_level", "thumbnail_url", "modified_at", "mime_class", "media_entry_id", "locked_for_user", "lock_explanation", "preview_url", "lockInfoAssetString", "discussionTopicId" FROM "file"`
        )
        await queryRunner.query(`DROP TABLE "file"`)
        await queryRunner.query(`ALTER TABLE "temporary_file" RENAME TO "file"`)
        await queryRunner.query(
            `CREATE TABLE "temporary_grading_period" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "close_date" date NOT NULL, "weight" numeric NOT NULL, "is_closed" boolean NOT NULL, "courseId" text, CONSTRAINT "FK_e576dea692f28a2dabbac5ff13a" FOREIGN KEY ("courseId") REFERENCES "course" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_grading_period"("date_last_received_from_canvas", "id", "title", "start_date", "end_date", "close_date", "weight", "is_closed", "courseId") SELECT "date_last_received_from_canvas", "id", "title", "start_date", "end_date", "close_date", "weight", "is_closed", "courseId" FROM "grading_period"`
        )
        await queryRunner.query(`DROP TABLE "grading_period"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_grading_period" RENAME TO "grading_period"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_quiz" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "html_url" text NOT NULL, "mobile_url" text NOT NULL, "description" text NOT NULL, "quiz_type" text NOT NULL, "time_limit" numeric, "timer_autosubmit_disabled" boolean NOT NULL, "shuffle_answers" boolean NOT NULL, "show_correct_answers" boolean NOT NULL, "scoring_policy" text NOT NULL, "allowed_attempts" numeric NOT NULL, "one_question_at_a_time" numeric NOT NULL, "question_count" numeric NOT NULL, "points_possible" numeric NOT NULL, "cant_go_back" boolean NOT NULL, "access_code" text, "ip_filter" text, "due_at" date, "lock_at" date, "unlock_at" date, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" text NOT NULL, "lock_explanation" text NOT NULL, "hide_results" boolean, "show_correct_answers_at" date, "hide_correct_answers_at" date, "all_dates" text NOT NULL, "can_unpublish" boolean NOT NULL, "can_update" boolean NOT NULL, "require_lockdown_browser" boolean NOT NULL, "require_lockdown_browser_for_results" boolean NOT NULL, "require_lockdown_browser_monitor" boolean NOT NULL, "lockdown_browser_monitor_data" text NOT NULL, "speed_grader_url" text NOT NULL, "permissions" text NOT NULL, "quiz_reports_url" text NOT NULL, "quiz_statistics_url" text NOT NULL, "message_students_url" text NOT NULL, "section_count" numeric NOT NULL, "important_dates" boolean NOT NULL, "quiz_submission_versions_html_url" text NOT NULL, "one_time_results" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "show_correct_answers_last_attempt" boolean NOT NULL, "version_number" numeric NOT NULL, "has_access_code" boolean NOT NULL, "post_to_sis" boolean NOT NULL, "migration_id" numeric NOT NULL, "in_paced_course" boolean NOT NULL, "question_types" text NOT NULL, "assignmentId" numeric, "assignmentGroupId" numeric, CONSTRAINT "REL_cefa2a420bf9c9752794759549" UNIQUE ("assignmentId"), CONSTRAINT "FK_cefa2a420bf9c97527947595493" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8e81dacb6695b8a9613e485004e" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_quiz"("date_last_received_from_canvas", "id", "title", "html_url", "mobile_url", "description", "quiz_type", "time_limit", "timer_autosubmit_disabled", "shuffle_answers", "show_correct_answers", "scoring_policy", "allowed_attempts", "one_question_at_a_time", "question_count", "points_possible", "cant_go_back", "access_code", "ip_filter", "due_at", "lock_at", "unlock_at", "published", "unpublishable", "locked_for_user", "lock_info", "lock_explanation", "hide_results", "show_correct_answers_at", "hide_correct_answers_at", "all_dates", "can_unpublish", "can_update", "require_lockdown_browser", "require_lockdown_browser_for_results", "require_lockdown_browser_monitor", "lockdown_browser_monitor_data", "speed_grader_url", "permissions", "quiz_reports_url", "quiz_statistics_url", "message_students_url", "section_count", "important_dates", "quiz_submission_versions_html_url", "one_time_results", "only_visible_to_overrides", "show_correct_answers_last_attempt", "version_number", "has_access_code", "post_to_sis", "migration_id", "in_paced_course", "question_types", "assignmentId", "assignmentGroupId") SELECT "date_last_received_from_canvas", "id", "title", "html_url", "mobile_url", "description", "quiz_type", "time_limit", "timer_autosubmit_disabled", "shuffle_answers", "show_correct_answers", "scoring_policy", "allowed_attempts", "one_question_at_a_time", "question_count", "points_possible", "cant_go_back", "access_code", "ip_filter", "due_at", "lock_at", "unlock_at", "published", "unpublishable", "locked_for_user", "lock_info", "lock_explanation", "hide_results", "show_correct_answers_at", "hide_correct_answers_at", "all_dates", "can_unpublish", "can_update", "require_lockdown_browser", "require_lockdown_browser_for_results", "require_lockdown_browser_monitor", "lockdown_browser_monitor_data", "speed_grader_url", "permissions", "quiz_reports_url", "quiz_statistics_url", "message_students_url", "section_count", "important_dates", "quiz_submission_versions_html_url", "one_time_results", "only_visible_to_overrides", "show_correct_answers_last_attempt", "version_number", "has_access_code", "post_to_sis", "migration_id", "in_paced_course", "question_types", "assignmentId", "assignmentGroupId" FROM "quiz"`
        )
        await queryRunner.query(`DROP TABLE "quiz"`)
        await queryRunner.query(`ALTER TABLE "temporary_quiz" RENAME TO "quiz"`)
        await queryRunner.query(
            `CREATE TABLE "temporary_formula" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "formula" text PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric, CONSTRAINT "FK_3e1650760c19efe01e8cd4d342c" FOREIGN KEY ("quiz_question_id") REFERENCES "quiz_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_74c2996d9551a94932f9dc605c7" FOREIGN KEY ("quiz_submission_question_id") REFERENCES "quiz_submission_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_formula"("date_last_received_from_canvas", "formula", "quiz_question_id", "quiz_submission_question_id") SELECT "date_last_received_from_canvas", "formula", "quiz_question_id", "quiz_submission_question_id" FROM "formula"`
        )
        await queryRunner.query(`DROP TABLE "formula"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_formula" RENAME TO "formula"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_match" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "text" text NOT NULL, "match_id" numeric PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric, CONSTRAINT "FK_7370134c25b7eb690a5f89fe348" FOREIGN KEY ("quiz_question_id") REFERENCES "quiz_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e69c1e1a0f63c8173957bee528f" FOREIGN KEY ("quiz_submission_question_id") REFERENCES "quiz_submission_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_match"("date_last_received_from_canvas", "text", "match_id", "quiz_question_id", "quiz_submission_question_id") SELECT "date_last_received_from_canvas", "text", "match_id", "quiz_question_id", "quiz_submission_question_id" FROM "match"`
        )
        await queryRunner.query(`DROP TABLE "match"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_match" RENAME TO "match"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_question_data" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "quiz_id" numeric NOT NULL, "question_name" text NOT NULL, "question_description" text NOT NULL, "position" numeric NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "neutral_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "correct" text NOT NULL, "question_type" text NOT NULL, CONSTRAINT "FK_a668c840d26b096bf658f4d89ac" FOREIGN KEY ("quiz_id") REFERENCES "quiz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("quiz_id", "question_name"))`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_question_data"("date_last_received_from_canvas", "quiz_id", "question_name", "question_description", "position", "points_possible", "correct_comments", "neutral_comments", "incorrect_comments", "correct", "question_type") SELECT "date_last_received_from_canvas", "quiz_id", "question_name", "question_description", "position", "points_possible", "correct_comments", "neutral_comments", "incorrect_comments", "correct", "question_type" FROM "question_data"`
        )
        await queryRunner.query(`DROP TABLE "question_data"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_question_data" RENAME TO "question_data"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_quiz_question" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_group_id" numeric, "assessment_question_id" numeric NOT NULL, "position" numeric NOT NULL, "question_name" text NOT NULL, "question_type" text NOT NULL, "question_text" text NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "neutral_comments" text NOT NULL, "correct_comments_html" text NOT NULL, "incorrect_comments_html" text NOT NULL, "neutral_comments_html" text NOT NULL, "answer_tolerance" numeric, "formula_decimal_places" numeric, "matching_answer_incorrect_matches" text, "quizId" numeric, CONSTRAINT "FK_13b266ec53985f521fb503a072e" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_quiz_question"("date_last_received_from_canvas", "id", "quiz_group_id", "assessment_question_id", "position", "question_name", "question_type", "question_text", "points_possible", "correct_comments", "incorrect_comments", "neutral_comments", "correct_comments_html", "incorrect_comments_html", "neutral_comments_html", "answer_tolerance", "formula_decimal_places", "matching_answer_incorrect_matches", "quizId") SELECT "date_last_received_from_canvas", "id", "quiz_group_id", "assessment_question_id", "position", "question_name", "question_type", "question_text", "points_possible", "correct_comments", "incorrect_comments", "neutral_comments", "correct_comments_html", "incorrect_comments_html", "neutral_comments_html", "answer_tolerance", "formula_decimal_places", "matching_answer_incorrect_matches", "quizId" FROM "quiz_question"`
        )
        await queryRunner.query(`DROP TABLE "quiz_question"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_quiz_question" RENAME TO "quiz_question"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_quiz_submission_answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "text" text NOT NULL, "comments" text NOT NULL, "comments_html" text NOT NULL, "weight" numeric NOT NULL, "blank_id" text NOT NULL, "quizQuestionId" numeric, "questionDataQuizId" numeric, "questionDataQuestionName" text, CONSTRAINT "FK_8e74af0c5a72fb871387a187841" FOREIGN KEY ("quizQuestionId") REFERENCES "quiz_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7ba775b940a8fc55f434938afff" FOREIGN KEY ("questionDataQuizId", "questionDataQuestionName") REFERENCES "question_data" ("quiz_id", "question_name") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_quiz_submission_answer"("date_last_received_from_canvas", "id", "text", "comments", "comments_html", "weight", "blank_id", "quizQuestionId", "questionDataQuizId", "questionDataQuestionName") SELECT "date_last_received_from_canvas", "id", "text", "comments", "comments_html", "weight", "blank_id", "quizQuestionId", "questionDataQuizId", "questionDataQuestionName" FROM "quiz_submission_answer"`
        )
        await queryRunner.query(`DROP TABLE "quiz_submission_answer"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_quiz_submission_answer" RENAME TO "quiz_submission_answer"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_variable" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "name" text PRIMARY KEY NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "scale" numeric NOT NULL, "quiz_questionId" numeric, "quizQuestionId" numeric, "quizSubmissionQuestionId" numeric, CONSTRAINT "FK_1900520520a26fe4b632d1ad29c" FOREIGN KEY ("quizQuestionId") REFERENCES "quiz_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_719f6b466d62152bcd85065ca0e" FOREIGN KEY ("quizSubmissionQuestionId") REFERENCES "quiz_submission_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_variable"("date_last_received_from_canvas", "name", "min", "max", "scale", "quiz_questionId", "quizQuestionId", "quizSubmissionQuestionId") SELECT "date_last_received_from_canvas", "name", "min", "max", "scale", "quiz_questionId", "quizQuestionId", "quizSubmissionQuestionId" FROM "variable"`
        )
        await queryRunner.query(`DROP TABLE "variable"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_variable" RENAME TO "variable"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_quiz_submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_version" numeric NOT NULL, "user_id" numeric, "submission_id" numeric, "score" numeric, "kept_score" numeric, "started_at" date, "end_at" date, "finished_at" date, "attempt" numeric NOT NULL, "workflow_state" text NOT NULL, "fudge_points" numeric, "quiz_points_possible" numeric NOT NULL, "extra_attempts" numeric, "extra_time" numeric, "manually_unlocked" boolean, "validation_token" text NOT NULL, "score_before_regrade" numeric, "has_seen_results" boolean, "time_spent" numeric, "attempts_left" numeric NOT NULL, "overdue_and_needs_submission" boolean NOT NULL, "excused" boolean, "html_url" text NOT NULL, "result_url" text NOT NULL, "quizId" numeric, CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_quiz_submission"("date_last_received_from_canvas", "id", "quiz_version", "user_id", "submission_id", "score", "kept_score", "started_at", "end_at", "finished_at", "attempt", "workflow_state", "fudge_points", "quiz_points_possible", "extra_attempts", "extra_time", "manually_unlocked", "validation_token", "score_before_regrade", "has_seen_results", "time_spent", "attempts_left", "overdue_and_needs_submission", "excused", "html_url", "result_url", "quizId") SELECT "date_last_received_from_canvas", "id", "quiz_version", "user_id", "submission_id", "score", "kept_score", "started_at", "end_at", "finished_at", "attempt", "workflow_state", "fudge_points", "quiz_points_possible", "extra_attempts", "extra_time", "manually_unlocked", "validation_token", "score_before_regrade", "has_seen_results", "time_spent", "attempts_left", "overdue_and_needs_submission", "excused", "html_url", "result_url", "quizId" FROM "quiz_submission"`
        )
        await queryRunner.query(`DROP TABLE "quiz_submission"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_quiz_submission" RENAME TO "quiz_submission"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "html" varchar NOT NULL, "quizSubmissionQuestionId" numeric, CONSTRAINT "FK_0f70b0822f92a61a03f09ec4868" FOREIGN KEY ("quizSubmissionQuestionId") REFERENCES "quiz_submission_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_answer"("date_last_received_from_canvas", "id", "text", "html", "quizSubmissionQuestionId") SELECT "date_last_received_from_canvas", "id", "text", "html", "quizSubmissionQuestionId" FROM "answer"`
        )
        await queryRunner.query(`DROP TABLE "answer"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_answer" RENAME TO "answer"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_rubric_assessment_criterion" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "points" numeric NOT NULL, "comments" text NOT NULL, "rating_id" text NOT NULL, "rubricCriteriaId" text, "submissionId" numeric, CONSTRAINT "FK_17fbb41437d31fdf0544e34f26a" FOREIGN KEY ("rubricCriteriaId") REFERENCES "rubric_criteria" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3c032cbf824baea5a8bd2568a7b" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_rubric_assessment_criterion"("date_last_received_from_canvas", "id", "points", "comments", "rating_id", "rubricCriteriaId", "submissionId") SELECT "date_last_received_from_canvas", "id", "points", "comments", "rating_id", "rubricCriteriaId", "submissionId" FROM "rubric_assessment_criterion"`
        )
        await queryRunner.query(`DROP TABLE "rubric_assessment_criterion"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_rubric_assessment_criterion" RENAME TO "rubric_assessment_criterion"`
        )
        await queryRunner.query(
            `CREATE TABLE "temporary_media_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content-type" text NOT NULL, "display_name" text NOT NULL, "media_id" text PRIMARY KEY NOT NULL, "media_type" text NOT NULL, "url" text NOT NULL, "submissionId" numeric, "submissionCommentId" numeric, CONSTRAINT "REL_1656c306c331c3849e35f802d2" UNIQUE ("submissionId"), CONSTRAINT "REL_fb83368172786be55b469391b0" UNIQUE ("submissionCommentId"), CONSTRAINT "FK_1656c306c331c3849e35f802d2b" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_fb83368172786be55b469391b03" FOREIGN KEY ("submissionCommentId") REFERENCES "submission_comment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
        )
        await queryRunner.query(
            `INSERT INTO "temporary_media_comment"("date_last_received_from_canvas", "content-type", "display_name", "media_id", "media_type", "url", "submissionId", "submissionCommentId") SELECT "date_last_received_from_canvas", "content-type", "display_name", "media_id", "media_type", "url", "submissionId", "submissionCommentId" FROM "media_comment"`
        )
        await queryRunner.query(`DROP TABLE "media_comment"`)
        await queryRunner.query(
            `ALTER TABLE "temporary_media_comment" RENAME TO "media_comment"`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "media_comment" RENAME TO "temporary_media_comment"`
        )
        await queryRunner.query(
            `CREATE TABLE "media_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content-type" text NOT NULL, "display_name" text NOT NULL, "media_id" text PRIMARY KEY NOT NULL, "media_type" text NOT NULL, "url" text NOT NULL, "submissionId" numeric, "submissionCommentId" numeric, CONSTRAINT "REL_1656c306c331c3849e35f802d2" UNIQUE ("submissionId"), CONSTRAINT "REL_fb83368172786be55b469391b0" UNIQUE ("submissionCommentId"))`
        )
        await queryRunner.query(
            `INSERT INTO "media_comment"("date_last_received_from_canvas", "content-type", "display_name", "media_id", "media_type", "url", "submissionId", "submissionCommentId") SELECT "date_last_received_from_canvas", "content-type", "display_name", "media_id", "media_type", "url", "submissionId", "submissionCommentId" FROM "temporary_media_comment"`
        )
        await queryRunner.query(`DROP TABLE "temporary_media_comment"`)
        await queryRunner.query(
            `ALTER TABLE "rubric_assessment_criterion" RENAME TO "temporary_rubric_assessment_criterion"`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_assessment_criterion" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "points" numeric NOT NULL, "comments" text NOT NULL, "rating_id" text NOT NULL, "rubricCriteriaId" text, "submissionId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "rubric_assessment_criterion"("date_last_received_from_canvas", "id", "points", "comments", "rating_id", "rubricCriteriaId", "submissionId") SELECT "date_last_received_from_canvas", "id", "points", "comments", "rating_id", "rubricCriteriaId", "submissionId" FROM "temporary_rubric_assessment_criterion"`
        )
        await queryRunner.query(
            `DROP TABLE "temporary_rubric_assessment_criterion"`
        )
        await queryRunner.query(
            `ALTER TABLE "answer" RENAME TO "temporary_answer"`
        )
        await queryRunner.query(
            `CREATE TABLE "answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "html" varchar NOT NULL, "quizSubmissionQuestionId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "answer"("date_last_received_from_canvas", "id", "text", "html", "quizSubmissionQuestionId") SELECT "date_last_received_from_canvas", "id", "text", "html", "quizSubmissionQuestionId" FROM "temporary_answer"`
        )
        await queryRunner.query(`DROP TABLE "temporary_answer"`)
        await queryRunner.query(
            `ALTER TABLE "quiz_submission" RENAME TO "temporary_quiz_submission"`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_version" numeric NOT NULL, "user_id" numeric, "submission_id" numeric, "score" numeric, "kept_score" numeric, "started_at" date, "end_at" date, "finished_at" date, "attempt" numeric NOT NULL, "workflow_state" text NOT NULL, "fudge_points" numeric, "quiz_points_possible" numeric NOT NULL, "extra_attempts" numeric, "extra_time" numeric, "manually_unlocked" boolean, "validation_token" text NOT NULL, "score_before_regrade" numeric, "has_seen_results" boolean, "time_spent" numeric, "attempts_left" numeric NOT NULL, "overdue_and_needs_submission" boolean NOT NULL, "excused" boolean, "html_url" text NOT NULL, "result_url" text NOT NULL, "quizId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "quiz_submission"("date_last_received_from_canvas", "id", "quiz_version", "user_id", "submission_id", "score", "kept_score", "started_at", "end_at", "finished_at", "attempt", "workflow_state", "fudge_points", "quiz_points_possible", "extra_attempts", "extra_time", "manually_unlocked", "validation_token", "score_before_regrade", "has_seen_results", "time_spent", "attempts_left", "overdue_and_needs_submission", "excused", "html_url", "result_url", "quizId") SELECT "date_last_received_from_canvas", "id", "quiz_version", "user_id", "submission_id", "score", "kept_score", "started_at", "end_at", "finished_at", "attempt", "workflow_state", "fudge_points", "quiz_points_possible", "extra_attempts", "extra_time", "manually_unlocked", "validation_token", "score_before_regrade", "has_seen_results", "time_spent", "attempts_left", "overdue_and_needs_submission", "excused", "html_url", "result_url", "quizId" FROM "temporary_quiz_submission"`
        )
        await queryRunner.query(`DROP TABLE "temporary_quiz_submission"`)
        await queryRunner.query(
            `ALTER TABLE "variable" RENAME TO "temporary_variable"`
        )
        await queryRunner.query(
            `CREATE TABLE "variable" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "name" text PRIMARY KEY NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "scale" numeric NOT NULL, "quiz_questionId" numeric, "quizQuestionId" numeric, "quizSubmissionQuestionId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "variable"("date_last_received_from_canvas", "name", "min", "max", "scale", "quiz_questionId", "quizQuestionId", "quizSubmissionQuestionId") SELECT "date_last_received_from_canvas", "name", "min", "max", "scale", "quiz_questionId", "quizQuestionId", "quizSubmissionQuestionId" FROM "temporary_variable"`
        )
        await queryRunner.query(`DROP TABLE "temporary_variable"`)
        await queryRunner.query(
            `ALTER TABLE "quiz_submission_answer" RENAME TO "temporary_quiz_submission_answer"`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_submission_answer" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "text" text NOT NULL, "comments" text NOT NULL, "comments_html" text NOT NULL, "weight" numeric NOT NULL, "blank_id" text NOT NULL, "quizQuestionId" numeric, "questionDataQuizId" numeric, "questionDataQuestionName" text)`
        )
        await queryRunner.query(
            `INSERT INTO "quiz_submission_answer"("date_last_received_from_canvas", "id", "text", "comments", "comments_html", "weight", "blank_id", "quizQuestionId", "questionDataQuizId", "questionDataQuestionName") SELECT "date_last_received_from_canvas", "id", "text", "comments", "comments_html", "weight", "blank_id", "quizQuestionId", "questionDataQuizId", "questionDataQuestionName" FROM "temporary_quiz_submission_answer"`
        )
        await queryRunner.query(`DROP TABLE "temporary_quiz_submission_answer"`)
        await queryRunner.query(
            `ALTER TABLE "quiz_question" RENAME TO "temporary_quiz_question"`
        )
        await queryRunner.query(
            `CREATE TABLE "quiz_question" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "quiz_group_id" numeric, "assessment_question_id" numeric NOT NULL, "position" numeric NOT NULL, "question_name" text NOT NULL, "question_type" text NOT NULL, "question_text" text NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "neutral_comments" text NOT NULL, "correct_comments_html" text NOT NULL, "incorrect_comments_html" text NOT NULL, "neutral_comments_html" text NOT NULL, "answer_tolerance" numeric, "formula_decimal_places" numeric, "matching_answer_incorrect_matches" text, "quizId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "quiz_question"("date_last_received_from_canvas", "id", "quiz_group_id", "assessment_question_id", "position", "question_name", "question_type", "question_text", "points_possible", "correct_comments", "incorrect_comments", "neutral_comments", "correct_comments_html", "incorrect_comments_html", "neutral_comments_html", "answer_tolerance", "formula_decimal_places", "matching_answer_incorrect_matches", "quizId") SELECT "date_last_received_from_canvas", "id", "quiz_group_id", "assessment_question_id", "position", "question_name", "question_type", "question_text", "points_possible", "correct_comments", "incorrect_comments", "neutral_comments", "correct_comments_html", "incorrect_comments_html", "neutral_comments_html", "answer_tolerance", "formula_decimal_places", "matching_answer_incorrect_matches", "quizId" FROM "temporary_quiz_question"`
        )
        await queryRunner.query(`DROP TABLE "temporary_quiz_question"`)
        await queryRunner.query(
            `ALTER TABLE "question_data" RENAME TO "temporary_question_data"`
        )
        await queryRunner.query(
            `CREATE TABLE "question_data" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "quiz_id" numeric NOT NULL, "question_name" text NOT NULL, "question_description" text NOT NULL, "position" numeric NOT NULL, "points_possible" numeric NOT NULL, "correct_comments" text NOT NULL, "neutral_comments" text NOT NULL, "incorrect_comments" text NOT NULL, "correct" text NOT NULL, "question_type" text NOT NULL, PRIMARY KEY ("quiz_id", "question_name"))`
        )
        await queryRunner.query(
            `INSERT INTO "question_data"("date_last_received_from_canvas", "quiz_id", "question_name", "question_description", "position", "points_possible", "correct_comments", "neutral_comments", "incorrect_comments", "correct", "question_type") SELECT "date_last_received_from_canvas", "quiz_id", "question_name", "question_description", "position", "points_possible", "correct_comments", "neutral_comments", "incorrect_comments", "correct", "question_type" FROM "temporary_question_data"`
        )
        await queryRunner.query(`DROP TABLE "temporary_question_data"`)
        await queryRunner.query(
            `ALTER TABLE "match" RENAME TO "temporary_match"`
        )
        await queryRunner.query(
            `CREATE TABLE "match" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "text" text NOT NULL, "match_id" numeric PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "match"("date_last_received_from_canvas", "text", "match_id", "quiz_question_id", "quiz_submission_question_id") SELECT "date_last_received_from_canvas", "text", "match_id", "quiz_question_id", "quiz_submission_question_id" FROM "temporary_match"`
        )
        await queryRunner.query(`DROP TABLE "temporary_match"`)
        await queryRunner.query(
            `ALTER TABLE "formula" RENAME TO "temporary_formula"`
        )
        await queryRunner.query(
            `CREATE TABLE "formula" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "formula" text PRIMARY KEY NOT NULL, "quiz_question_id" numeric, "quiz_submission_question_id" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "formula"("date_last_received_from_canvas", "formula", "quiz_question_id", "quiz_submission_question_id") SELECT "date_last_received_from_canvas", "formula", "quiz_question_id", "quiz_submission_question_id" FROM "temporary_formula"`
        )
        await queryRunner.query(`DROP TABLE "temporary_formula"`)
        await queryRunner.query(`ALTER TABLE "quiz" RENAME TO "temporary_quiz"`)
        await queryRunner.query(
            `CREATE TABLE "quiz" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "html_url" text NOT NULL, "mobile_url" text NOT NULL, "description" text NOT NULL, "quiz_type" text NOT NULL, "time_limit" numeric, "timer_autosubmit_disabled" boolean NOT NULL, "shuffle_answers" boolean NOT NULL, "show_correct_answers" boolean NOT NULL, "scoring_policy" text NOT NULL, "allowed_attempts" numeric NOT NULL, "one_question_at_a_time" numeric NOT NULL, "question_count" numeric NOT NULL, "points_possible" numeric NOT NULL, "cant_go_back" boolean NOT NULL, "access_code" text, "ip_filter" text, "due_at" date, "lock_at" date, "unlock_at" date, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" text NOT NULL, "lock_explanation" text NOT NULL, "hide_results" boolean, "show_correct_answers_at" date, "hide_correct_answers_at" date, "all_dates" text NOT NULL, "can_unpublish" boolean NOT NULL, "can_update" boolean NOT NULL, "require_lockdown_browser" boolean NOT NULL, "require_lockdown_browser_for_results" boolean NOT NULL, "require_lockdown_browser_monitor" boolean NOT NULL, "lockdown_browser_monitor_data" text NOT NULL, "speed_grader_url" text NOT NULL, "permissions" text NOT NULL, "quiz_reports_url" text NOT NULL, "quiz_statistics_url" text NOT NULL, "message_students_url" text NOT NULL, "section_count" numeric NOT NULL, "important_dates" boolean NOT NULL, "quiz_submission_versions_html_url" text NOT NULL, "one_time_results" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "show_correct_answers_last_attempt" boolean NOT NULL, "version_number" numeric NOT NULL, "has_access_code" boolean NOT NULL, "post_to_sis" boolean NOT NULL, "migration_id" numeric NOT NULL, "in_paced_course" boolean NOT NULL, "question_types" text NOT NULL, "assignmentId" numeric, "assignmentGroupId" numeric, CONSTRAINT "REL_cefa2a420bf9c9752794759549" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `INSERT INTO "quiz"("date_last_received_from_canvas", "id", "title", "html_url", "mobile_url", "description", "quiz_type", "time_limit", "timer_autosubmit_disabled", "shuffle_answers", "show_correct_answers", "scoring_policy", "allowed_attempts", "one_question_at_a_time", "question_count", "points_possible", "cant_go_back", "access_code", "ip_filter", "due_at", "lock_at", "unlock_at", "published", "unpublishable", "locked_for_user", "lock_info", "lock_explanation", "hide_results", "show_correct_answers_at", "hide_correct_answers_at", "all_dates", "can_unpublish", "can_update", "require_lockdown_browser", "require_lockdown_browser_for_results", "require_lockdown_browser_monitor", "lockdown_browser_monitor_data", "speed_grader_url", "permissions", "quiz_reports_url", "quiz_statistics_url", "message_students_url", "section_count", "important_dates", "quiz_submission_versions_html_url", "one_time_results", "only_visible_to_overrides", "show_correct_answers_last_attempt", "version_number", "has_access_code", "post_to_sis", "migration_id", "in_paced_course", "question_types", "assignmentId", "assignmentGroupId") SELECT "date_last_received_from_canvas", "id", "title", "html_url", "mobile_url", "description", "quiz_type", "time_limit", "timer_autosubmit_disabled", "shuffle_answers", "show_correct_answers", "scoring_policy", "allowed_attempts", "one_question_at_a_time", "question_count", "points_possible", "cant_go_back", "access_code", "ip_filter", "due_at", "lock_at", "unlock_at", "published", "unpublishable", "locked_for_user", "lock_info", "lock_explanation", "hide_results", "show_correct_answers_at", "hide_correct_answers_at", "all_dates", "can_unpublish", "can_update", "require_lockdown_browser", "require_lockdown_browser_for_results", "require_lockdown_browser_monitor", "lockdown_browser_monitor_data", "speed_grader_url", "permissions", "quiz_reports_url", "quiz_statistics_url", "message_students_url", "section_count", "important_dates", "quiz_submission_versions_html_url", "one_time_results", "only_visible_to_overrides", "show_correct_answers_last_attempt", "version_number", "has_access_code", "post_to_sis", "migration_id", "in_paced_course", "question_types", "assignmentId", "assignmentGroupId" FROM "temporary_quiz"`
        )
        await queryRunner.query(`DROP TABLE "temporary_quiz"`)
        await queryRunner.query(
            `ALTER TABLE "grading_period" RENAME TO "temporary_grading_period"`
        )
        await queryRunner.query(
            `CREATE TABLE "grading_period" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "close_date" date NOT NULL, "weight" numeric NOT NULL, "is_closed" boolean NOT NULL, "courseId" text)`
        )
        await queryRunner.query(
            `INSERT INTO "grading_period"("date_last_received_from_canvas", "id", "title", "start_date", "end_date", "close_date", "weight", "is_closed", "courseId") SELECT "date_last_received_from_canvas", "id", "title", "start_date", "end_date", "close_date", "weight", "is_closed", "courseId" FROM "temporary_grading_period"`
        )
        await queryRunner.query(`DROP TABLE "temporary_grading_period"`)
        await queryRunner.query(`ALTER TABLE "file" RENAME TO "temporary_file"`)
        await queryRunner.query(
            `CREATE TABLE "file" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" varchar NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "unlock_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "lock_at" date NOT NULL, "hidden_for_user" boolean NOT NULL, "visibility_level" text NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "media_entry_id" text NOT NULL, "locked_for_user" boolean NOT NULL, "lock_explanation" varchar NOT NULL, "preview_url" varchar NOT NULL, "lockInfoAssetString" text, "discussionTopicId" numeric, CONSTRAINT "REL_fea9cade6fd5f1819602503a8e" UNIQUE ("lockInfoAssetString"))`
        )
        await queryRunner.query(
            `INSERT INTO "file"("date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "content-type", "url", "size", "created_at", "updated_at", "unlock_at", "locked", "hidden", "lock_at", "hidden_for_user", "visibility_level", "thumbnail_url", "modified_at", "mime_class", "media_entry_id", "locked_for_user", "lock_explanation", "preview_url", "lockInfoAssetString", "discussionTopicId") SELECT "date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "content-type", "url", "size", "created_at", "updated_at", "unlock_at", "locked", "hidden", "lock_at", "hidden_for_user", "visibility_level", "thumbnail_url", "modified_at", "mime_class", "media_entry_id", "locked_for_user", "lock_explanation", "preview_url", "lockInfoAssetString", "discussionTopicId" FROM "temporary_file"`
        )
        await queryRunner.query(`DROP TABLE "temporary_file"`)
        await queryRunner.query(
            `ALTER TABLE "grade" RENAME TO "temporary_grade"`
        )
        await queryRunner.query(
            `CREATE TABLE "grade" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "html_url" text NOT NULL, "current_grade" text NOT NULL, "final_grade" text NOT NULL, "current_score" text NOT NULL, "final_score" text NOT NULL, "current_points" numeric NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "unposted_current_points" numeric NOT NULL, "enrollment_id" numeric PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `INSERT INTO "grade"("date_last_received_from_canvas", "html_url", "current_grade", "final_grade", "current_score", "final_score", "current_points", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "unposted_current_points", "enrollment_id") SELECT "date_last_received_from_canvas", "html_url", "current_grade", "final_grade", "current_score", "final_score", "current_points", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "unposted_current_points", "enrollment_id" FROM "temporary_grade"`
        )
        await queryRunner.query(`DROP TABLE "temporary_grade"`)
        await queryRunner.query(
            `ALTER TABLE "enrollment" RENAME TO "temporary_enrollment"`
        )
        await queryRunner.query(
            `CREATE TABLE "enrollment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "sis_course_id" text NOT NULL, "course_integration_id" text NOT NULL, "course_section_id" numeric NOT NULL, "section_integration_id" numeric, "sis_account_id" text, "sis_section_id" text, "sis_user_id" text, "enrollment_state" text NOT NULL, "limit_privileges_to_course_section" boolean NOT NULL, "sis_import_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "type" text NOT NULL, "user_id" numeric NOT NULL, "associated_user_id" numeric NOT NULL, "role" text NOT NULL, "role_id" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "start_at" date NOT NULL, "end_at" date NOT NULL, "last_activity_at" date NOT NULL, "last_attended_at" date NOT NULL, "total_activity_time" numeric NOT NULL, "html_url" text NOT NULL, "override_grade" text NOT NULL, "override_score" text NOT NULL, "unposted_current_grade" text, "unposted_final_grade" text, "unposted_current_score" text, "unposted_final_score" text, "has_grading_periods" boolean, "totals_for_all_grading_periods_option" boolean, "current_grading_period_title" text, "current_grading_period_id" numeric, "current_period_override_grade" text NOT NULL, "current_period_override_score" numeric NOT NULL, "current_period_unposted_current_score" numeric, "current_period_unposted_final_score" numeric, "current_period_unposted_current_grade" text, "current_period_unposted_final_grade" text, "courseId" text, "gradesEnrollmentId" numeric, "userId" numeric, CONSTRAINT "REL_298aa846f79fca9dcc319bbde1" UNIQUE ("gradesEnrollmentId"), CONSTRAINT "REL_e97ecbf11356b5173ce7fb0b06" UNIQUE ("userId"))`
        )
        await queryRunner.query(
            `INSERT INTO "enrollment"("date_last_received_from_canvas", "id", "sis_course_id", "course_integration_id", "course_section_id", "section_integration_id", "sis_account_id", "sis_section_id", "sis_user_id", "enrollment_state", "limit_privileges_to_course_section", "sis_import_id", "root_account_id", "type", "user_id", "associated_user_id", "role", "role_id", "created_at", "updated_at", "start_at", "end_at", "last_activity_at", "last_attended_at", "total_activity_time", "html_url", "override_grade", "override_score", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "has_grading_periods", "totals_for_all_grading_periods_option", "current_grading_period_title", "current_grading_period_id", "current_period_override_grade", "current_period_override_score", "current_period_unposted_current_score", "current_period_unposted_final_score", "current_period_unposted_current_grade", "current_period_unposted_final_grade", "courseId", "gradesEnrollmentId", "userId") SELECT "date_last_received_from_canvas", "id", "sis_course_id", "course_integration_id", "course_section_id", "section_integration_id", "sis_account_id", "sis_section_id", "sis_user_id", "enrollment_state", "limit_privileges_to_course_section", "sis_import_id", "root_account_id", "type", "user_id", "associated_user_id", "role", "role_id", "created_at", "updated_at", "start_at", "end_at", "last_activity_at", "last_attended_at", "total_activity_time", "html_url", "override_grade", "override_score", "unposted_current_grade", "unposted_final_grade", "unposted_current_score", "unposted_final_score", "has_grading_periods", "totals_for_all_grading_periods_option", "current_grading_period_title", "current_grading_period_id", "current_period_override_grade", "current_period_override_score", "current_period_unposted_current_score", "current_period_unposted_final_score", "current_period_unposted_current_grade", "current_period_unposted_final_grade", "courseId", "gradesEnrollmentId", "userId" FROM "temporary_enrollment"`
        )
        await queryRunner.query(`DROP TABLE "temporary_enrollment"`)
        await queryRunner.query(
            `ALTER TABLE "group_topic" RENAME TO "temporary_group_topic"`
        )
        await queryRunner.query(
            `CREATE TABLE "group_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "group_id" numeric NOT NULL, "discussionTopicId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "group_topic"("date_last_received_from_canvas", "id", "group_id", "discussionTopicId") SELECT "date_last_received_from_canvas", "id", "group_id", "discussionTopicId" FROM "temporary_group_topic"`
        )
        await queryRunner.query(`DROP TABLE "temporary_group_topic"`)
        await queryRunner.query(
            `ALTER TABLE "discussion_topic" RENAME TO "temporary_discussion_topic"`
        )
        await queryRunner.query(
            `CREATE TABLE "discussion_topic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "title" text NOT NULL, "message" text NOT NULL, "html_url" text NOT NULL, "posted_at" date, "last_reply_at" date NOT NULL, "require_initial_post" boolean NOT NULL, "user_can_see_posts" boolean NOT NULL, "discussion_subentry_count" numeric NOT NULL, "read_state" text NOT NULL, "unread_count" numeric NOT NULL, "subscribed" boolean NOT NULL, "subscription_hold" text, "assignment_id" numeric, "delayed_post_at" date NOT NULL, "published" boolean NOT NULL, "lock_at" date NOT NULL, "locked" boolean NOT NULL, "pinned" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info" boolean, "lock_explanation" text, "user_name" text NOT NULL, "topic_children" text NOT NULL, "root_topic_id" numeric, "podcast_url" text NOT NULL, "discussion_type" text NOT NULL, "group_category_id" numeric, "permissions" text NOT NULL, "allow_rating" boolean NOT NULL, "only_graders_can_rate" boolean NOT NULL, "sort_by_rating" boolean NOT NULL, "assignmentId" numeric, CONSTRAINT "REL_cece40a698be539595c41f1387" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `INSERT INTO "discussion_topic"("date_last_received_from_canvas", "id", "title", "message", "html_url", "posted_at", "last_reply_at", "require_initial_post", "user_can_see_posts", "discussion_subentry_count", "read_state", "unread_count", "subscribed", "subscription_hold", "assignment_id", "delayed_post_at", "published", "lock_at", "locked", "pinned", "locked_for_user", "lock_info", "lock_explanation", "user_name", "topic_children", "root_topic_id", "podcast_url", "discussion_type", "group_category_id", "permissions", "allow_rating", "only_graders_can_rate", "sort_by_rating", "assignmentId") SELECT "date_last_received_from_canvas", "id", "title", "message", "html_url", "posted_at", "last_reply_at", "require_initial_post", "user_can_see_posts", "discussion_subentry_count", "read_state", "unread_count", "subscribed", "subscription_hold", "assignment_id", "delayed_post_at", "published", "lock_at", "locked", "pinned", "locked_for_user", "lock_info", "lock_explanation", "user_name", "topic_children", "root_topic_id", "podcast_url", "discussion_type", "group_category_id", "permissions", "allow_rating", "only_graders_can_rate", "sort_by_rating", "assignmentId" FROM "temporary_discussion_topic"`
        )
        await queryRunner.query(`DROP TABLE "temporary_discussion_topic"`)
        await queryRunner.query(
            `ALTER TABLE "course_progress" RENAME TO "temporary_course_progress"`
        )
        await queryRunner.query(
            `CREATE TABLE "course_progress" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "requirement_count" numeric NOT NULL, "requirement_completed_count" numeric NOT NULL, "next_requirement_url" text, "completed_at" date, "courseId" text PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `INSERT INTO "course_progress"("date_last_received_from_canvas", "requirement_count", "requirement_completed_count", "next_requirement_url", "completed_at", "courseId") SELECT "date_last_received_from_canvas", "requirement_count", "requirement_completed_count", "next_requirement_url", "completed_at", "courseId" FROM "temporary_course_progress"`
        )
        await queryRunner.query(`DROP TABLE "temporary_course_progress"`)
        await queryRunner.query(
            `ALTER TABLE "course" RENAME TO "temporary_course"`
        )
        await queryRunner.query(
            `CREATE TABLE "course" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" text PRIMARY KEY NOT NULL, "sis_course_id" numeric, "uuid" text NOT NULL, "integration_id" text, "sis_import_id" text, "name" text NOT NULL, "course_code" text NOT NULL, "original_name" text, "workflow_state" text NOT NULL, "account_id" numeric NOT NULL, "root_account_id" numeric NOT NULL, "enrollment_term_id" numeric NOT NULL, "grading_standard_id" numeric, "grade_passback_setting" text, "created_at" date NOT NULL, "start_at" date, "end_at" date, "locale" text, "total_students" numeric, "default_view" text NOT NULL, "syllabus_body" text, "needs_grading_count" numeric, "apply_assignment_group_weights" boolean NOT NULL, "permissions" text, "is_public" boolean, "is_public_to_auth_users" boolean NOT NULL, "public_syllabus" boolean NOT NULL, "public_syllabus_to_auth" boolean NOT NULL, "public_description" text, "storage_quota_mb" numeric NOT NULL, "storage_quota_used_mb" numeric, "hide_final_grades" boolean NOT NULL, "license" text, "allow_student_assignment_edits" boolean, "allow_wiki_comments" boolean, "allow_student_forum_attachments" boolean, "open_enrollment" boolean, "self_enrollment" boolean, "restrict_enrollments_to_course_dates" boolean NOT NULL, "course_format" text, "access_restricted_by_date" boolean, "time_zone" text, "blueprint" boolean, "blueprint_restrictionsId" numeric, "blueprint_restrictions_by_object_type" json, "template" boolean, "assignment_groupsIds" text, "courseProgressCourseId" numeric, "blueprintRestrictionsCourseId" text, "calendarIcs" text NOT NULL, CONSTRAINT "REL_176e1fe6a79f62e0f66994452f" UNIQUE ("courseProgressCourseId"), CONSTRAINT "REL_76e7ec4cb66fa0e276e1341efc" UNIQUE ("blueprintRestrictionsCourseId"))`
        )
        await queryRunner.query(
            `INSERT INTO "course"("date_last_received_from_canvas", "id", "sis_course_id", "uuid", "integration_id", "sis_import_id", "name", "course_code", "original_name", "workflow_state", "account_id", "root_account_id", "enrollment_term_id", "grading_standard_id", "grade_passback_setting", "created_at", "start_at", "end_at", "locale", "total_students", "default_view", "syllabus_body", "needs_grading_count", "apply_assignment_group_weights", "permissions", "is_public", "is_public_to_auth_users", "public_syllabus", "public_syllabus_to_auth", "public_description", "storage_quota_mb", "storage_quota_used_mb", "hide_final_grades", "license", "allow_student_assignment_edits", "allow_wiki_comments", "allow_student_forum_attachments", "open_enrollment", "self_enrollment", "restrict_enrollments_to_course_dates", "course_format", "access_restricted_by_date", "time_zone", "blueprint", "blueprint_restrictionsId", "blueprint_restrictions_by_object_type", "template", "assignment_groupsIds", "courseProgressCourseId", "blueprintRestrictionsCourseId", "calendarIcs") SELECT "date_last_received_from_canvas", "id", "sis_course_id", "uuid", "integration_id", "sis_import_id", "name", "course_code", "original_name", "workflow_state", "account_id", "root_account_id", "enrollment_term_id", "grading_standard_id", "grade_passback_setting", "created_at", "start_at", "end_at", "locale", "total_students", "default_view", "syllabus_body", "needs_grading_count", "apply_assignment_group_weights", "permissions", "is_public", "is_public_to_auth_users", "public_syllabus", "public_syllabus_to_auth", "public_description", "storage_quota_mb", "storage_quota_used_mb", "hide_final_grades", "license", "allow_student_assignment_edits", "allow_wiki_comments", "allow_student_forum_attachments", "open_enrollment", "self_enrollment", "restrict_enrollments_to_course_dates", "course_format", "access_restricted_by_date", "time_zone", "blueprint", "blueprint_restrictionsId", "blueprint_restrictions_by_object_type", "template", "assignment_groupsIds", "courseProgressCourseId", "blueprintRestrictionsCourseId", "calendarIcs" FROM "temporary_course"`
        )
        await queryRunner.query(`DROP TABLE "temporary_course"`)
        await queryRunner.query(
            `ALTER TABLE "blueprint_restrictions" RENAME TO "temporary_blueprint_restrictions"`
        )
        await queryRunner.query(
            `CREATE TABLE "blueprint_restrictions" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "content" boolean NOT NULL, "points" boolean NOT NULL, "due_dates" boolean NOT NULL, "availability_dates" boolean NOT NULL, "courseId" text PRIMARY KEY NOT NULL)`
        )
        await queryRunner.query(
            `INSERT INTO "blueprint_restrictions"("date_last_received_from_canvas", "content", "points", "due_dates", "availability_dates", "courseId") SELECT "date_last_received_from_canvas", "content", "points", "due_dates", "availability_dates", "courseId" FROM "temporary_blueprint_restrictions"`
        )
        await queryRunner.query(`DROP TABLE "temporary_blueprint_restrictions"`)
        await queryRunner.query(
            `ALTER TABLE "turnitin_settings" RENAME TO "temporary_turnitin_settings"`
        )
        await queryRunner.query(
            `CREATE TABLE "turnitin_settings" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "originality_report_visibility" text NOT NULL, "s_paper_check" boolean NOT NULL, "internet_check" boolean NOT NULL, "journal_check" boolean NOT NULL, "exclude_biblio" boolean NOT NULL, "exclude_quoted" boolean NOT NULL, "exclude_small_matches_type" text NOT NULL, "exclude_small_matches_value" numeric, "assignmentId" numeric, CONSTRAINT "REL_948553dbefee660af977e8b646" UNIQUE ("assignmentId"))`
        )
        await queryRunner.query(
            `INSERT INTO "turnitin_settings"("date_last_received_from_canvas", "id", "originality_report_visibility", "s_paper_check", "internet_check", "journal_check", "exclude_biblio", "exclude_quoted", "exclude_small_matches_type", "exclude_small_matches_value", "assignmentId") SELECT "date_last_received_from_canvas", "id", "originality_report_visibility", "s_paper_check", "internet_check", "journal_check", "exclude_biblio", "exclude_quoted", "exclude_small_matches_type", "exclude_small_matches_value", "assignmentId" FROM "temporary_turnitin_settings"`
        )
        await queryRunner.query(`DROP TABLE "temporary_turnitin_settings"`)
        await queryRunner.query(
            `ALTER TABLE "score_statistic" RENAME TO "temporary_score_statistic"`
        )
        await queryRunner.query(
            `CREATE TABLE "score_statistic" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY AUTOINCREMENT NOT NULL, "min" numeric NOT NULL, "max" numeric NOT NULL, "mean" numeric NOT NULL, "upper_q" numeric NOT NULL, "median" numeric NOT NULL, "lower_q" numeric NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "score_statistic"("date_last_received_from_canvas", "id", "min", "max", "mean", "upper_q", "median", "lower_q", "assignmentId") SELECT "date_last_received_from_canvas", "id", "min", "max", "mean", "upper_q", "median", "lower_q", "assignmentId" FROM "temporary_score_statistic"`
        )
        await queryRunner.query(`DROP TABLE "temporary_score_statistic"`)
        await queryRunner.query(
            `ALTER TABLE "rubric_rating" RENAME TO "temporary_rubric_rating"`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_rating" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "description" text NOT NULL, "long_description" text NOT NULL, "rubricCriteriaId" text)`
        )
        await queryRunner.query(
            `INSERT INTO "rubric_rating"("date_last_received_from_canvas", "points", "id", "description", "long_description", "rubricCriteriaId") SELECT "date_last_received_from_canvas", "points", "id", "description", "long_description", "rubricCriteriaId" FROM "temporary_rubric_rating"`
        )
        await queryRunner.query(`DROP TABLE "temporary_rubric_rating"`)
        await queryRunner.query(
            `ALTER TABLE "rubric_criteria" RENAME TO "temporary_rubric_criteria"`
        )
        await queryRunner.query(
            `CREATE TABLE "rubric_criteria" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "points" numeric NOT NULL, "id" text PRIMARY KEY NOT NULL, "learning_outcome_id" text, "vendor_guid" text, "description" text NOT NULL, "long_description" text NOT NULL, "criterion_use_range" boolean NOT NULL, "ignore_for_scoring" boolean NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "rubric_criteria"("date_last_received_from_canvas", "points", "id", "learning_outcome_id", "vendor_guid", "description", "long_description", "criterion_use_range", "ignore_for_scoring", "assignmentId") SELECT "date_last_received_from_canvas", "points", "id", "learning_outcome_id", "vendor_guid", "description", "long_description", "criterion_use_range", "ignore_for_scoring", "assignmentId" FROM "temporary_rubric_criteria"`
        )
        await queryRunner.query(`DROP TABLE "temporary_rubric_criteria"`)
        await queryRunner.query(
            `ALTER TABLE "needs_grading_count_by_section" RENAME TO "temporary_needs_grading_count_by_section"`
        )
        await queryRunner.query(
            `CREATE TABLE "needs_grading_count_by_section" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "section_id" text PRIMARY KEY NOT NULL, "needs_grading_count" numeric NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "needs_grading_count_by_section"("date_last_received_from_canvas", "section_id", "needs_grading_count", "assignmentId") SELECT "date_last_received_from_canvas", "section_id", "needs_grading_count", "assignmentId" FROM "temporary_needs_grading_count_by_section"`
        )
        await queryRunner.query(
            `DROP TABLE "temporary_needs_grading_count_by_section"`
        )
        await queryRunner.query(
            `ALTER TABLE "lock_info" RENAME TO "temporary_lock_info"`
        )
        await queryRunner.query(
            `CREATE TABLE "lock_info" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "asset_string" text PRIMARY KEY NOT NULL, "unlock_at" date, "lock_at" date, "context_module" text NOT NULL, "manually_locked" boolean NOT NULL, "file_id" numeric, "assignmentId" numeric, CONSTRAINT "REL_691294c6a79f33a3ad4ccfbf7b" UNIQUE ("assignmentId"), CONSTRAINT "REL_efec4a6fb81d5b0642d28fdbbb" UNIQUE ("file_id"))`
        )
        await queryRunner.query(
            `INSERT INTO "lock_info"("date_last_received_from_canvas", "asset_string", "unlock_at", "lock_at", "context_module", "manually_locked", "file_id", "assignmentId") SELECT "date_last_received_from_canvas", "asset_string", "unlock_at", "lock_at", "context_module", "manually_locked", "file_id", "assignmentId" FROM "temporary_lock_info"`
        )
        await queryRunner.query(`DROP TABLE "temporary_lock_info"`)
        await queryRunner.query(
            `ALTER TABLE "external_tool_tag_attributes" RENAME TO "temporary_external_tool_tag_attributes"`
        )
        await queryRunner.query(
            `CREATE TABLE "external_tool_tag_attributes" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "url" text NOT NULL, "new_tab" boolean NOT NULL, "resource_link_id" text PRIMARY KEY NOT NULL, "assignmentId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "external_tool_tag_attributes"("date_last_received_from_canvas", "url", "new_tab", "resource_link_id", "assignmentId") SELECT "date_last_received_from_canvas", "url", "new_tab", "resource_link_id", "assignmentId" FROM "temporary_external_tool_tag_attributes"`
        )
        await queryRunner.query(
            `DROP TABLE "temporary_external_tool_tag_attributes"`
        )
        await queryRunner.query(
            `ALTER TABLE "assignment_group" RENAME TO "temporary_assignment_group"`
        )
        await queryRunner.query(
            `CREATE TABLE "assignment_group" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "courseId" text, "name" text NOT NULL, "position" numeric NOT NULL, "group_weight" numeric NOT NULL, "sis_source_id" text NOT NULL, "integration_data" text NOT NULL, "rules" text NOT NULL)`
        )
        await queryRunner.query(
            `INSERT INTO "assignment_group"("date_last_received_from_canvas", "id", "courseId", "name", "position", "group_weight", "sis_source_id", "integration_data", "rules") SELECT "date_last_received_from_canvas", "id", "courseId", "name", "position", "group_weight", "sis_source_id", "integration_data", "rules" FROM "temporary_assignment_group"`
        )
        await queryRunner.query(`DROP TABLE "temporary_assignment_group"`)
        await queryRunner.query(
            `ALTER TABLE "assignment" RENAME TO "temporary_assignment"`
        )
        await queryRunner.query(
            `CREATE TABLE "assignment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "due_at" date, "lock_at" date, "unlock_at" date, "has_overrides" boolean NOT NULL, "all_dates" text, "course_id" numeric NOT NULL, "html_url" text NOT NULL, "submissions_download_url" text NOT NULL, "assignment_group_id" numeric, "due_date_required" boolean NOT NULL, "allowed_extensions" text, "max_name_length" numeric NOT NULL, "turnitin_enabled" boolean, "vericite_enabled" boolean, "turnitin_settingsId" numeric, "grade_group_students_individually" boolean NOT NULL, "external_tool_tag_attributesId" numeric, "peer_reviews" boolean NOT NULL, "automatic_peer_reviews" boolean NOT NULL, "peer_review_count" numeric, "peer_reviews_assign_at" date, "intra_group_peer_reviews" boolean NOT NULL, "group_category_id" numeric, "needs_grading_count" numeric, "needs_grading_count_by_sectionId" numeric, "position" numeric NOT NULL, "post_to_sis" boolean, "integration_id" text, "integration_data" text, "points_possible" numeric NOT NULL, "submission_types" text NOT NULL, "has_submitted_submissions" boolean NOT NULL, "grading_type" text NOT NULL, "grading_standard_id" text, "published" boolean NOT NULL, "unpublishable" boolean NOT NULL, "only_visible_to_overrides" boolean NOT NULL, "locked_for_user" boolean NOT NULL, "lock_info_id" numeric, "lock_explanation" text, "quiz_id" numeric, "anonymous_submissions" boolean, "discussion_topicId" numeric, "freeze_on_copy" boolean, "frozen" boolean, "frozen_attributes" text, "submission_id" numeric, "use_rubric_for_grading" boolean, "rubric_settingsId" numeric, "rubricIds" text, "assignment_visibility" text, "overrides" text, "omit_from_final_grade" boolean, "hide_in_gradebook" boolean, "moderated_grading" boolean NOT NULL, "grader_count" numeric NOT NULL, "final_grader_id" numeric, "grader_comments_visible_to_graders" boolean NOT NULL, "graders_anonymous_to_graders" boolean NOT NULL, "grader_names_visible_to_final_grader" boolean NOT NULL, "anonymous_grading" boolean NOT NULL, "allowed_attempts" numeric NOT NULL, "post_manually" boolean NOT NULL, "score_statisticsIds" text, "can_submit" boolean, "ab_guid" text, "annotatable_attachment_id" numeric, "anonymize_students" boolean, "require_lockdown_browser" boolean, "important_dates" boolean, "muted" boolean, "anonymous_peer_reviews" boolean NOT NULL, "anonymous_instructor_annotations" boolean NOT NULL, "graded_submissions_exist" boolean NOT NULL, "is_quiz_assignment" boolean NOT NULL, "in_closed_grading_period" boolean NOT NULL, "can_duplicate" boolean NOT NULL, "original_course_id" numeric, "original_assignment_id" numeric, "original_lti_resource_link_id" numeric, "original_assignment_name" text, "original_quiz_id" numeric, "workflow_state" text NOT NULL, "assignmentGroupId" numeric, "turnitinSettingsId" numeric, "lockInfoAssetString" text, "discussionTopicId" numeric, "submissionId" numeric, "rubricSettingsPoints_possible" text NOT NULL, CONSTRAINT "REL_d7a7ff231c8a414a4786f0eda3" UNIQUE ("turnitinSettingsId"), CONSTRAINT "REL_5974c4c01db31c18802ae348e7" UNIQUE ("lockInfoAssetString"), CONSTRAINT "REL_bcfcd42d6d375b74a0cb217ed6" UNIQUE ("quiz_id"), CONSTRAINT "REL_41fbd4d914c50ec129cf973610" UNIQUE ("discussionTopicId"), CONSTRAINT "REL_f8a7760a0a4a8a662d19b9fa82" UNIQUE ("submissionId"))`
        )
        await queryRunner.query(
            `INSERT INTO "assignment"("date_last_received_from_canvas", "id", "name", "description", "created_at", "updated_at", "due_at", "lock_at", "unlock_at", "has_overrides", "all_dates", "course_id", "html_url", "submissions_download_url", "assignment_group_id", "due_date_required", "allowed_extensions", "max_name_length", "turnitin_enabled", "vericite_enabled", "turnitin_settingsId", "grade_group_students_individually", "external_tool_tag_attributesId", "peer_reviews", "automatic_peer_reviews", "peer_review_count", "peer_reviews_assign_at", "intra_group_peer_reviews", "group_category_id", "needs_grading_count", "needs_grading_count_by_sectionId", "position", "post_to_sis", "integration_id", "integration_data", "points_possible", "submission_types", "has_submitted_submissions", "grading_type", "grading_standard_id", "published", "unpublishable", "only_visible_to_overrides", "locked_for_user", "lock_info_id", "lock_explanation", "quiz_id", "anonymous_submissions", "discussion_topicId", "freeze_on_copy", "frozen", "frozen_attributes", "submission_id", "use_rubric_for_grading", "rubric_settingsId", "rubricIds", "assignment_visibility", "overrides", "omit_from_final_grade", "hide_in_gradebook", "moderated_grading", "grader_count", "final_grader_id", "grader_comments_visible_to_graders", "graders_anonymous_to_graders", "grader_names_visible_to_final_grader", "anonymous_grading", "allowed_attempts", "post_manually", "score_statisticsIds", "can_submit", "ab_guid", "annotatable_attachment_id", "anonymize_students", "require_lockdown_browser", "important_dates", "muted", "anonymous_peer_reviews", "anonymous_instructor_annotations", "graded_submissions_exist", "is_quiz_assignment", "in_closed_grading_period", "can_duplicate", "original_course_id", "original_assignment_id", "original_lti_resource_link_id", "original_assignment_name", "original_quiz_id", "workflow_state", "assignmentGroupId", "turnitinSettingsId", "lockInfoAssetString", "discussionTopicId", "submissionId", "rubricSettingsPoints_possible") SELECT "date_last_received_from_canvas", "id", "name", "description", "created_at", "updated_at", "due_at", "lock_at", "unlock_at", "has_overrides", "all_dates", "course_id", "html_url", "submissions_download_url", "assignment_group_id", "due_date_required", "allowed_extensions", "max_name_length", "turnitin_enabled", "vericite_enabled", "turnitin_settingsId", "grade_group_students_individually", "external_tool_tag_attributesId", "peer_reviews", "automatic_peer_reviews", "peer_review_count", "peer_reviews_assign_at", "intra_group_peer_reviews", "group_category_id", "needs_grading_count", "needs_grading_count_by_sectionId", "position", "post_to_sis", "integration_id", "integration_data", "points_possible", "submission_types", "has_submitted_submissions", "grading_type", "grading_standard_id", "published", "unpublishable", "only_visible_to_overrides", "locked_for_user", "lock_info_id", "lock_explanation", "quiz_id", "anonymous_submissions", "discussion_topicId", "freeze_on_copy", "frozen", "frozen_attributes", "submission_id", "use_rubric_for_grading", "rubric_settingsId", "rubricIds", "assignment_visibility", "overrides", "omit_from_final_grade", "hide_in_gradebook", "moderated_grading", "grader_count", "final_grader_id", "grader_comments_visible_to_graders", "graders_anonymous_to_graders", "grader_names_visible_to_final_grader", "anonymous_grading", "allowed_attempts", "post_manually", "score_statisticsIds", "can_submit", "ab_guid", "annotatable_attachment_id", "anonymize_students", "require_lockdown_browser", "important_dates", "muted", "anonymous_peer_reviews", "anonymous_instructor_annotations", "graded_submissions_exist", "is_quiz_assignment", "in_closed_grading_period", "can_duplicate", "original_course_id", "original_assignment_id", "original_lti_resource_link_id", "original_assignment_name", "original_quiz_id", "workflow_state", "assignmentGroupId", "turnitinSettingsId", "lockInfoAssetString", "discussionTopicId", "submissionId", "rubricSettingsPoints_possible" FROM "temporary_assignment"`
        )
        await queryRunner.query(`DROP TABLE "temporary_assignment"`)
        await queryRunner.query(
            `ALTER TABLE "submission" RENAME TO "temporary_submission"`
        )
        await queryRunner.query(
            `CREATE TABLE "submission" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "assignment_id" numeric NOT NULL, "attempt" numeric NOT NULL, "body" text NOT NULL, "grade" text NOT NULL, "grade_matches_current_submission" boolean NOT NULL, "html_url" text, "preview_url" text NOT NULL, "score" numeric NOT NULL, "submission_commentsIds" text, "submission_type" text NOT NULL, "submitted_at" date NOT NULL, "url" text, "user_id" numeric NOT NULL, "grader_id" numeric NOT NULL, "graded_at" date NOT NULL, "userId" numeric, "late" boolean NOT NULL, "assignment_visible" boolean, "excused" boolean NOT NULL, "missing" boolean NOT NULL, "late_policy_status" text, "points_deducted" numeric, "seconds_late" numeric NOT NULL, "workflow_state" text NOT NULL, "extra_attempts" numeric, "anonymous_id" text NOT NULL, "posted_at" date NOT NULL, "read_status" text, "redo_request" boolean NOT NULL, "entered_grade" text NOT NULL, "entered_score" numeric NOT NULL, "media_commentId" numeric, "assignmentId" numeric, "courseId" text, "mediaCommentMediaId" text, CONSTRAINT "REL_ef99745f278ca701c5efe5d8dd" UNIQUE ("assignmentId"), CONSTRAINT "REL_7bd626272858ef6464aa257909" UNIQUE ("userId"), CONSTRAINT "REL_aa507b5db29b1ab1b65544c910" UNIQUE ("mediaCommentMediaId"))`
        )
        await queryRunner.query(
            `INSERT INTO "submission"("date_last_received_from_canvas", "id", "assignment_id", "attempt", "body", "grade", "grade_matches_current_submission", "html_url", "preview_url", "score", "submission_commentsIds", "submission_type", "submitted_at", "url", "user_id", "grader_id", "graded_at", "userId", "late", "assignment_visible", "excused", "missing", "late_policy_status", "points_deducted", "seconds_late", "workflow_state", "extra_attempts", "anonymous_id", "posted_at", "read_status", "redo_request", "entered_grade", "entered_score", "media_commentId", "assignmentId", "courseId", "mediaCommentMediaId") SELECT "date_last_received_from_canvas", "id", "assignment_id", "attempt", "body", "grade", "grade_matches_current_submission", "html_url", "preview_url", "score", "submission_commentsIds", "submission_type", "submitted_at", "url", "user_id", "grader_id", "graded_at", "userId", "late", "assignment_visible", "excused", "missing", "late_policy_status", "points_deducted", "seconds_late", "workflow_state", "extra_attempts", "anonymous_id", "posted_at", "read_status", "redo_request", "entered_grade", "entered_score", "media_commentId", "assignmentId", "courseId", "mediaCommentMediaId" FROM "temporary_submission"`
        )
        await queryRunner.query(`DROP TABLE "temporary_submission"`)
        await queryRunner.query(
            `ALTER TABLE "submission_attachment" RENAME TO "temporary_submission_attachment"`
        )
        await queryRunner.query(
            `CREATE TABLE "submission_attachment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "uuid" numeric NOT NULL, "folder_id" numeric NOT NULL, "display_name" text NOT NULL, "filename" text NOT NULL, "upload_status" text NOT NULL, "content-type" text NOT NULL, "url" text NOT NULL, "size" numeric NOT NULL, "created_at" date NOT NULL, "updated_at" date NOT NULL, "locked" boolean NOT NULL, "hidden" boolean NOT NULL, "hidden_for_user" boolean NOT NULL, "thumbnail_url" text NOT NULL, "modified_at" date NOT NULL, "mime_class" text NOT NULL, "category" text NOT NULL, "locked_for_user" boolean NOT NULL, "submissionId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "submission_attachment"("date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "upload_status", "content-type", "url", "size", "created_at", "updated_at", "locked", "hidden", "hidden_for_user", "thumbnail_url", "modified_at", "mime_class", "category", "locked_for_user", "submissionId") SELECT "date_last_received_from_canvas", "id", "uuid", "folder_id", "display_name", "filename", "upload_status", "content-type", "url", "size", "created_at", "updated_at", "locked", "hidden", "hidden_for_user", "thumbnail_url", "modified_at", "mime_class", "category", "locked_for_user", "submissionId" FROM "temporary_submission_attachment"`
        )
        await queryRunner.query(`DROP TABLE "temporary_submission_attachment"`)
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`)
        await queryRunner.query(
            `CREATE TABLE "user" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "name" text NOT NULL, "sortable_name" text NOT NULL, "last_name" text NOT NULL, "first_name" text NOT NULL, "short_name" text NOT NULL, "sis_user_id" text, "sis_import_id" numeric, "integration_id" text, "login_id" text NOT NULL, "avatar_url" text NOT NULL, "avatar_state" text, "email" text, "locale" text, "last_login" date, "time_zone" text, "bio" text, "enrollmentsId" numeric)`
        )
        await queryRunner.query(
            `INSERT INTO "user"("date_last_received_from_canvas", "id", "name", "sortable_name", "last_name", "first_name", "short_name", "sis_user_id", "sis_import_id", "integration_id", "login_id", "avatar_url", "avatar_state", "email", "locale", "last_login", "time_zone", "bio", "enrollmentsId") SELECT "date_last_received_from_canvas", "id", "name", "sortable_name", "last_name", "first_name", "short_name", "sis_user_id", "sis_import_id", "integration_id", "login_id", "avatar_url", "avatar_state", "email", "locale", "last_login", "time_zone", "bio", "enrollmentsId" FROM "temporary_user"`
        )
        await queryRunner.query(`DROP TABLE "temporary_user"`)
        await queryRunner.query(
            `ALTER TABLE "submission_comment" RENAME TO "temporary_submission_comment"`
        )
        await queryRunner.query(
            `CREATE TABLE "submission_comment" ("date_last_received_from_canvas" datetime NOT NULL DEFAULT (datetime('now')), "id" numeric PRIMARY KEY NOT NULL, "author_id" numeric NOT NULL, "author_name" text NOT NULL, "comment" text NOT NULL, "created_at" date NOT NULL, "edited_at" date NOT NULL, "authorId" numeric, "mediaCommentMediaId" text, "submissionId" numeric, CONSTRAINT "REL_85500b87f8bc1a38301af5db73" UNIQUE ("mediaCommentMediaId"))`
        )
        await queryRunner.query(
            `INSERT INTO "submission_comment"("date_last_received_from_canvas", "id", "author_id", "author_name", "comment", "created_at", "edited_at", "authorId", "mediaCommentMediaId", "submissionId") SELECT "date_last_received_from_canvas", "id", "author_id", "author_name", "comment", "created_at", "edited_at", "authorId", "mediaCommentMediaId", "submissionId" FROM "temporary_submission_comment"`
        )
        await queryRunner.query(`DROP TABLE "temporary_submission_comment"`)
        await queryRunner.query(`DROP TABLE "media_comment"`)
        await queryRunner.query(`DROP TABLE "rubric_assessment_criterion"`)
        await queryRunner.query(`DROP TABLE "quiz_submission_question"`)
        await queryRunner.query(`DROP TABLE "answer"`)
        await queryRunner.query(`DROP TABLE "quiz_submission"`)
        await queryRunner.query(`DROP TABLE "variable"`)
        await queryRunner.query(`DROP TABLE "quiz_submission_answer"`)
        await queryRunner.query(`DROP TABLE "quiz_question"`)
        await queryRunner.query(`DROP TABLE "question_data"`)
        await queryRunner.query(`DROP TABLE "match"`)
        await queryRunner.query(`DROP TABLE "formula"`)
        await queryRunner.query(`DROP TABLE "quiz"`)
        await queryRunner.query(`DROP TABLE "grading_period"`)
        await queryRunner.query(`DROP TABLE "file"`)
        await queryRunner.query(`DROP TABLE "grade"`)
        await queryRunner.query(`DROP TABLE "enrollment"`)
        await queryRunner.query(`DROP TABLE "group_topic"`)
        await queryRunner.query(`DROP TABLE "discussion_topic"`)
        await queryRunner.query(`DROP TABLE "term"`)
        await queryRunner.query(`DROP TABLE "course_progress"`)
        await queryRunner.query(`DROP TABLE "course"`)
        await queryRunner.query(`DROP TABLE "blueprint_restrictions"`)
        await queryRunner.query(`DROP TABLE "turnitin_settings"`)
        await queryRunner.query(`DROP TABLE "score_statistic"`)
        await queryRunner.query(`DROP TABLE "rubric_rating"`)
        await queryRunner.query(`DROP TABLE "rubric_criteria"`)
        await queryRunner.query(`DROP TABLE "needs_grading_count_by_section"`)
        await queryRunner.query(`DROP TABLE "lock_info"`)
        await queryRunner.query(`DROP TABLE "external_tool_tag_attributes"`)
        await queryRunner.query(`DROP TABLE "assignment_group"`)
        await queryRunner.query(`DROP TABLE "assignment_date"`)
        await queryRunner.query(`DROP TABLE "assignment"`)
        await queryRunner.query(`DROP TABLE "submission"`)
        await queryRunner.query(`DROP TABLE "submission_attachment"`)
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(`DROP TABLE "submission_comment"`)
        await queryRunner.query(`DROP TABLE "user_display"`)
    }
}
