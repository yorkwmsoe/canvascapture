import { Assignment } from '@modules/canvas_api/types/assignment.js';
import { Course } from '@modules/canvas_api/types/course.js';

export const testAssignments: Assignment[] = [
  {
    "id": 1,
    "description": "",
    "points_possible": 5,
    "grading_type": "points",
    "assignment_group_id": 1,
    "grading_standard_id": null,
    "created_at": "2023-09-20T14:38:53Z",
    "updated_at": "2023-09-20T14:40:04Z",
    "peer_reviews": false,
    "automatic_peer_reviews": false,
    "position": 1,
    "grade_group_students_individually": false,
    "anonymous_peer_reviews": false,
    "post_to_sis": false,
    "moderated_grading": false,
    "omit_from_final_grade": false,
    "intra_group_peer_reviews": false,
    "anonymous_instructor_annotations": false,
    "anonymous_grading": false,
    "graders_anonymous_to_graders": false,
    "grader_count": 0,
    "grader_comments_visible_to_graders": true,
    "grader_names_visible_to_final_grader": true,
    "allowed_attempts": -1,
    "hide_in_gradebook": false,
    "secure_params": "verysecure",
    "lti_context_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "course_id": 1,
    "name": "Test Assignment 1",
    "submission_types": [
      "online_text_entry"
    ],
    "has_submitted_submissions": true,
    "due_date_required": false,
    "max_name_length": 255,
    "in_closed_grading_period": false,
    "graded_submissions_exist": true,
    "is_quiz_assignment": false,
    "can_duplicate": true,
    "workflow_state": "published",
    "important_dates": false,
    "muted": false,
    "html_url": "http://10.200.4.10/courses/1/assignments/1",
    "has_overrides": false,
    "needs_grading_count": 0,
    "integration_data": {},
    "published": true,
    "unpublishable": false,
    "only_visible_to_overrides": false,
    "locked_for_user": false,
    "submissions_download_url": "http://10.200.4.10/courses/1/assignments/1/submissions?zip=1",
    "post_manually": false,
    "anonymize_students": false,
    "require_lockdown_browser": false,
    "restrict_quantitative_data": false
  },
];

export const testCourses: Course[] = [
  {
    "id": 1,
    "name": "Test Course 1",
    "account_id": 3,
    "uuid": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "created_at": "2023-09-20T14:29:51Z",
    "course_code": "TST1",
    "default_view": "syllabus",
    "root_account_id": 2,
    "enrollment_term_id": 3,
    "public_syllabus": false,
    "public_syllabus_to_auth": false,
    "storage_quota_mb": 500,
    "is_public_to_auth_users": false,
    "homeroom_course": false,
    "apply_assignment_group_weights": false,
    "calendar": {
      "ics": "http://10.200.4.10/feeds/calendars/course_dZdmGkWRxU8pYyJaNnW60M2mYIQ1HmWAK4Wg06mc.ics"
    },
    "time_zone": "America/Denver",
    "blueprint": false,
    "enrollments": [
      {
        "type": "teacher",
        "role": "TeacherEnrollment",
        "role_id": 20,
        "user_id": 1,
        "enrollment_state": "active",
        "limit_privileges_to_course_section": false
      }
    ],
    "hide_final_grades": false,
    "workflow_state": "available",
    "restrict_enrollments_to_course_dates": false
  },
];