export type UserAccountAssociationCreatedEvent = {
    // The Canvas id of the account for this association.
    account_id: number
    // The unique id of the account for this association.
    account_uuid: string
    // The time at which this association was created.
    created_at: Date
    // Is user an administrator?
    is_admin: boolean
    // The time at which this association was last modified.
    updated_at: Date
    // The Canvas id of the user for this association.
    user_id: number
}

export type UserEvent = {
    // The time at which this user was created.
    created_at: Date
    // Name of user.
    name: string
    // Short name of user.
    short_name: string
    // The time at which this user was last modified in any way.
    updated_at: Date
    // The Canvas id of user.
    user_id: number
    // The login of the current user.
    user_login: string
    // The SIS id of the user.
    user_sis_id: string
    // Unique user id.
    uuid: string
    // State of the user.
    workflow_state: string
}
