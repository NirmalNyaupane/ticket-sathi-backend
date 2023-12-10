import UserModel from "./user.model.js";
import OrganizerModel from "./organizer.model.js";
import OtpModel from "./otp.model.js";
import EventCategoryModel from "./eventcategory.model.js";

const defineAssociation = () => {
  //userModel and otp model
  UserModel.hasOne(OtpModel, { onDelete: "CASCADE" });
  OtpModel.belongsTo(UserModel, {
    onDelete: "cascade",
    foreignKey: "email",
    targetKey: "email",
  });

  //userModel and organizer model
  UserModel.hasOne(OrganizerModel, { onDelete: "CASCADE" });
  OrganizerModel.belongsTo(UserModel, {
    foreignKey: "userId",
    targetKey: "id",
  });

  //organizer model and event category model
  OrganizerModel.hasMany(EventCategoryModel, { onDelete: "CASCADE" });
  EventCategoryModel.belongsTo(OrganizerModel, {
    foreignKey: "organizer_id",
    targetKey: "id",
    onDelete: "CASCADE",
  });
};

export default defineAssociation;
