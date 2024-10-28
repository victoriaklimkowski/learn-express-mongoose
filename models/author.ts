import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Author document
export interface IAuthor extends Document {
  first_name: string;
  family_name: string;
  date_of_birth?: Date;
  date_of_death?: Date;
  name: string;
  lifespan: string;
}

var AuthorSchema: Schema<IAuthor> = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
// This is a virtual property that's mapped to a function
// that returns the full name of the author
AuthorSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  // VIRTUAL attributes assigned to the virtual property
  // are not persisted to the database
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getFullYear().toString();
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += this.date_of_death.getFullYear().toString();
  }
  return lifetime_string;
});

// Export the model
// Items are not restricted to exactly the schema but it gives us an idea
// WE'ere actually creating a mongoose model of Author
// we can then use that model to interact with the database
const Author: Model<IAuthor> = mongoose.model<IAuthor>('Author', AuthorSchema);
export default Author;
