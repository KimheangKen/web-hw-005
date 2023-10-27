import React, { useState } from 'react'
import ContentComponent from './ContentComponent'
import SideLeftComponent from './SideLeftComponent'
import SideRightComponent from './SideRightComponent'

export default function MainComponent() {
  const [data, setData] = useState([
    {
      id: 1,
      title: "nananaaa",
      description:
        "Koh Kong Krav Beach is in the 5th place out of 13 beaches in the Koh Kong region The beach is located in a natural place, among the mountains. It is partially covered 	   by trees which give natural shade. It is a spacious coastline with crystal turquoise water and white fine sand, so you don't need special shoes.",
      status: "beach",
      peopleGoing: "1537",
    },
    {
      id: 2,
      title: "phnom sampov",
      description:
        " This legendary 100 metres high mountain, topped by Wat Sampeou, contains 3 natural caves, lined with Buddhist shrines and statues: Pkasla, Lakhaon and Aksopheak.",
      status: "mountain",
      peopleGoing: "81000",
    },
    {
      id: 3,
      title: "kirirom",
      description:
        "Kirirom National Park, a high altitude plateau, is known for its unique high elevation pine forest, which forms the headwaters for numerous streams feeding Kampong 	   	   Speu Town.",
      status: "forest",
      peopleGoing: "2500",
    },
  ]);

  const [newData, setNewData] = useState([]);

  //get data from input
  const inputHandler = (e) => {
  
    setNewData({ ...newData, [e.target.name]: e.target.value })
  }

  // submit data
  const submitHandler = (e) => {
    e.preventDefault();
    setData([...data, { id: data.length + 1, ...newData }])
    setNewData([])
  }

  // update data status
  const changeStatus = (i) => {
    let updatedList = data.map(item => {
      let newStatus;
      if (item.id === i.id) {
        if (item.status === "beach") {
          newStatus = "forest";
        } else if (item.status === "forest") {
          newStatus = "mountain";
        } else if (item.status === "mountain") {
          newStatus = "beach";
        }
        return { ...item, status: newStatus };
      }
      return item;
    });
    setData(updatedList)
  }

  return (
    <div className='flex flex-row justify-between'>
      <SideLeftComponent />
      <ContentComponent data={data} inputHandler={inputHandler} submitHandler={submitHandler} changeStatus={changeStatus} />
      <SideRightComponent />
    </div>
  )
}
