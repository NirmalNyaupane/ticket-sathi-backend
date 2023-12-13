enum Role {
  USER = "USER",
  ORGANIZER = "ORGANIZER",
  ADMIN = "ADMIN",
}

enum OrganizerStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPEND = "SUSPEND",
}

enum Event {
  CONCERT = "CONCERT",
  THEATER = "THEATER",
}

enum EventStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
}
export { Role, OrganizerStatus, Event, EventStatus};
