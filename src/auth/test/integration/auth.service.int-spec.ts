import { MongoClient } from 'mongodb';

describe('MongoDB Integration Tests', () => {
  let client: MongoClient;

  beforeAll(async () => {
    const mongoURI = 'mongodb://localhost:27017';
    client = new MongoClient(mongoURI);

    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  it('should insert a document into the collection', async () => {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');
    const document = { username: 'testdb', password: '123456' };

    await collection.insertOne(document);

    const insertedDocument = await collection.findOne({ username: 'testdb' });
    expect(insertedDocument).toEqual(document);
    await collection.deleteMany({});
  });
});
