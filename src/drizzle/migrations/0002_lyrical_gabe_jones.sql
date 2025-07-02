ALTER TABLE "post" DROP CONSTRAINT "post_authorId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "userPreferences" DROP CONSTRAINT "userPreferences_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;