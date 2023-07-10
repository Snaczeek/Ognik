import React from 'react'
import Header from '../components/Header'

export const HomePage = () => {
  return (
    
    <div id='main-app'>
      <Header />
      <div id='Home-page'>
        <div className='home-page-container-1'>
          <h1>Do czego służy?</h1>
          <p>Głównym celem Ognika jest zapewnienie wygodnego środowiska do komunikacji ze znajomymi, aplikacja oferuje szereg funkcjonalności, takich jak wysyłanie wiadmości, udostępnianie pilków, możliwość dodawania do znajomych i rozmowy wideo wszystko w czasie rzeczywistym</p>
        </div>
        <div className='home-page-container-2'>
          <h1>Dla czego powstał</h1>
          <p>Stworzyłem Ognika po to aby pokazać moje umiejętności jako web app developer w zakresie rozwoju i komunikacji backendu, zarządzania bazami danych i implementacji bezpiecznych systemów autoryzacji. Wierzę, że Ognik doskonale odzwierciedla moje pasje i umiejętności, a także zdolność do tworzenia solidnych i skalowalnych aplikacji internetowych. </p>
        </div>
        <div className='home-page-container-1'>
          <h1>Użyte technologie</h1>
          <p>Aplikacja korzysta z takich technologi jak: django jako backend, django restframework, django restframework simple jwt dla autoryzacji, react js jako frontend, websocket dla komunikacji w czasie rzeczywistym, webrtc dla rozmów wideo peer to peer. Kod źródłowy można znaleźć na moim githubie LINK</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage