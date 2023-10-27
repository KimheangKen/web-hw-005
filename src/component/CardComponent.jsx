import React, { useState } from 'react'

const CardComponent = ({ data, changeStatus }) => {

    const [showMore, setShowMore] = useState([]);

    return (
        <div className='gap-4 justify-center grid grid-cols-3 py-5 '>
            {/* Cards */}
            {data.map((item) => (
                <div key={item.id} className="max-w-sm p-6 bg-[#112D4E]  rounded-lg shadow-2xl shadow-gray-500 ">
                    {/* Loop Data */}
                    <h5 className="mb-2 text-2xl font-bold font-inconsolata tracking-tight text-white uppercase ">{item.title === undefined ? "Null" : item.title}</h5>
                    <p className="mb-3 font-normal text-white  line-clamp-3 font-sans">{item.description === undefined ? "Null" : item.description}</p>
                    <p className="mb-1 font-normal text-white font-sans">People Going</p>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white  font-sans">{item.peopleGoing === undefined ? "Null" : item.peopleGoing}</h5>

                    {/* Status Button */}
                    <button onClick={() => changeStatus(item)} className={
                        item.status === undefined ? " btn btn-error w-36 mr-4 text-white"
                            : item.status === "beach" ? " btn btn-info w-36 mr-4 text-white"
                                : item.status === "forest" ? " btn btn-success w-36  mr-4  text-white"
                                    : " btn btn-warning w-36 mr-4  text-white"}
                    >
                       {item.status === undefined ? "Null" : item.status}
                    </button>

                    {/* Read Details popup */}
                    <label onClick={() => setShowMore(item)} htmlFor="my-modal-3" className="btn w-30">Read Details</label>
                    {/* Body popup */}
                    <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                    <div className="modal ">
                        <div className="modal-box  relative bg-[#F9F7F7] ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <h3 className="text-lg text-black font-inconsolata font-bold uppercase">{showMore.title === undefined ? "Null" : showMore.title}</h3>
                            <p className="py-4 text-black font-sans">{showMore.description === undefined ? "Null" : showMore.description}</p>
                            <p className="py-4 text-black font-sans">Around <span className='bg-yellow-300 rounded-full p-1'>{showMore.peopleGoing === undefined ? "Null" : showMore.peopleGoing}</span> people going there</p>
                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    )
}

export default CardComponent