import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';

interface ModelDefinition {
	domainClass: any,
	model: mongoose.Model<mongoose.Document>
}

declare class MongooseSession {
	constructor(models: ModelDefinition[], connection: mongoose.Connection);

	startTransaction(transactionOptions?: mongodb.TransactionOptions, sessionOptions?: mongodb.SessionOptions): Promise<void>;
	commitTransaction(): Promise<void>;
	abortTransaction(): Promise<void>;

	bulkWrite<T>(domainClass: { new(): T }, writes: Array<any>, options?: mongodb.CollectionBulkWriteOptions): Promise<mongodb.BulkWriteOpResultObject>;
	count<T>(domainClass: { new(): T }, filter: mongoose.FilterQuery<T>): mongoose.QueryWithHelpers<number, any>;
	countDocuments<T>(domainClass: { new(): T }, vfilter: mongoose.FilterQuery<T>): mongoose.QueryWithHelpers<number, any>;

	create<T>(domainClass: { new(): T }, doc: T | mongoose.DocumentDefinition<T>): Promise<T>;
	create<T>(domainClass: { new(): T }, doc: T | mongoose.DocumentDefinition<T>, options?: mongoose.SaveOptions): Promise<T>;
	create<T>(domainClass: { new(): T }, doc: T[] | mongoose.DocumentDefinition<T>): Promise<T>;
	create<T>(domainClass: { new(): T }, doc: T[] | mongoose.DocumentDefinition<T>, options?: mongoose.SaveOptions): Promise<T>;

	createCollection<T>(domainClass: { new(): T }, options?: mongodb.CollectionCreateOptions): Promise<mongodb.Collection<T>>;
	createIndexes<T>(domainClass: { new(): T }, options?: any): Promise<void>;

	deleteMany<T>(domainClass: { new(): T }, filter?: mongoose.FilterQuery<T>, options?: mongoose.QueryOptions): mongoose.QueryWithHelpers<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }, any>;
	deleteOne<T>(domainClass: { new(): T }, filter?: mongoose.FilterQuery<T>, options?: mongoose.QueryOptions): mongoose.QueryWithHelpers<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }, any>;

	ensureIndexes<T>(domainClass: { new(): T }, options?: any): Promise<void>;

	findById<T>(domainClass: { new(): T }, id: any, projection?: any | null, options?: mongoose.QueryOptions | null): mongoose.QueryWithHelpers<T | null, any>;
	findOne<T>(domainClass: { new(): T }, filter?: mongoose.FilterQuery<T>, projection?: any | null, options?: mongoose.QueryOptions | null): mongoose.QueryWithHelpers<T | null, any>;

	hydrate<T>(domainClass: { new(): T }, obj: any, projection?: any | null): T;

	init<T>(domainClass: { new(): T }): Promise<T>;

	insertMany<T>(domainClass: { new(): T }, doc: T | mongoose.DocumentDefinition<T>, options?: mongoose.InsertManyOptions): Promise<mongoose.InsertManyResult>;
	insertMany<T>(domainClass: { new(): T }, docs: Array<T | mongoose.DocumentDefinition<T>>, options?: mongoose.InsertManyOptions): Promise<mongoose.InsertManyResult>;

	find<T>(domainClass: { new(): T }, filter: mongoose.FilterQuery<T>, projection?: any | null, options?: mongoose.QueryOptions | null): mongoose.QueryWithHelpers<Array<T>, any>;

	findOneAndUpdate<T>(domainClass: { new(): T }, filter?: mongoose.FilterQuery<T>, update?: mongoose.UpdateQuery<T>, options?: mongoose.QueryOptions | null): mongoose.QueryWithHelpers<T | null, any>;
}
