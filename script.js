const userList = [
    {
        id: '1',
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'john@example.com',
        password: 'password1'
      },
      {
        id: '2',
        name: 'Jane Smith',
        phoneNumber: '9876543210',
        email: 'jane@example.com',
        password: 'password2'
      },
      {
        id: '3',
        name: 'Alice Johnson',
        phoneNumber: '5555555555',
        email: 'alice@example.com',
        password: 'password3'
      },
      {
        id: '4',
        name: 'Bob Brown',
        phoneNumber: '1112223333',
        email: 'bob@example.com',
        password: 'password4'
      },
      {
        id: '5',
        name: 'Emily Davis',
        phoneNumber: '9998887777',
        email: 'emily@example.com',
        password: 'password5'
      }
];

const contactList = [
    {
        id: '1',
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'john@example.com',
        isSpam: false,
        user: ['1'] 
      },
      {
        id: '2',
        name: 'Jane Smith',
        phoneNumber: '9876543210',
        email: 'jane@example.com',
        isSpam: true,
        user: ['2'] 
      },
      {
        id: '3',
        name: 'Alice Johnson',
        phoneNumber: '5555555555',
        email: 'alice@example.com',
        isSpam: false,
        user: ['1', '2'] 
      }
];

const { MongoClient } = require('mongodb');

async function addMockUserDatabase() {
    const uri = 'mongodb+srv://manishpune2024:Sanderao11@cluster0.oec10jf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
    const dbName = 'database';
    const collectionName = 'user';
  
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
  
      const result = await collection.insertMany(userList);
      console.log(`${result.insertedCount} documents inserted successfully.`);
  
    } catch (error) {
      console.error('Error inserting mock data:', error);
    } finally {
      await client.close();
    }
  }

async function addMockContactDatabase() {
  const uri = 'mongodb+srv://manishpune2024:Sanderao11@cluster0.oec10jf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
  const dbName = 'database';
  const collectionName = 'contact';

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.insertMany(contactList);
    console.log(`${result.insertedCount} documents inserted successfully.`);

  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    await client.close();
  }
}
addMockUserDatabase();
addMockContactDatabase();
