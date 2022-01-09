import { Pinatastore } from "pinatastore"

export default function handler(req, res) {
    const db = new Pinatastore(process.env.API_KEY, process.env.API_SECRET)

    return db.getCollectionHashes("colors").then(data => {
        return res.status(200).json({ ...data })
    })
}