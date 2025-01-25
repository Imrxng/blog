import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<boolean>
) => {
    if (req.method === 'POST') {
        const { password } = req.body;
        const hashedPassword = process.env.ADMIN_PASSWORD as string;
        
        const isMatch = await bcrypt.compare(password, "$2b$10$dPkgYypTEvzMJ1xxJMlzSO7y7qtl4C3BhvSlfxwwj/.XhhwJqhdBO");
        if (isMatch) {
            res.status(200).json(true);
        } else {
            res.status(401).json(false);
        }
    } else {
        res.status(405).json(false); 
    }
};

export default handler;
