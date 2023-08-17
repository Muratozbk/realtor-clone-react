import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing, id }) {
    console.log(listing.data)
    return (
        <li>
            <Link to={`/category/${listing.type}/${id}`}>
                <img src={listing.imgUrls[0]} alt="" />
            </Link>
            <Moment fromNow>
                {listing.timestamp?.toData()}
            </Moment>
            <div className="">
                <div className="">
                    <MdLocationOn />
                    <p>{listing.address} </p>
                </div>
                <p>{listing.name} </p>
                {/* v-8  18:00 firebase not work */}
            </div>
        </li>
    )
}
