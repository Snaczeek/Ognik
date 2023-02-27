import homeCSS from "../styles/home.module.css";
import React from 'react'
import Header from '../components/Header'
import HomeContainer from "../components/HomeContent";

export const HomePage = () => {
  return (

    <>
      <div className={homeCSS.flex_container}>
        <Header />
        <HomeContainer />
      </div>
    </>
  )
}

export default HomePage