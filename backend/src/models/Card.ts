import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

export interface ICard extends Document {
  sender: Types.ObjectId;
  receiver?: Types.ObjectId;
  title: string;
  message: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    template: {
      type: String,
      required: true,
      default: "birthday",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICard>(
  "Card",
  cardSchema
);