import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ColorCard({ hash }) {
  const [data, setData] = useState(null);

  const concatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(
      addr.length - 4,
      addr.length
    )}`;
  };

  useEffect(() => {
    axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`).then((res) => {
      setData(res.data.data);
    });
  }, []);

  return (
    <Link href={`/${data ? data.owner : ""}`}>
      <div
        className="p-6 rounded-xl cursor-pointer hover:scale-105 transition-all"
        style={{ backgroundColor: data?.color || "#00000" }}
      >
        <div
          className="invert font-bold text-center"
          style={{ color: data?.color || "#00000" }}
        >
          {data && concatAddress(data.owner)}
          <div className="text-sm opacity-70">{data && data.name}</div>
        </div>
      </div>
    </Link>
  );
}
