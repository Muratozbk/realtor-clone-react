import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

export default function ListingItem({ listing, id, onEdit, onDelete }) {
    return (
        <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition duration-150 ease-in-out m-2.5'>
            <Link className='contents' to={`/category/${listing.type}/${id}`}>
                <img className='h-[170px] w-full object-cover hover:scale-110 transition duration-200 ease-in-out'
                    loading='lazy'
                    src={listing.imgUrls[0]} alt="listing" />

                <Moment fromNow
                    className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase font-semibold rounded-md px-2 py-1 shadow-lg'>
                    {listing.timestamp?.toDate()}
                </Moment >
                <div className="w-full p-2.5 ">

                    <div className="flex items-center space-x-1">
                        <MdLocationOn className='h-4 w-4 text-green-600' />
                        <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address} </p>
                    </div>
                    <p className='font-semibold m-0 text-xl truncate'>
                        {listing.name} </p>
                    <p className='text-[#457b9d] mt-2 font-semibold '>$
                        {listing.offer ? listing.discountedPrice.toString()
                            .replace(/\B(?=(d{3})+(?!\d))/g, ",") : listing.regularPrice.toString()
                                .replace(/\B(?=(d{3})+(?!\d))/g, ",")} </p>
                    {listing.type === "rent" && " / month"}
                    <div className="flex items-center mt-[10px] space-x-3">
                        <div className="flex items-center space-x-1">
                            <p className='font-semibold text-xs '>
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds ` : "1 Bed"} </p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths ` : "1 Bath"} </p>

                        </div>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <FaTrash className=' absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500'
                    onClick={() => onDelete(listing.id)} />
            )}
            {onEdit && (
                <MdEdit className=' absolute bottom-2 right-7 h-4 cursor-pointer text-black'
                    onClick={() => onEdit(listing.id)} />
                // 11:45 v9
            )}
        </li>
    )
}
