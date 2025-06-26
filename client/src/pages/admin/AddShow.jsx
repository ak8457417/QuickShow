import React, {useEffect, useState} from 'react';
import {dummyShowsData} from "../../assets/assets.js";
import Title from "../../components/admin/Title.jsx";

const AddShow = () => {

    const currency = import.meta.env.VITE_CURRENCY;

    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [dateTimeSelection, setDateTimeSelection] = useState({})
    const [dateTimeInput, setDateTimeInput] = useState("")
    const [showPrice, setShowPrice] = useState("")

    const fetchNowPlayingMovies = async () => {
        setNowPlayingMovies(dummyShowsData)
    }

    useEffect(() => {
        fetchNowPlayingMovies()
    }, []);


    return (
        <>
            <Title text1={"Add "} text2={"Shows"} />
            {/*4.1.31*/}
        </>
    );
};

export default AddShow;
