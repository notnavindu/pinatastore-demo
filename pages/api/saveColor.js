import { Pinatastore } from "pinatastore"
import { ethers } from "ethers"

export default function handler(req, res) {
    if (!req.body.data || !req.body.signature) {
        return { code: 400, message: "Invalid request" };
    }

    const db = new Pinatastore(process.env.API_KEY, process.env.API_SECRET)

    let address = ethers.utils.verifyMessage(JSON.stringify(req.body.data), req.body.signature)

    const finalData = {
        ...req.body.data,
        owner: address
    }

    return db.set("colors", address, finalData).then((d) => {
        return res.status(200).json({ success: true })
    })
}