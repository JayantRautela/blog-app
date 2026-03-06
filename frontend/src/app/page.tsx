'use client';
import Loading from '@/components/loading';
import { useAppData } from '@/context/AppContext'
import React from 'react'

const Home = () => {
  const { loading } = useAppData();
  return (
    <div>
      {loading ? <Loading /> : "Home"}
    </div>
  )
}

export default Home
