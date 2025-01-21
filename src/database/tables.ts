import { sql } from 'drizzle-orm/sql/sql';
import { sqliteTable, integer, text, real, check } from 'drizzle-orm/sqlite-core';

export const leaderboard = sqliteTable('leaderboard', {
    id: integer().primaryKey({ autoIncrement: true }),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    username: text().notNull(),
    score: integer().notNull(),
}, (table) => ({
    checkConstraint: check('username_check', sql`LENGTH(${table.username}) <= 10`),
}));

//placeholder llm code
export const gamemodes = sqliteTable('gamemodes', {
    id: integer().primaryKey({ autoIncrement: true }),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    name: text().notNull().unique(),
    description: text().notNull(),
});

export const coordinates = sqliteTable('coordinates', {
    id: integer().primaryKey({ autoIncrement: true }),
    gamemode_id: integer().notNull().references(() => gamemodes.id),
    latitude: real().notNull(),
    longitude: real().notNull(),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
}, (table) => ({
    latitudeCheck: check('latitude_check', sql`${table.latitude} >= -90 AND ${table.latitude} <= 90`),
    longitudeCheck: check('longitude_check', sql`${table.longitude} >= -180 AND ${table.longitude} <= 180`),
}));
