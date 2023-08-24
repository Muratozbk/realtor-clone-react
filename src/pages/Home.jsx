import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
    // offers
    const [offerListings, setOfferListings] = useState(null);
    useEffect(() => {
        async function fetchListings() {
            try {
                // get reference
                const listingRef = collection(db, "listings")
                //create the query
                const q = query(listingRef, where("offer", "==", true),
                    orderBy("timestamp", "desc"), limit(4));

                const querySnap = await getDocs(q)
                const listings = [];
                querySnap.forEach((doc) => {
                    listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setOfferListings(listings)
                console.log(listings)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    }, [])

    return (
        <div>
            <Slider />
            <div className='max-w-6xl mx-auto pt-4 space-y-6'>
                {offerListings && offerListings.length > 0 && (
                    <div className='m-2 mb-6
                    '>
                        <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent offers</h2>
                        <Link to="/offers">
                            <p className='cursor-pointer px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more offers</p>
                        </Link>
                        <ul className="">
                            {/* 23:40 v2 */}
                            {offerListings.map((listing) => (
                                <ListingItem key={listing.id}
                                    listing={listing.data} id={listing.id} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
