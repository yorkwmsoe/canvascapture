export type DiscussionTopic = {
  // The ID of this topic.
  id: 1;
  // The topic title.
  title: "Topic 1";
  // The HTML content of the message body.
  message: "<p>content here</p>";
  // The URL to the discussion topic in canvas.
  html_url: "https://<canvas>/courses/1/discussion_topics/2";
  // The datetime the topic was posted. If it is null it hasn't been posted yet.
  // (see delayed_post_at)
  posted_at: "2037-07-21T13:29:31Z";
  // The datetime for when the last reply was in the topic.
  last_reply_at: "2037-07-28T19:38:31Z";
  // If true then a user may not respond to other replies until that user has made
  // an initial reply. Defaults to false.
  require_initial_post: false;
  // Whether or not posts in this topic are visible to the user.
  user_can_see_posts: true;
  // The count of entries in the topic.
  discussion_subentry_count: 0;
  // The read_state of the topic for the current user, 'read' or 'unread'.
  read_state: "read";
  // The count of unread entries of this topic for the current user.
  unread_count: 0;
  // Whether or not the current user is subscribed to this topic.
  subscribed: true;
  // (Optional) Why the user cannot subscribe to this topic. Only one reason will
  // be returned even if multiple apply. Can be one of: 'initial_post_required':
  // The user must post a reply first; 'not_in_group_set': The user is not in the
  // group set for this graded group discussion; 'not_in_group': The user is not
  // in this topic's group; 'topic_is_announcement': This topic is an announcement
  subscription_hold: "not_in_group_set";
  // The unique identifier of the assignment if the topic is for grading,
  // otherwise null.
  assignment_id: null;
  // The datetime to publish the topic (if not right away).
  delayed_post_at: null;
  // Whether this discussion topic is published (true) or draft state (false)
  published: true;
  // The datetime to lock the topic (if ever).
  lock_at: null;
  // Whether or not the discussion is 'closed for comments'.
  locked: false;
  // Whether or not the discussion has been 'pinned' by an instructor
  pinned: false;
  // Whether or not this is locked for the user.
  locked_for_user: true;
  // (Optional) Information for the user about the lock. Present when
  // locked_for_user is true.
  lock_info: null;
  // (Optional) An explanation of why this is locked for the user. Present when
  // locked_for_user is true.
  lock_explanation: "This discussion is locked until September 1 at 12:00am";
  // The username of the topic creator.
  user_name: "User Name";
  // DEPRECATED An array of topic_ids for the group discussions the user is a part
  // of.
  topic_children: [5, 7, 10];
  // An array of group discussions the user is a part of. Fields include: id,
  // group_id
  group_topic_children: [
    { id: 5; group_id: 1 },
    { id: 7; group_id: 5 },
    { id: 10; group_id: 4 }
  ];
  // If the topic is for grading and a group assignment this will point to the
  // original topic in the course.
  root_topic_id: null;
  // If the topic is a podcast topic this is the feed url for the current user.
  podcast_url: "/feeds/topics/1/enrollment_1XAcepje4u228rt4mi7Z1oFbRpn3RAkTzuXIGOPe.rss";
  // The type of discussion. Values are 'side_comment', for discussions that only
  // allow one level of nested comments, and 'threaded' for fully threaded
  // discussions.
  discussion_type: "side_comment";
  // The unique identifier of the group category if the topic is a group
  // discussion, otherwise null.
  group_category_id: null;
  // Array of file attachments.
  attachments: null;
  // The current user's permissions on this topic.
  permissions: { attach: true };
  // Whether or not users can rate entries in this topic.
  allow_rating: true;
  // Whether or not grade permissions are required to rate entries.
  only_graders_can_rate: true;
  // Whether or not entries should be sorted by rating.
  sort_by_rating: true;
};
