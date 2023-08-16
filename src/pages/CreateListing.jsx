import React, { useState } from 'react'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { getAuth } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'

export default function CreateListing() {
    const auth = getAuth()
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    });
    const { type, name, description, address, bedrooms, bathrooms, parking, furnished, offer, images, regularPrice, discountedPrice, latitude, longitude } = formData;

    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false
        }
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price must be less than regular price')
            return;
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error('Maximum 6 images are allowed')
            return;
        }
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json();
            console.log(data);
            geolocation.lat = data.result[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.result[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULT" && undefined;
            if (location === undefined) {
                setLoading(false);
                toast.error("Please enter a correct address")
            }
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
        }
    };
    async function storeImage(image) {
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef = ref(storage, filename)
            const uploadTask = uploadBytesResumable(storageRef, image)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("upload is" + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("paused")
                            break;
                        case "running":
                            console.log("upload is running")
                            break;
                    }
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    async function imgUrls() {
        await Promise.all(
            [...images]
                .map((image) => storeImage(image))
                .catch((error) => {
                    setLoading(false);
                    toast.error("Images not uploaded")
                    return;
                }))
    }

    if (loading) {
        return <Spinner />
    }
    // 1:26
    return (
        <main className='max-w-md px-2 mx-auto '>
            <h1 className='text-3xl text-center mt-6 font-bold'>
                Create a Listing
            </h1>

            <form onSubmit={onSubmit} >
                <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
                <div className="flex">
                    <button type="button" id='type'
                        value="sale" onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        sell
                    </button>
                    <button type="button" id='type'
                        value="rent" onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        rent
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input type="text" id="name"
                    value={name} onChange={onChange}
                    placeholder='Name' max="32" min="8" required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />
                <div className=" flex justify-start mb-6 space-x-6">
                    <div>
                        <p className='w-full text-lg font-semibold'>Beds</p>
                        <input type="number" id="bedrooms"
                            className='px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center '
                            value={bedrooms}
                            onChange={onChange} min={'1'} max={'20'} required />
                    </div>
                    <div>
                        <p className='text-lg w-full font-semibold'>Baths</p>
                        <input type="number" id="bathrooms"
                            className='px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center '
                            value={bathrooms}
                            onChange={onChange} min={'1'} max={'20'} required />
                    </div>
                </div>
                <p className='text-lg mt-6 font-semibold'>Parking Spot</p>
                <div className="flex">
                    <button type="button" id='parking'
                        value={true} onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        Yes
                    </button>
                    <button type="button" id='parking'
                        value={false} onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        No
                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className="flex">
                    <button type="button" id='furnished'
                        value={true} onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        Yes
                    </button>
                    <button type="button" id='furnished'
                        value={false} onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        No
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea type="text" id="address"
                    value={address} onChange={onChange}
                    placeholder='Address' required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-4' />
                {!geolocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input type="number" id="latitude"
                                value={latitude}
                                onChange={onChange}
                                required
                                min={"-90"} max={"90"}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' />
                        </div>
                        <div className="">
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input type="number" id="longitude"
                                value={longitude}
                                onChange={onChange}
                                required
                                min={"-180"} max={"180"}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' />
                        </div>
                    </div>
                )}
                <p className='text-lg font-semibold'>Description</p>
                <textarea type="text" id="description"
                    value={description} onChange={onChange}
                    placeholder='Description' required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

                <p className='text-lg font-semibold'>Offer</p>
                <div className="flex mb-6">
                    <button type="button" id='offer'
                        value={true} onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        Yes
                    </button>
                    <button type="button" id='offer'
                        value={false} onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                        No
                    </button>
                </div>

                <div className="flex items-center mb-6">
                    <div className="">
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className="flex w-full justify-center items-center space-x-6">
                            <input type="number" id='regularPrice'
                                value={regularPrice}
                                onChange={onChange} min={"50"} max={"999999999"} required
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                            {type === 'rent' && (
                                <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                            )}
                        </div>
                    </div>
                </div>

                {offer && (
                    <div className="flex items-center mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>Discounted price</p>
                            <div className="flex w-full justify-center items-center space-x-6">
                                <input type="number" id='discountedPrice'
                                    value={discountedPrice}
                                    onChange={onChange} min={"50"} max={"999999999"} required={offer}
                                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                                {type === 'rent' && (
                                    <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="mb-6 ">
                    <p className='text-lg font-semibold'>Images</p>
                    <p className='text-gray-600 '>The first image will be cover (max 6)</p>
                    <input type="file" id="images"
                        onChange={onChange}
                        accept='.jpg, .png, .jpg' multiple required
                        className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' />
                </div>
                <button type="submit" className='w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-800 active:shadow-lg transition duration-150 ease-in-out'>Create Listing</button>
            </form>
        </main>
    )
}
