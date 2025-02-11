import {
	DocumentDefinition,
	FilterQuery,
	UpdateQuery,
	QueryOptions,
	Query,
} from 'mongoose';
import recipeModel, { RecipeDocument } from './recipe.model';
import sanitize = require('mongo-sanitize');

function populateRecipe(model: Query<any, any> | RecipeDocument) {
	return model
		.populate('categoriesId')
		.populate('creatorId')
		.populate({
			path: 'ingredients.ingredientId',
			populate: { path: 'typeId' },
		})
		.populate({
			path: 'sidedishesId',
			populate: {
				path: 'ingredients.ingredientId',
				populate: { path: 'typeId' },
			},
		});
}

/**
 * This function will create a new recipe for a user and return the recipe
 *
 * @param body - The body of the recipe (based on the recipeModel)
 * @returns a recipe document
 */
export async function createRecipe(body: DocumentDefinition<RecipeDocument>) {
	try {
		body = sanitize(body);

		return populateRecipe(await recipeModel.create(body));
	} catch (error) {
		throw new Error(error as string);
	}
}

/**
 * This function will find a recipe and return it
 *
 * @param query - a query object that will be used to find a recipe from the DB
 * @param options - options for the findOne function from mongoose
 * @returns a recipe document
 */
export async function findRecipe(
	query: FilterQuery<RecipeDocument>,
	limit = 1,
	options: QueryOptions = { lean: true }
) {
	try {
		query = sanitize(query);

		if (isNaN(limit)) limit = 100;
		return populateRecipe(recipeModel.find(query, {}, options).limit(limit));
	} catch (error) {
		throw new Error(error as string);
	}
}

/**
 * This function will find, update and return a recipe
 *
 * @param query - a query object that will be used to find a recipe from the DB
 * @param update - a query object that will be used to specify the update
 * @param options - options for the findOne function from mongoose
 * @returns a recipe document
 */
export function findAndUpdateRecipe(
	query: FilterQuery<RecipeDocument>,
	update: UpdateQuery<RecipeDocument>,
	options: QueryOptions
) {
	try {
		query = sanitize(query);
		update = sanitize(update);
		return populateRecipe(recipeModel.findOneAndUpdate(query, update, options));
	} catch (error) {
		throw new Error(error as string);
	}
}

/**
 * This function will find and delete a recipe
 *
 * @param query - a query object that will be used to find a recipe from the DB
 * @returns a recipe document
 */
export function deleteRecipe(query: FilterQuery<RecipeDocument>) {
	try {
		query = sanitize(query);
		return recipeModel.deleteOne(query);
	} catch (error) {
		throw new Error(error as string);
	}
}
