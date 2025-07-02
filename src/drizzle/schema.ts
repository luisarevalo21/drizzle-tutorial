import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  integer,
  pgEnum,
  index,
  unique,
  uniqueIndex,
  boolean,
  real,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"]);

/*Extra Notes

age is now an array of ages instead of a single number
    age: integer("age").notNull().array()

    //overwrites the tpye of this object
    //this example exnofrces age must be 12 or 24 nothing else helps specifiy the data from json
    age: integer("age").notNull().$type<12 || 24>()

    default runs everytime when inserting
    age: integer("age").notNull().$default(()=>Math.random())

 userId: uuid("userId")
 //what happens when deeleting? can do cascade,set null etc 
    .references(() => UserTable.id, {onDelete: "set null'"})
    .notNull(),

*/
export const UserTable = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: UserRole("userRole").default("BASIC").notNull(),
  },
  table => [uniqueIndex("emailIndex").on(table.email)]

  //user should have unique name and age
  // uniqueNameAndAge: unique("uniqueNameAndAge").on(table.name, table.age),
);

//1to 1 refernce
export const UserPreferencesTable = pgTable("userPreferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  //referemces the id in the usertable
  //this userid in our preferences table id column in user table
  //crates foreign key
  userId: uuid("userId")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
});

//1 to many reference
//user can create many posts
export const PostTable = pgTable("post", {
  //code name => column name can be post_id
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: real("averageRating").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  //authorid points to the user in the user table
  authorId: uuid("authorId")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
});

//many to many
// each post with a category
//category will have a post
//post will have multiple categories
//each categoiry can have multiple posts

export const CategoryTable = pgTable("category", {
  id: uuid("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

//join table
export const PostCategoryTable = pgTable(
  "postCategory",
  {
    // can add an id but each postid and categoryid will be unique
    postId: uuid("postId")
      .references(() => PostTable.id)
      .notNull(),
    categoryId: uuid("categoryId")
      .references(() => CategoryTable.id)
      .notNull(),
  },
  //uses primary using the columsn as the primary key
  //a composite key
  table => {
    return { pk: primaryKey({ columns: [table.postId, table.categoryId] }) };
  }
);

// RELATIONS
export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    //our user table has one user prefernce from the user prefernces table
    preferences: one(UserPreferencesTable),
    //user will have many posts passing the table
    posts: many(PostTable),
  };
});

export const UserPreferecesTableRelations = relations(
  UserPreferencesTable,
  ({ one }) => {
    return {
      //one to to one map
      //the table that has the id user prefernces has the id being mapped
      // the table that has the foreign key needs additonal data for the mapping to work
      //fields user preferences table the foreign key
      //the foreign key
      //references the user table id references the id in the user table
      user: one(UserTable, {
        fields: [UserPreferencesTable.userId],
        references: [UserTable.id],
      }),
    };
  }
);

export const PostTableRelations = relations(PostTable, ({ one, many }) => {
  return {
    //one to many relationship,
    //the one needs to add the addtional fields
    author: one(UserTable, {
      //fields is the foreighn key the thing we are using to reference in the other table
      fields: [PostTable.authorId],
      //the table we want to reference the usertable.id
      references: [UserTable.id],
    }),
    postCategories: many(PostCategoryTable),
  };
});

export const CategoryTableRelations = relations(CategoryTable, ({ many }) => {
  return {
    postCategories: many(PostCategoryTable),
  };
});

export const PostCategoryTableRelations = relations(
  PostCategoryTable,
  ({ one }) => {
    return {
      post: one(PostTable, {
        fields: [PostCategoryTable.postId],
        references: [PostTable.id],
      }),
      category: one(CategoryTable, {
        fields: [PostCategoryTable.categoryId],
        references: [CategoryTable.id],
      }),
    };
  }
);
