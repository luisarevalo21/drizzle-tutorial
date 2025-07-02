import "dotenv/config";
import { db } from "./drizzle/db";
import { UserPreferencesTable, UserTable } from "./drizzle/schema";
import { asc, sql, desc, eq, count, gt } from "drizzle-orm";
async function main() {
  // await db.insert(UserPreferencesTable).values({
  //   emailUpdates: true,
  //   userId: "26856509-694a-4322-9ba0-38f245c7d29f",
  // });

  // const users = await db
  //   .delete(UserTable)
  //   .where(eq(UserTable.email, "test@test.com"));
  //update
  const users = await db.select().from(UserTable);
  console.log(users);
  // console.log(users);
  // // const users = await db
  // //   .update(UserTable)
  // //   .set({
  // //     age: 30,
  // //   })
  // //   .where(eq(UserTable.age, 30));
}
main();

//INSERT DATA
//   await db.delete(UserTable);
//   //returns an array as we can insert multiple values at once
//   const user = await db
//     .insert(UserTable)
//     .values([
//       {
//         name: "tim",
//         age: 29,
//         email: "test@test.com",
//       },
//       {
//         name: "Sally",
//         age: 10,
//         email: "sallay@test.com",
//       },
//     ])
//     //what to return in drizzle
//     //is in this and can return whatever i want but i map it to what i want from
//     .returning({
//       id: UserTable.id,
//       userName: UserTable.name,
//     })
//     //upsert or update
//     //targets the duplicate then sets the name to the text provided
//     //if user exits it will do the update
//     .onConflictDoUpdate({
//       target: UserTable.email,
//       set: {
//         name: "updated named",
//       },
//     });
// //   console.log(user);

//select data
// with extras
//  const user = await db.query.UserTable.findMany({
//     columns: { name: true },
//     //raw sql takes a template string
//     // Query: select "name", lower("name") as "lowerCaseName" from "user" "UserTable"
//     //key what it will be called:
//     //  pair value raw sql, using sql function a generic can pass the type
//     //pass the normal sql referncig column name and can be used directly
//     extras: {
//       lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName"),
//     },
//   });

//SELECT WAY
// gets all users and gest their id  age and emailUpdates from the usertable and do a left join
// from the preferences table where the ids match from eahc table
// const user = await db
//   .select({
//     id: UserTable.id,
//     age: UserTable.age,
//     emailUpdates: UserPreferencesTable.emailUpdates,
//   })
//   .from(UserTable)
//   // .where(eq(UserTable.age, 29))
//   .leftJoin(
//     UserPreferencesTable,
//     eq(UserPreferencesTable.userId, UserTable.id)
//   );
//returns all the uers and counts how many there are
// const user = await db
//   .select({
//     name: UserTable.name,
//     count: count(UserTable.name),
//   })
//   .from(UserTable)
//   .groupBy(UserTable.name);

//now it counts all ages and groups them by ages and updates thir counts counting them
// const user = await db
//   .select({
//     name: UserTable.name,
//     count: count(UserTable.name),
//   })
//   .from(UserTable)
//   .groupBy(UserTable.name)
//   .having(columns => gt(columns.count, 1));
// console.log("user", user);

//QUERY WAY
//query way
// const user = await db.query.UserTable.findMany({
//   columns: { age: true, id: true },
// limit: 1,
//skips the first element
// offset: 0,

//returns rows where the age is 29
// where: (table, funcs) => funcs.eq(table.age, 29),

//works the same order by function
// orderBy: (table, funcs) => funcs.asc(table.age),
// orderBy: (table, { asc }) => asc(table.age),

//orers by a paramter picekd age, name etc
// orderBy: asc(UserTable.age),
// orderBy: desc(UserTable.age),

//gets all posts with postcateogirs
// with: {
//   posts: { with: { postCategories: true } },

// },
// });
//   await db.insert(UserTable).values({
//     name: "John Doe",
//   });
//   const user = await db.query.UserTable.findFirst();
//   console.log(user);
//   await db.delete(UserTable)/
