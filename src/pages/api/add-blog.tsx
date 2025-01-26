
import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<boolean>
) => {
    if (req.method === 'POST') {
        const { blog } = req.body;
        const client = new MongoClient(process.env.MONGODB_URI as string);
        await client.connect();
        const database = client.db('portfolio');
        const collection = database.collection('blogs');
        await collection.insertOne(blog);
        await client.close();
        res.status(200).json(true);
    } else {
        res.status(405).json(false);
    }
};

export default handler;
