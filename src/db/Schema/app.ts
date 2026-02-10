import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

// One Department → Many Subjects
// Each Subject belongs to exactly one Department

// This is called a One-to-Many relationship in SQL.
// One Department → Many Subjects

// Many Subjects → One Department
const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
}


export const departments = pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps

});

export const subjects = pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer('department_id').notNull().references(() => departments.id, { onDelete: "restrict" }), //ondelet means  You cannot delete a department
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps

})

export const departmentRelations = relations(departments, ({ many }) => ({ subjects: many(subjects) }))

export const subjectsRelations = relations(subjects, ({ one }) => ({
    departments: one(departments, {
        fields: [subjects.departmentId], //points to the department this subject belongs to
        references: [departments.id]
    })

}))

export type Department = typeof departments.$inferSelect;
export type Newdepartment = typeof departments.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type NewSubjects = typeof subjects.$inferInsert;