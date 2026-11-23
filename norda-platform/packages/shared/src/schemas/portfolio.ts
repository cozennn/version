import { z } from 'zod';
import { PROJECT_PUBLICATION_STATUSES } from '../constants.js';
import { idSchema, localizedTextSchema, paginationQuerySchema, slugSchema } from './common.js';
export const projectBlockSchema = z.discriminatedUnion('type',[
 z.object({type:z.literal('overview'),title:localizedTextSchema,body:localizedTextSchema}),
 z.object({type:z.literal('objectives'),title:localizedTextSchema,items:z.array(localizedTextSchema).min(1)}),
 z.object({type:z.literal('challenges'),title:localizedTextSchema,body:localizedTextSchema}),
 z.object({type:z.literal('process'),title:localizedTextSchema,steps:z.array(z.object({title:localizedTextSchema,body:localizedTextSchema})).min(1)}),
 z.object({type:z.literal('decisions'),title:localizedTextSchema,items:z.array(localizedTextSchema).min(1)}),
 z.object({type:z.literal('deliverables'),title:localizedTextSchema,items:z.array(localizedTextSchema).min(1)}),
 z.object({type:z.literal('outcomes'),title:localizedTextSchema,body:localizedTextSchema,disclaimer:localizedTextSchema.nullable()}),
 z.object({type:z.literal('tools'),title:localizedTextSchema,items:z.array(z.string().trim().min(1).max(120)).min(1)}),
 z.object({type:z.literal('quote'),text:localizedTextSchema,attribution:localizedTextSchema.nullable()})
]);
export const projectMediaInputSchema = z.object({id:idSchema.optional(),url:z.string().trim().min(1).max(2000),alt:localizedTextSchema,width:z.number().int().min(1),height:z.number().int().min(1),sortOrder:z.number().int().min(0).default(0)});
export const projectUpsertSchema = z.object({slug:slugSchema,title:localizedTextSchema,summary:localizedTextSchema,categoryId:idSchema.nullable(),publicationStatus:z.enum(PROJECT_PUBLICATION_STATUSES).default('draft'),isFeatured:z.boolean().default(false),isDemo:z.boolean().default(false),blocks:z.array(projectBlockSchema).min(1),coverMediaId:idSchema.nullable(),gallery:z.array(projectMediaInputSchema).default([]),seoTitle:localizedTextSchema.nullable(),seoDescription:localizedTextSchema.nullable()});
export type ProjectUpsert = z.infer<typeof projectUpsertSchema>;
export const projectQuerySchema = paginationQuerySchema.extend({category:z.string().trim().max(120).optional(),featuredOnly:z.coerce.boolean().default(false),q:z.string().trim().max(200).optional()});
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export const projectCategoryUpsertSchema = z.object({slug:slugSchema,name:localizedTextSchema,sortOrder:z.number().int().min(0).default(0)});
