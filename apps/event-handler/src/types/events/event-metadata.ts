export type EventMetadata = {
    root_account_uuid: string
    root_account_id: number
    root_account_lti_guid: string
    user_login: string
    user_account_id: number
    user_sis_id: string
    user_id: number
    time_zone: string
    context_type: string
    context_id: number
    context_sis_source_id: string
    context_account_id: number
    context_role: string
    request_id: string
    session_id: string
    hostname: string
    http_method: string
    user_agent: string
    client_ip: string
    url: string
    referrer: string
    producer: string
    event_name: string
    event_time: Date
}
