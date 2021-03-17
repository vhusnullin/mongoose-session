# mongoose-session
Simplifies Session/Transaction use of mongoose. Makes it more Hibernate/EF style.

## Installation

```bash
$ npm install ****
```

## Define Domain types: domain-types.ts

```typescript
interface User {
  firstName: string;
  lastName: string;
}

interface Job {
  title: string;
  location: string;
}
```

## Mongoose Info: mongoose-info.ts

```typescript
import * as Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true }
});

const jobSchema = new Mongoose.Schema({
	title: { type: String, required: true },
	location: { type: String, required: true }
});

const connection = await Mongoose.createConnection('mongodb://localhost/db', {...});
module.exports.connection = connection;
module.exports.models = [{
    domainClass: User,
    model: connection.model<Mongoose.Document>('user', userSchema)
  }, {
    domainClass: Job,
    model: connection.model<Mongoose.Document>('job', jobSchema)
  }];
```

## Usage Session Info

Everytime a web request arrives in ExpressJS/NestJS or any other framework.
You just create a new instance of MongooseSession class and use it as a single object for database communication throughout this request.
Transaction management is easy and testability is great.
MongooseSession class exposes same interface as the actual Mongoose.Model

```typescript
import { connection, models } from 'mongoose-info.ts';
import { User, Job } from 'domain-types.ts';
import { MongooseSession } from 'mongoose-session';

let session = new MongooseSession(models, connection);
try {
  await session.startTransaction();
  let newUser: User = { firstName: 'John', lastName = 'Doe' };
  await session.create(User, newUser);

  let driverJob = await session.find(Job, { title: 'Plumber' });
  driverJob.location = 'San Francisco';
  await session.updateOne(Job, { _id: driverJob._id }, driverJob);
  await session.commitTransaction();
}
catch(err) {
  await session.abortTransaction();
  throw err;
}

```

## Important
- Create single MongooseSession object per each web request.
- Don't forget to call commitTransaction.
- Don't forget to await on Commit, Start and Abort transaction methods.

## Important MongoDB Transaction Support
- MongoDB supports transactions starting from version 4.0
- In order to use transactions - you must start MongoDB with --replSet parameter and some default name of your replSet - for standalone MongoDB just use --replSet rs0. Or go to mongodb.conf and specify replSet=rs0 there. See MongoDB documentation for more info.
