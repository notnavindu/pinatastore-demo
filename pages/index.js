import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from "ethers";
import axios from 'axios';
import ColorCard from '../components/Colorcard';


export default function Home() {
  const [loading, setLoading] = useState(false)
  const [allColors, setAllColors] = useState(null)
  const router = useRouter()

  const getColor = async () => {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts");
      const signer = provider.getSigner();

      let address = await signer.getAddress()
      router.push(`/${address}`)
    } else {
      alert("You Need Metamask");
    }
  }

  const getAllColors = () => {
    axios.get("/api/getAll").then(res => {
      setAllColors(res.data)
    })
  }



  useEffect(() => {
    getAllColors()
  }, [])

  return (
    <div >
      <Head>
        <title>Colorstore</title>
        <meta name="description" content="Pinatastore Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='w-full min-h-screen bg-black flex  flex-col items-center'>
        <div className='font-mono text-5xl text-white mt-8'>Colorstore</div>
        <button className={`w-full max-w-xs text-white rounded-md mt-4 p-4 flex  justify-center items-center font-bold
          uppercase  transition-all ${loading ? "bg-gray-700" : "bg-blue-500 hover:scale-105 cursor-pointer"}`}
          disabled={loading}
          onClick={getColor}>
          Save My Color
        </button>

        <div className='w-full max-w-4xl flex flex-wrap justify-center items-center mt-8 gap-8'>
          {allColors &&
            Object.keys(allColors).map(el => {
              return <ColorCard hash={allColors[el]} key={el} />
            })
          }

          {!allColors && <div className='text-white'>LOADING</div>}
        </div>

      </main>

    </div>
  )
}
