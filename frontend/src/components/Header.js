import homeCSS from "./../styles/home.module.css";
import "./../styles/home.css";
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import Logo from './GitLogo';


const Header = () => {
  let { user, logoutUser } = useContext(AuthContext)
  return (
    <>
      <nav>
        <section className={homeCSS.header}>
          <div className={homeCSS.header_logo}>
            <Link to="/">
              <img src={require("./../img/logogo.png")} alt="Ognik" className={homeCSS.logo_img} />
              <p className={homeCSS.logo_text}>gnik</p>
            </Link>
          </div>
          <div className={homeCSS.nav_links}>
            <Link to="/test">test</Link>
            <Link to="/test">about</Link>
            <Link to="/test">learn more</Link>
            <Link to="/"><Logo width={100} /></Link>
          </div>
          {/* <div className={homeCSS.user_nick}>
            {user && <h1>Hello {user.username}</h1>}
          </div> */}
          <section className={homeCSS.account_btn}>
            <div className="">
              {
                user ? (
                  <button className={homeCSS.header_btn} onClick={logoutUser}>Logout</button>
                ) : (
                  <Link to="/login"><button className={homeCSS.header_btn}>Login</button></Link>
                )
              }
            </div>
            <div className={homeCSS.register}>
              <button className={homeCSS.header_btn}>Register</button>
            </div>
          </section>


        </section>
      </nav>
    </>
  )
}

export default Header
