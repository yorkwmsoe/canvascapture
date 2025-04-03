import { Column } from 'typeorm'

export class CourseCalendar {
    // The URL of the calendar in ICS format
    @Column({ type: 'text' })
    ics: string
}
