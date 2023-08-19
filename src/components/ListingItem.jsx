import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({ listing, id }) {
    return (
        <li>
            <Link to={`/category/${listing.type}/${id}`}>
                <img src={listing.imgUrls[0]} alt="" />
            </Link>
            <Moment fromNow>
                {listing.timestamp?.toDate()}
            </Moment>
            <div className="">
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
