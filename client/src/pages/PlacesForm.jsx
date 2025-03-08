import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom'
import Perks from '../components/perks';
import axios from 'axios';
import PhotosUploader from '../components/PhotosUploader';
import AccountNavigation from '../components/AccountNavigation';
const PlacesForm = () => {
    const { id } = useParams();
    console.log(id);

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedphotos, setAddedphotos] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxguest, setMaxguest] = useState(1);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(res => {
            console.log('ID', id)
            const { data } = res;
            console.log(data)
            setTitle(data[0].title || '');
            setAddress(data[0].address || '');
            setAddedphotos(data[0].photos || []);
            setDescription(data[0].description || '');
            setPerks(data[0].perks || []);
            setExtraInfo(data[0].extraInfo || '');
            setCheckIn(data[0].checkIn || '');
            setCheckOut(data[0].checkOut || '');
            setMaxguest(data[0].maxguest || 1);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function savePlace(ev) {
        ev.preventDefault();
        if (id) {

            const placeData = { id, title, address, addedphotos, description, perks, extraInfo, checkIn, checkOut, maxguest }
            // alert("id present");
            await axios.put('/places', placeData)
            setRedirect(true);
            alert(redirect);
        } else {
            const placeData = { title, address, addedphotos, description, perks, extraInfo, checkIn, checkOut, maxguest }
            await axios.post('/places', placeData)
        }
        
            return <Navigate to={'/account/places'} />
         
    }
    
    return (
        <div><AccountNavigation />
            <form onSubmit={savePlace} >
                <h2 className="text-xl mt-4">Title</h2>
                <p className='text-gray-500 text-sm'>title for your place should be short and catchy</p>
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title,for eg:My Lovel Apartment" />
                <h2 className="text-xl mt-4">Address</h2>
                <p className='text-gray-500 text-sm'>Address to your place should be accurate</p>
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
                <h2 className="text-xl mt-4">Photos</h2>

                <p className='text-gray-500 text-sm'>The more the merrier</p>
                <PhotosUploader addedphotos={addedphotos} onChange={setAddedphotos} />
                <h2 className='text-2xl mt-4'>Description</h2>
                <p className='text-gray-500 text-sm'>Add a nice Description of your place</p>
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                <h2 className='text-2xl mt-4'>Perks</h2>
                <p className='text-gray-500 text-sm'>Select all the Perks of your place </p>
                <Perks selected={perks} onChange={setPerks} />
                <h2 className='text-2xl mt-4'>Extra Info </h2>
                <p className='text-gray-500 text-sm'>house rules etc </p>
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                <h2 className='text-2xl mt-4'>Check in&out times , max guests </h2>
                <p className='text-gray-500 text-sm'>add checkin and out times ,remember to have some time window for cleaning and service  </p>
                <div className='grid sm:grid-cols-3 gap-2'>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check In Time </h3>
                        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder='14:00' /></div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Check Out Time </h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder='14:00' />
                    </div>
                    <div>
                        <h3 className='mt-2 -mb-1'>Max Guests</h3>
                        <input type="number" value={maxguest} onChange={ev => setMaxguest(ev.target.value)} /></div>

                </div>
                <div className=''>
                    <button className='primary my-4' type='submit'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default PlacesForm
