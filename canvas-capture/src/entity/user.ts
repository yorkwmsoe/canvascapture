/**
 * Defines type matching user-related
 * portions of the Canvas API
 */
import { Enrollment } from './enrollment'
import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
    // The ID of the user.
    @PrimaryColumn()
    id: number

    // The name of the user.
    @Column()
    name: string

    // The name of the user that it should be used for sorting groups of users, such
    // as in the gradebook.
    @Column()
    sortable_name: string

    // The last name of the user.
    @Column()
    last_name: string

    // The first name of the user.
    @Column()
    first_name: string

    // A short name the user has selected, for use in conversations or other less
    // formal places through the site.
    @Column()
    short_name: string

    // The SIS ID associated with the user.  This field is only included if the user
    // came from a SIS import and has permissions to view SIS information.
    @Column()
    sis_user_id?: string

    // The id of the SIS import.  This field is only included if the user came from
    // a SIS import and has permissions to manage SIS information.
    @Column()
    sis_import_id?: number

    // The integration_id associated with the user.  This field is only included if
    // the user came from a SIS import and has permissions to view SIS information.
    @Column()
    integration_id?: string

    // The unique login id for the user.  This is what the user uses to log in to
    // Canvas.
    @Column()
    login_id: string

    // If avatars are enabled, this field will be included and contain a url to
    // retrieve the user's avatar.
    @Column()
    avatar_url: string

    // Optional: If avatars are enabled and caller is admin, this field can be
    // requested and will contain the current state of the user's avatar.
    @Column()
    avatar_state?: string

    // Optional: This field can be requested with certain API calls, and will return
    // a list of the users active enrollments. See the List enrollments API for more
    // details about the format of these records.
    @ManyToOne(() => Enrollment, (enrollment) => enrollment.user)
    @JoinColumn()
    enrollments?: Enrollment[]

    // Optional: This field can be requested with certain API calls, and will return
    // the users primary email address.
    @Column()
    email?: string

    // Optional: This field can be requested with certain API calls, and will return
    // the users locale in RFC 5646 format.
    @Column()
    locale?: string

    // Optional: This field is only returned in certain API calls, and will return a
    // timestamp representing the last time the user logged in to canvas-api.
    @Column()
    last_login?: Date

    // Optional: This field is only returned in certain API calls, and will return
    // the IANA time zone name of the user's preferred timezone.
    @Column()
    time_zone?: string

    // Optional: The user's bio.
    @Column()
    bio?: string
}

@Entity()
export class UserDisplay {
    // The ID of the user.
    @PrimaryColumn()
    id: number

    // A short name the user has selected, for use in conversations or other less
    // formal places through the site.
    @Column()
    short_name: string
    // If avatars are enabled, this field will be included and contain a url to
    // retrieve the user's avatar.
    @Column()
    avatar_image_url?: string

    // URL to access user, either nested to a context or directly.
    @Column()
    html_url: string
}
