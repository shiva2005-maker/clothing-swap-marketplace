import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';

const Spinner = () => {
    const [count,setCount] = useState(5);
    const navigate = useNavigate();


    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((prevcount) => --prevcount);
        },1000);
        count === 0 && navigate('/login')
        return () => clearInterval(interval)
    },[count,navigate])


  return (
    <div>

      <Layout>
      redirecting you in {count}
      </Layout>
    </div>
  )
}

export default Spinner
