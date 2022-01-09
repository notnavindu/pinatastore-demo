import { Pinatastore } from "pinatastore"

export default function handler(req, res) {
    const db = new Pinatastore(process.env.API_KEY, process.env.API_SECRET)

    return db.getDoc("colors", req.body.address).then(data => {
        return res.status(200).json({ ...data })
    })

}