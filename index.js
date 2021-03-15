function MongooseSession(models, connection) {
	this.models = models;
	this.connection = connection;
	this.mongoSession = null;

	this.startTransaction = (transactionOptions, sessionOptions) => {
		if (this.mongoSession) {
			connection.startTransaction(transactionOptions);
			return Promise.resolve();
		}

		return this.connection.startSession(sessionOptions)
			.then(session => {
				this.mongoSession = session;
				this.mongoSession.startTransaction(transactionOptions);
			});
	};

	this.commitTransaction = () => {
		return this.mongoSession.commitTransaction();
	};

	this.abortTransaction = () => {
		return this.mongoSession.abortTransaction();
	};

	this.bulkWrite = (domainClass, ops, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).bulkWrite(ops, options);
	};

	this.countDocuments = (domainClass, conditions) => {
		let query = this.getModel(domainClass).countDocuments(conditions);
		return this.applySessionToQuery(query);
	};

	this.create = (domainClass, doc, options) => {
		let isArray = Array.isArray(doc);
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).create(isArray ? doc : [doc], options)
			.then(dataArray => isArray ? dataArray : dataArray[0]);
	};

	this.createCollection = (domainClass, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).createCollection(doc, options);
	};

	this.createIndexes = (domainClass, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).createIndexes(options);
	};

	this.deleteMany = (domainClass, conditions, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).deleteMany(conditions, options);
	};

	this.deleteOne = (domainClass, conditions, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).deleteOne(conditions, options);
	};

	this.ensureIndexes = (domainClass, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).ensureIndexes(options);
	};

	this.findById = (domainClass, id, projection, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).findById(id, projection, options);
	};

	this.findOne = (domainClass, conditions, projection, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).findOne(conditions, projection, options);
	};

	this.hydrate = (domainClass, obj, projection) => {
		return this.getModel(domainClass).hydrate(obj, projection);
	};

	this.init = (domainClass) => {
		return this.getModel(domainClass).init();
	};

	this.insertMany = (domainClass, arr, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).insertMany(arr, options);
	}

	this.find = (domainClass, conditions, projection, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).find(conditions, projection, options);
	};

	this.findOneAndUpdate = (domainClass, conditions, update, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).findOneAndUpdate(conditions, update, options);
	};

	this.update = (conditions, doc, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).update(conditions, doc, options);
	}

	this.updateMany = (conditions, doc, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).updateMany(conditions, doc, options);
	}

	this.updateOne = (conditions, doc, options) => {
		options = this.applySessionToOptions(options);
		return this.getModel(domainClass).updateOne(conditions, doc, options);
	}

	// ------------------------------------------------------------------ PRIVATE --------------------------------------------------------------
	this.getModel = (domainClass) => {
		return this.models.find(m => m.domainClass === domainClass).model;
	};

	this.applySessionToOptions = (options) => {
		if (this.mongoSession) {
			options = options || {};
			options.session = this.mongoSession;
		}

		return options;
	}

	this.applySessionToQuery = (query) => {
		if (this.mongoSession && query) {
			query.session(this.mongoSession);
		}

		return query;
	}
}

module.exports.MongooseSession = MongooseSession;