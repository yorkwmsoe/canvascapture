/**
 * Defines type matching user-related
 * portions of the Canvas API
 */
import 'reflect-metadata'
import type { Enrollment } from './enrollment'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import CanvasEntity from './canvas-entity'

@Entity()
export class User extends CanvasEntity {
    // The ID of the user.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // The name of the user.
    @Column({ type: 'text' })
    name: string

    // The name of the user that it should be used for sorting groups of users, such
    // as in the gradebook.
    @Column({ type: 'text' })
    sortable_name: string

    // The last name of the user.
    @Column({ type: 'text' })
    last_name: string

    // The first name of the user.
    @Column({ type: 'text' })
    first_name: string

    // A short name the user has selected, for use in conversations or other less
    // formal places through the site.
    @Column({ type: 'text' })
    short_name: string

    // The SIS ID associated with the user.  This field is only included if the user
    // came from a SIS import and has permissions to view SIS information.
    @Column({ nullable: true, type: 'text' })
    sis_user_id?: string

    // The id of the SIS import.  This field is only included if the user came from
    // a SIS import and has permissions to manage SIS information.
    @Column({ nullable: true, type: 'numeric' })
    sis_import_id?: number

    // The integration_id associated with the user.  This field is only included if
    // the user came from a SIS import and has permissions to view SIS information.
    @Column({ nullable: true, type: 'text' })
    integration_id?: string

    // The unique login id for the user.  This is what the user uses to log in to
    // Canvas.
    @Column({ type: 'text' })
    login_id: string

    // If avatars are enabled, this field will be included and contain a url to
    // retrieve the user's avatar.
    @Column({ type: 'text' })
    avatar_url: string

    // Optional: If avatars are enabled and caller is admin, this field can be
    // requested and will contain the current state of the user's avatar.
    @Column({ nullable: true, type: 'text' })
    avatar_state?: string

    // Optional: This field can be requested with certain API calls, and will return
    // a list of the users active enrollments. See the List enrollments API for more
    // details about the format of these records.
    @ManyToOne('Enrollment', (enrollment: Enrollment) => enrollment.user)
    @JoinColumn()
    enrollments?: Enrollment[]

    // Optional: This field can be requested with certain API calls, and will return
    // the users primary email address.
    @Column({ nullable: true, type: 'text' })
    email?: string

    // Optional: This field can be requested with certain API calls, and will return
    // the users locale in RFC 5646 format.
    @Column({ nullable: true, type: 'text' })
    locale?: string

    // Optional: This field is only returned in certain API calls, and will return a
    // timestamp representing the last time the user logged in to canvas-api.
    @Column({ nullable: true, type: 'date' })
    last_login?: Date

    // Optional: This field is only returned in certain API calls, and will return
    // the IANA time zone name of the user's preferred timezone.
    @Column({ nullable: true, type: 'text' })
    time_zone?: string

    // Optional: The user's bio.
    @Column({ nullable: true, type: 'text' })
    bio?: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}

@Entity()
export class UserDisplay extends CanvasEntity {
    // The ID of the user.
    @PrimaryColumn({ type: 'numeric' })
    id: number

    // A short name the user has selected, for use in conversations or other less
    // formal places through the site.
    @Column({ type: 'text' })
    short_name: string
    // If avatars are enabled, this field will be included and contain a url to
    // retrieve the user's avatar.
    @Column({ nullable: true, type: 'text' })
    avatar_image_url?: string

    // URL to access user, either nested to a context or directly.
    @Column({ type: 'text' })
    html_url: string

    @UpdateDateColumn()
    date_last_received_from_canvas: Date
}
