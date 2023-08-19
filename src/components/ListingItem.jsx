import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing, id }) {
    return (
        <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition duration-150 ease-in-out'>
            <Link to={`/category/${listing.type}/${id}`}>
                <img className='h-[170px] w-full object-cover hover:scale-110 transition duration-200 ease-in-out'
                    loading='lazy'
                    src={listing.imgUrls[0]} alt="listing" />
            </Link>
            <Moment fromNow
                className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase font-semibold rounded-md px-2 py-1 shadow-lg'>
                {listing.timestamp?.toDate()}
            </Moment >
            <div className="w-full">
                {/* 34:00 */}
                <div className="">
                    <MdLocationOn />
                    <p>{listing.address} </p>
                </div>
                <p>{listing.name} </p>
                <p>${listing.offer ? listing.discountedPrice.toString()
                    .replace(/\B(?=(d{3})+(?!\d))/g, ",") : listing.regularPrice.toString()
                        .replace(/\B(?=(d{3})+(?!\d))/g, ",")} </p>
                {listing.type === "rent" && " / month"}
                <div className="">
                    <div className="">
                        <p>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds ` : "1 Bed"} </p>
                    </div>
                    <div className="">
                        <p>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths ` : "1 Bath"} </p>
                        {/* v-8 26:00 */}
                    </div>
                </div>
            </div>
        </li>
    )
}
