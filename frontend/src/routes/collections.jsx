import {useLocation} from "react-router-dom"
import {useEffect, useState} from 'react'

export default function Collections() {
    const [collections, setCollections] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/collections")
        .then((res) => res.json())
        .then((data) => setCollections(data))
    }, [])

    return (
        <div>
            <h1>All Collections</h1>
            <ul>
                {collections.map((c) => (
                    <li key={c._id}>
                        <a href={`/collections/${c._id}`}>
                            {`${c.owner.username}'s Gen ${c.gen} Collection`}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}