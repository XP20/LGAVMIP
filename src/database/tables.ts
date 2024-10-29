import { sql } from 'drizzle-orm/sql/sql';
import { sqliteTable, integer, text, check } from 'drizzle-orm/sqlite-core';

export const leaderboard = sqliteTable('leaderboard', {
    id: integer().primaryKey({ autoIncrement: true }),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    username: text().notNull(),
    score: integer().notNull(),
}, (table) => ({
    checkConstraint: check('username_check', sql`LENGTH(${table.username}) <= 10`),
}));