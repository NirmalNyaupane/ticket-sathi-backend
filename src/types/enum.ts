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
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

enum DiscountType {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE",
}

enum CommissionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export {
  Role,
  OrganizerStatus,
  Event,
  EventStatus,
  DiscountType,
  CommissionStatus,
};
