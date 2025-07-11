import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import {Routes, Route, useLocation} from "react-router-dom";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import SeatLayout from "./pages/SeatLayout.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Favourite from "./pages/Favourite.jsx";
import {Toaster} from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import Layout from "./pages/admin/Layout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AddShow from "./pages/admin/AddShow.jsx";
import ListShows from "./pages/admin/ListShows.jsx";
import ListBookings from "./pages/admin/ListBookings.jsx";
import {useAppContext} from "./context/AppContext.jsx";
import {SignIn} from "@clerk/clerk-react";
import Loading from "./components/Loading.jsx";

function App() {

    const isAdminRoute = useLocation().pathname.startsWith("/admin");

    const {user} = useAppContext()

    return (
        <>
            <Toaster />
            {!isAdminRoute && <Navbar />}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/movies' element={<Movies />} />
                <Route path='/movies/:id' element={<MovieDetails />} />
                <Route path='/movies/:id/:date' element={<SeatLayout />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/loading/:nextUrl' element={<Loading />} />
                <Route path='/favourite' element={<Favourite />} />
                <Route path='/admin/*' element={user ? <Layout /> : (
                    <div className={'min-h-screen flex justify-center items-center'}>
                        <SignIn fallbackRedirectUrl={'/admin'}/>
                    </div>
                )} >
                    <Route index element={<Dashboard />} />
                    <Route path='add-shows' element={<AddShow />} />
                    <Route path='list-shows' element={<ListShows />} />
                    <Route path='list-bookings' element={<ListBookings />} />
                </Route>
            </Routes>
            {!isAdminRoute && <Footer />}
        </>
    )
}

export default App;

