import React from 'react'
import { Oval } from 'react-loader-spinner'

const loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Oval
        height={80}
        width={80}
        color="#000"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#111"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

export default loading
