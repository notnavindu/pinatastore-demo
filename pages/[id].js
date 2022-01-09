import ReactColorPicker from '@super-effective/react-color-picker';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import axios from 'axios';

export default function Page() {
    const [color, setColor] = useState("#f3f3f3")
    const [loading, setLoading] = useState(true)
    const [isOwner, setIsOwner] = useState(false)

    const [name, setName] = useState("")
    const router = useRouter()
    const { id } = router.query

    const updateName = (e) => {
        setName(e.target.value)
    }

    const save = async () => {
        if (typeof window.ethereum !== "undefined") {
            setLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts");
            const signer = provider.getSigner();

            let address = await signer.getAddress()

            const data = {
                name: name,
                color: color
            }
            let signature = ""
            try {
                signature = await signer.signMessage(JSON.stringify(data))
            } catch (error) {
                alert(error.message)
                return
            }

            axios.post("/api/saveColor", { signature: signature, data: data }).then(() => setLoading(false))

            if (address !== id) {
                alert("You are not the owner of this color");
            } else {
                console.log("Saving")
            }
        } else {
            alert("You Need Metamask");
        }
    }

    useEffect(async () => {
        if (id) {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts");
                const signer = provider.getSigner();

                let address = await signer.getAddress()
                if (id === address) {
                    setIsOwner(true);
                }
            }

            axios.post("/api/getColor", { address: id }).then(res => {
                if (res.data?.data) {

                    setColor(res.data.data.color)
                    setName(res.data.data.name)
                }
                setLoading(false)

            })
        }

    }, [id])



    return (
        <div className='w-full min-h-screen grid place-content-center ' style={{ backgroundColor: color }}>

            {loading && <div className='fixed w-full text-center  mt-8 text-3xl font-bold'>LOADING</div>}

            <div className={`scale-75 sm:scale-90 md:scale-100 ${loading && "blur-md pointer-events-none"}`}>
                <div className='w-96 h-96  p-8 bg-white rounded-xl shadow-xl'>
                    <div className='w-full text-center text-sm'>{id}</div>
                    {(process.browser && !loading) &&
                        <ReactColorPicker className={`${!isOwner && "pointer-events-none"}`} color={color} onChange={setColor} />
                    }
                </div>
                <div className='w-full flex gap-2 mt-6 '>
                    {(!loading && isOwner) &&
                        <>
                            <input type="text" defaultValue={name} className='w-full p-3 rounded-md border shadow-xl' placeholder='Enter your Name' onChange={updateName} />
                            <button className='w-20 bg-black rounded-lg text-white text-center shadow-xl' onClick={save}>Save</button>
                        </>
                    }

                    {(!loading && !isOwner) &&
                        <div className='bg-white rounded-lg p-2 w-full'>Owned By <span className='font-bold'>{name || id}</span></div>
                    }


                </div>
            </div>

        </div>
    )

}